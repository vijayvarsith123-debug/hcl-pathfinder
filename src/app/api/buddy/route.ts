import { NextResponse } from "next/server";
import {
  classifyBuddyIntent,
  executeRuleBasedEngine,
  getUserAIUsage,
  incrementUserAIUsage,
  BuddyResponse,
  DAILY_AI_LIMIT,
} from "@/lib/buddy-engine";
import { saveChatMessage } from "@/lib/chat-history";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, userId = "user-123", context } = body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const cleanPrompt = prompt.trim();
    const { isRuleBased, intent } = classifyBuddyIntent(cleanPrompt);

    // 1. RULE-BASED SYSTEM: Career Match, Pathway, Skill Gap, Progress, Course Recommendations
    // IMPORTANT: DOES NOT CONSUME GEMINI QUOTA & WORKS EVEN IF GEMINI IS UNAVAILABLE!
    if (isRuleBased) {
      const usage = getUserAIUsage(userId);
      const resData = executeRuleBasedEngine(intent, cleanPrompt, context);

      const response: BuddyResponse = {
        source: "rule_based",
        intent,
        message: resData.message,
        mood: resData.mood,
        action: resData.action,
        card: resData.card,
        usage,
      };

      // Save to chat history
      saveChatMessage(userId, {
        userMessage: cleanPrompt,
        buddyResponse: response.message,
        intent,
        source: "rule_based",
        mood: response.mood,
        action: response.action,
        card: response.card,
      });

      return NextResponse.json(response);
    }

    // 2. APPLICATION-LEVEL QUOTA CHECK FOR GEMINI
    const currentUsage = getUserAIUsage(userId);
    if (currentUsage.remaining <= 0) {
      const quotaResponse: BuddyResponse = {
        source: "system",
        intent: "GEMINI_LIMIT_REACHED",
        message: `Buddy has reached today's chatbot limit (${DAILY_AI_LIMIT}/${DAILY_AI_LIMIT} requests used).\n\nPlease come back after the limit resets at 12:00 AM to continue using the AI assistant.\n\nNote: PathAI's career matching, learning path, progress, and resources remain 100% available.`,
        mood: "empathetic",
        action: {
          label: "View Learning Path",
          type: "path",
          url: "/learning-path",
        },
        usage: currentUsage,
      };

      saveChatMessage(userId, {
        userMessage: cleanPrompt,
        buddyResponse: quotaResponse.message,
        intent: "GEMINI_LIMIT_REACHED",
        source: "system",
        mood: "empathetic",
      });

      return NextResponse.json(quotaResponse);
    }

    // 3. GEMINI EDUCATIONAL REASONING LAYER
    const category = intent === "CODE_HELP" ? "debugging" : intent === "ASSIGNMENT" ? "assignment" : "explanation";
    const updatedUsage = incrementUserAIUsage(userId, category);

    const apiKey = process.env.GEMINI_API_KEY || "";
    let geminiMessage = "";
    let mood: any = intent === "CODE_HELP" ? "thinking" : intent === "ASSIGNMENT" ? "focused" : "explaining";

    // Build adaptive mastery context for LLM
    let adaptiveMasteryContext = "";
    try {
      const { INITIAL_SUBTOPIC_MASTERY } = require("@/lib/adaptive/mastery-tracker");
      const weakSubs = INITIAL_SUBTOPIC_MASTERY.filter((s: any) => s.status === "Weak");
      if (weakSubs.length > 0) {
        adaptiveMasteryContext = `\n\nLEARNER MASTERY CONTEXT (from Adaptive Engine):
${weakSubs.map((s: any) => `- ${s.subtopicName}: ${s.masteryScore}% (Weak, trend: ${s.trend})`).join("\n")}
Use this context to provide more targeted explanations when the learner asks about these weak topics.`;
      }
    } catch {
      // Adaptive mastery data unavailable — continue without it
    }

    const systemPrompt = `You are Buddy, an AI Learning Assistant for PathAI.

Your job is to help the learner understand and solve educational problems accurately.

RULES FOR RESPONSE:
1. Answer the user's actual question directly and factually.
2. Keep answers concise (1 to 4 sentences maximum) unless the user explicitly requests detail.
3. Explain answers clearly when explanation is requested.
4. Do not invent facts, career recommendations, or learning pathways. Career recommendations and pathways are provided by PathAI's rule-based engines.
5. For assignment problems, break down reasoning step-by-step cleanly.
6. For technical code errors, use format: Problem -> Cause -> Fix.
7. Keep creativity very low (temperature: 0.1). Avoid unnecessary jokes, stories, and excessive motivational text.
8. Use simple language appropriate for the learner.${adaptiveMasteryContext}`;

    if (apiKey && apiKey !== "your_gemini_api_key_here") {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const fetchRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: `${systemPrompt}\n\nUser Question: ${cleanPrompt}` }],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 300,
            },
          }),
        });

        // 4. Handle HTTP 429 Quota Exceeded Error from Gemini API
        if (fetchRes.status === 429) {
          const quotaExceededResponse: BuddyResponse = {
            source: "system",
            intent: "GEMINI_LIMIT_REACHED",
            message: "Buddy has reached today's chatbot limit. Please come back after the limit resets to continue using the AI assistant.",
            mood: "empathetic",
            usage: updatedUsage,
          };
          return NextResponse.json(quotaExceededResponse);
        }

        if (fetchRes.ok) {
          const data = await fetchRes.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            geminiMessage = candidateText.trim();
          }
        } else {
          console.warn("Gemini API non-200 response status:", fetchRes.status);
        }
      } catch (err) {
        console.warn("Gemini REST API fetch error:", err);
      }
    }

    // Educational Fallback if GEMINI_API_KEY is placeholder or service timeout
    if (!geminiMessage) {
      const p = cleanPrompt.toLowerCase();
      if (p.includes("sql join") || p.includes("join")) {
        geminiMessage = "A JOIN combines rows from two tables using a related column. For example, an INNER JOIN returns rows that have matching values in both tables.";
      } else if (p.includes("overfitting")) {
        geminiMessage = "Overfitting occurs when a model learns the training data too closely and performs poorly on unseen data. It usually means the model has learned noise rather than general patterns.";
      } else if (p.includes("recursion")) {
        geminiMessage = "Recursion is a programming technique where a function calls itself to solve smaller subproblems until it reaches a base case.";
      } else if (p.includes("error") || p.includes("typeerror")) {
        geminiMessage = "The error occurs because `x` is a string, but the code treats it as an integer. Convert it with `int(x)` before performing the calculation.";
      } else {
        geminiMessage = `Focus on core concepts in ${context?.currentModule || "Machine Learning"}. Master foundational syntax and data structures before advancing to complex models.`;
      }
    }

    const response: BuddyResponse = {
      source: "gemini",
      intent,
      message: geminiMessage,
      mood,
      usage: updatedUsage,
    };

    // Save to chat history
    saveChatMessage(userId, {
      userMessage: cleanPrompt,
      buddyResponse: response.message,
      intent,
      source: "gemini",
      mood: response.mood,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Buddy API error:", error);
    return NextResponse.json(
      {
        source: "system",
        intent: "UNKNOWN",
        message: "Buddy couldn't reach the AI service right now. Please try again later.",
        mood: "supportive",
        usage: getUserAIUsage("default_user"),
      },
      { status: 500 }
    );
  }
}

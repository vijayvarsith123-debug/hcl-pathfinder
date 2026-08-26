import { BuddyMood } from "@/components/buddy/BuddyAvatar";
import { calculateCareerMatches } from "./career-engine";
import { getCareerPathwayData } from "./pathway-engine";

export type HybridIntent =
  | "CAREER_MATCH"
  | "CAREER_PATHWAY"
  | "PROGRESS"
  | "SKILL_GAP"
  | "COURSE_RECOMMENDATION"
  | "GREETING"
  | "ASSIGNMENT"
  | "EXPLANATION"
  | "CODE_HELP"
  | "GENERAL_LEARNING"
  | "GEMINI_LIMIT_REACHED"
  | "UNKNOWN";

export interface BuddyAction {
  label: string;
  type: "practice" | "path" | "resource" | "assessment" | "link";
  url: string;
}

export interface BuddyContextCard {
  title: string;
  subtitle?: string;
  value?: string;
  tag?: string;
  actionLabel?: string;
  actionUrl?: string;
}

export interface AIUsageData {
  used: number;
  remaining: number;
  limit: number;
  resetAt: string;
  breakdown?: {
    explanations: number;
    assignments: number;
    debugging: number;
  };
}

export interface BuddyResponse {
  source: "rule_based" | "gemini" | "system";
  intent: HybridIntent;
  message: string;
  mood: BuddyMood;
  action?: BuddyAction;
  card?: BuddyContextCard;
  usage: AIUsageData;
}

export const DAILY_AI_LIMIT = 20;

interface UsageRecord {
  date: string;
  totalRequests: number;
  explanations: number;
  assignments: number;
  debugging: number;
}

const userUsageStore: { [userId: string]: UsageRecord } = {};

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function getUserAIUsage(userId: string = "default_user"): AIUsageData {
  const today = getTodayString();
  const record = userUsageStore[userId];

  if (!record || record.date !== today) {
    userUsageStore[userId] = {
      date: today,
      totalRequests: 0,
      explanations: 0,
      assignments: 0,
      debugging: 0,
    };
  }

  const current = userUsageStore[userId];
  const used = current.totalRequests;
  const remaining = Math.max(0, DAILY_AI_LIMIT - used);

  return {
    used,
    remaining,
    limit: DAILY_AI_LIMIT,
    resetAt: "12:00 AM",
    breakdown: {
      explanations: current.explanations,
      assignments: current.assignments,
      debugging: current.debugging,
    },
  };
}

export function incrementUserAIUsage(
  userId: string = "default_user",
  category: "explanation" | "assignment" | "debugging" = "explanation"
) {
  getUserAIUsage(userId);
  const current = userUsageStore[userId];
  current.totalRequests += 1;
  if (category === "assignment") current.assignments += 1;
  else if (category === "debugging") current.debugging += 1;
  else current.explanations += 1;
  return getUserAIUsage(userId);
}

/**
 * Message Router / Hybrid Intent Classifier
 * Categorizes user message to determine whether Rule Engine or Gemini handles the request.
 */
export function classifyBuddyIntent(message: string): {
  isRuleBased: boolean;
  intent: HybridIntent;
} {
  const p = message.toLowerCase().trim();

  // Greetings
  if (p === "hi" || p === "hello" || p === "hey" || p === "hey buddy" || p.includes("good morning") || p.includes("good evening")) {
    return { isRuleBased: true, intent: "GREETING" };
  }

  // 1. Career Questions (Career Matching Engine)
  if (
    p.includes("what career") ||
    p.includes("which career") ||
    p.includes("what can i become") ||
    p.includes("career match") ||
    p.includes("suitable for me") ||
    p.includes("career should i choose") ||
    p.includes("career path should i follow") ||
    p.includes("why was this career recommended")
  ) {
    return { isRuleBased: true, intent: "CAREER_MATCH" };
  }

  // 2. Pathway Questions (Pathway Engine)
  if (
    p.includes("what should i learn next") ||
    p.includes("next step") ||
    p.includes("what comes after") ||
    p.includes("prerequisites for") ||
    p.includes("learning pathway") ||
    p.includes("next module") ||
    p.includes("what to learn for this career")
  ) {
    return { isRuleBased: true, intent: "CAREER_PATHWAY" };
  }

  // 3. Progress Questions
  if (
    p.includes("how much of my") ||
    p.includes("my progress") ||
    p.includes("completed") ||
    p.includes("course progress") ||
    p.includes("overall progress") ||
    p.includes("how far am i")
  ) {
    return { isRuleBased: true, intent: "PROGRESS" };
  }

  // 4. Skill Gap Questions
  if (
    p.includes("weakest skill") ||
    p.includes("weak area") ||
    p.includes("skill gap") ||
    p.includes("where am i struggling") ||
    p.includes("lowest score")
  ) {
    return { isRuleBased: true, intent: "SKILL_GAP" };
  }

  // 5. Course & Resource Recommendations
  if (
    p.includes("recommend resources") ||
    p.includes("show me resources") ||
    p.includes("courses for") ||
    p.includes("where to learn")
  ) {
    return { isRuleBased: true, intent: "COURSE_RECOMMENDATION" };
  }

  // Gemini Intent: Code Debugging
  if (p.includes("error") || p.includes("bug") || p.includes("traceback") || p.includes("typeerror") || p.includes("syntaxerror")) {
    return { isRuleBased: false, intent: "CODE_HELP" };
  }

  // Gemini Intent: Assignment
  if (p.includes("solve") || p.includes("assignment") || p.includes("exercise") || p.includes("homework") || p.includes("solution")) {
    return { isRuleBased: false, intent: "ASSIGNMENT" };
  }

  // Gemini Intent: Concept Explanation
  if (p.includes("explain") || p.includes("why is my answer wrong") || p.includes("what is") || p.includes("how does") || p.includes("why")) {
    return { isRuleBased: false, intent: "EXPLANATION" };
  }

  return { isRuleBased: false, intent: "GENERAL_LEARNING" };
}

/**
 * Deterministic Rule-Based Engine Handler
 * Serves deterministic answers from Career Matching Engine, Pathway Engine, and Skill DB.
 * DOES NOT consume Gemini API quota and works even when Gemini is unavailable!
 */
export function executeRuleBasedEngine(
  intent: HybridIntent,
  message: string,
  userContext: any
): { message: string; mood: BuddyMood; action?: BuddyAction; card?: BuddyContextCard } {
  const profile = userContext?.profile || { careerGoal: "Machine Learning Engineer" };
  const userSkills = userContext?.userSkills || { Python: 72, SQL: 55, Mathematics: 45, Statistics: 32, "Machine Learning": 10 };
  const assessmentScores = userContext?.assessmentScores || { Python: 75, SQL: 60, Mathematics: 50 };

  switch (intent) {
    case "GREETING":
      return {
        message: `Hello ${profile.fullName ? profile.fullName.split(" ")[0] : "Learner"}! I'm Buddy, your AI Learning Assistant. Your active goal is ${profile.careerGoal}. What would you like to learn today?`,
        mood: "happy",
        action: {
          label: "What should I learn next?",
          type: "path",
          url: "/learning-path",
        },
      };

    case "CAREER_MATCH": {
      const matches = calculateCareerMatches({
        careerGoal: profile.careerGoal,
        userSkills,
        assessmentScores,
        interests: ["AI", "Machine Learning", "Python", "Problem Solving"],
      });

      const topMatch = matches[0];
      const secondMatch = matches[1];

      return {
        message: `${topMatch.title} is your top career match with an ${topMatch.matchPercentage}% match score, followed by ${secondMatch.title} (${secondMatch.matchPercentage}%).\n\nKey matching skills: ${topMatch.topMatchingSkills.join(", ")}. Missing prerequisites: ${topMatch.missingSkills.join(", ")}.`,
        mood: "encouraging",
        action: {
          label: `Explore ${topMatch.title} Roadmap`,
          type: "path",
          url: "/learning-path",
        },
        card: {
          title: "CAREER MATCH ANALYSIS",
          subtitle: topMatch.title,
          value: `${topMatch.matchPercentage}% Match`,
          tag: "Top Recommendation",
          actionLabel: "View Roadmap",
          actionUrl: "/learning-path",
        },
      };
    }

    case "CAREER_PATHWAY": {
      const pathway = getCareerPathwayData("ml_engineer", userSkills);
      const current = pathway.currentStep;

      return {
        message: `Your recommended next step for ${pathway.careerTitle} is Step ${current.stepNumber}: ${current.title}.\n\nCurrent pathway progress: ${pathway.overallProgressPercentage}% completed. Key skills to focus on: ${current.skills.join(", ")}.`,
        mood: "focused",
        action: {
          label: `Start ${current.title}`,
          type: "path",
          url: "/learning-path",
        },
        card: {
          title: "NEXT PATHWAY STEP",
          subtitle: current.title,
          value: `${pathway.overallProgressPercentage}% Total Progress`,
          tag: `Step ${current.stepNumber} of ${pathway.totalSteps}`,
          actionLabel: "Go to Roadmap",
          actionUrl: "/learning-path",
        },
      };
    }

    case "SKILL_GAP": {
      const skillEntries = Object.entries(userSkills).map(([skill, score]) => ({ skill, score }));
      skillEntries.sort((a, b) => (a.score as number) - (b.score as number));
      const weakest = skillEntries[0] || { skill: "Statistics", score: 32 };
      const statusTag = (weakest.score as number) < 60 ? "Weak" : (weakest.score as number) < 80 ? "Developing" : "Mastered";

      return {
        message: `${weakest.skill} is currently your weakest skill at ${weakest.score}% (${statusTag}). Target proficiency is 70%. Practice this before advancing.`,
        mood: "focused",
        action: {
          label: `Practice ${weakest.skill}`,
          type: "practice",
          url: "/assessments",
        },
        card: {
          title: "SKILL GAP DETECTED",
          subtitle: weakest.skill,
          value: `${weakest.score}% Proficiency`,
          tag: statusTag,
          actionLabel: "Take Assessment",
          actionUrl: "/assessments",
        },
      };
    }

    case "PROGRESS": {
      const pathway = getCareerPathwayData("ml_engineer", userSkills);
      return {
        message: `You have completed ${pathway.completedStepsCount} of ${pathway.totalSteps} pathway modules (${pathway.overallProgressPercentage}% total roadmap completion). You are currently active on: ${pathway.currentStep.title}.`,
        mood: "encouraging",
        action: {
          label: "View Progress Details",
          type: "path",
          url: "/progress",
        },
      };
    }

    case "COURSE_RECOMMENDATION":
    default: {
      return {
        message: `Here are recommended free resources for your active module: 1. Scikit-Learn Official User Guide (Documentation) 2. Kaggle Machine Learning Micro-Course (Practice) 3. StatQuest ML Series (Video).`,
        mood: "explaining",
        action: {
          label: "View All Resources",
          type: "resource",
          url: "/resources",
        },
      };
    }
  }
}

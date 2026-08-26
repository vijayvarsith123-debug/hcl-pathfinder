"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BuddyAvatar, BuddyMood } from "./BuddyAvatar";
import { BuddyResponse, AIUsageData, DAILY_AI_LIMIT } from "@/lib/buddy-engine";
import { getChatHistory, saveChatMessage } from "@/lib/chat-history";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  Send,
  User,
  BookOpen,
  CheckSquare,
  HelpCircle,
  Code,
  ArrowRight,
  Info,
  Clock,
  Zap,
  Target,
  Briefcase,
} from "lucide-react";

export interface ChatMessage {
  id: string;
  sender: "user" | "buddy";
  text: string;
  mood?: BuddyMood;
  timestamp: string;
  action?: BuddyResponse["action"];
  card?: BuddyResponse["card"];
  source?: "rule_based" | "gemini" | "system";
}

export const BuddyChat: React.FC = () => {
  const { profile, userSkills, requiredSkills, modules, weeklyPlan } = useApp();

  const currentModule =
    modules.find((m) => m.status === "in_progress" || m.status === "next")?.title ||
    "Machine Learning Fundamentals";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState<BuddyMood>("happy");
  const [isUsagePanelOpen, setIsUsagePanelOpen] = useState(false);

  // Live Usage Tracking State
  const [usageData, setUsageData] = useState<AIUsageData>({
    used: 0,
    remaining: DAILY_AI_LIMIT,
    limit: DAILY_AI_LIMIT,
    resetAt: "12:00 AM",
    breakdown: {
      explanations: 0,
      assignments: 0,
      debugging: 0,
    },
  });

  // Load chat history from localStorage on initial mount
  useEffect(() => {
    const history = getChatHistory(profile.userId || "user-123");
    if (history && history.length > 0) {
      const formatted: ChatMessage[] = [];
      history.forEach((h) => {
        formatted.push({
          id: `usr-${h.id}`,
          sender: "user",
          text: h.userMessage,
          timestamp: h.timestamp,
        });
        formatted.push({
          id: `buddy-${h.id}`,
          sender: "buddy",
          text: h.buddyResponse,
          mood: h.mood,
          timestamp: h.timestamp,
          action: h.action,
          card: h.card,
          source: h.source,
        });
      });
      setMessages(formatted);
      setCurrentMood(history[history.length - 1].mood || "happy");
    } else {
      // Default welcome message
      setMessages([
        {
          id: "init-1",
          sender: "buddy",
          mood: "happy",
          text: `Great to see you, ${profile.fullName.split(" ")[0]}! I'm Buddy, your AI Learning Assistant.\n\nYour active goal is ${profile.careerGoal} and your current focus is ${currentModule}. What would you like to learn today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          action: {
            label: "What should I learn next?",
            type: "path",
            url: "/learning-path",
          },
          source: "rule_based",
        },
      ]);
    }
  }, [profile.userId, profile.fullName, profile.careerGoal, currentModule]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputText("");
    setIsLoading(true);
    setCurrentMood("thinking");

    try {
      const res = await fetch("/api/buddy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          userId: profile.userId || "user-123",
          context: {
            profile,
            userSkills,
            requiredSkills,
            modules,
            weeklyPlan,
            currentModule,
          },
        }),
      });

      if (res.ok) {
        const data: BuddyResponse = await res.json();
        const buddyMood = data.mood || "focused";
        setCurrentMood(buddyMood);
        if (data.usage) setUsageData(data.usage);

        const buddyMsg: ChatMessage = {
          id: `buddy-${Date.now()}`,
          sender: "buddy",
          text: data.message,
          mood: buddyMood,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          action: data.action,
          card: data.card,
          source: data.source,
        };

        setMessages((prev) => [...prev, buddyMsg]);
      } else {
        throw new Error("Failed to reach Buddy API");
      }
    } catch (err) {
      setCurrentMood("supportive");
      const fallbackMsg: ChatMessage = {
        id: `buddy-err-${Date.now()}`,
        sender: "buddy",
        mood: "supportive",
        text: "Buddy couldn't reach the AI service right now. Please try again later.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        action: {
          label: "View Learning Path",
          type: "path",
          url: "/learning-path",
        },
        source: "system",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: "Career Match", icon: Briefcase, prompt: "What career is suitable for me?" },
    { label: "What Next?", icon: Target, prompt: "What should I learn next?" },
    { label: "Skill Gap", icon: CheckSquare, prompt: "What is my weakest skill?" },
    { label: "Explain", icon: BookOpen, prompt: "Explain Decision Tree Gini Impurity simply." },
    { label: "Assignment Help", icon: Code, prompt: "Solve this Python assignment on array sorting." },
    { label: "Hint", icon: HelpCircle, prompt: "Give me a hint for evaluating precision vs recall." },
  ];

  return (
    <div className="space-y-4">
      {/* CHAT CONTAINER */}
      <Card className="shadow-sm border-slate-200 bg-white flex flex-col h-[580px] overflow-hidden">
        {/* HEADER BAR */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <BuddyAvatar mood={isLoading ? "thinking" : currentMood} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-white tracking-tight">Buddy</h3>
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px] py-0 px-1.5 font-bold">
                  Hybrid AI Assistant
                </Badge>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">Rule-Based Engines + Gemini Assistance Layer</p>
            </div>
          </div>

          {/* AI USAGE BADGE */}
          <button
            onClick={() => setIsUsagePanelOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            title="Click to view AI daily usage panel"
          >
            <Zap className={`h-3.5 w-3.5 ${usageData.remaining <= 3 ? "text-amber-400" : "text-emerald-400"}`} />
            <span>
              AI: <strong className="text-white">{usageData.remaining}</strong> / {usageData.limit} remaining
            </span>
          </button>
        </div>

        {/* QUICK ACTION PILLS BAR */}
        <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickActions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSend(act.prompt)}
                className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-xs font-semibold text-slate-700 hover:text-blue-700 transition-all shrink-0 flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <Icon className="h-3 w-3 text-blue-600" />
                <span>{act.label}</span>
              </button>
            );
          })}
        </div>

        {/* MESSAGES FEED */}
        <CardContent className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "buddy" && (
                <div className="shrink-0 pt-0.5">
                  <BuddyAvatar mood={msg.mood || "happy"} size="sm" showBadge={false} />
                </div>
              )}

              <div className={`space-y-2 max-w-xl ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white font-medium shadow-2xs"
                      : "bg-slate-50 border border-slate-200 text-slate-900"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  <div
                    className={`flex items-center justify-between text-[10px] mt-2 pt-1 border-t ${
                      msg.sender === "user"
                        ? "border-blue-500/40 text-blue-200"
                        : "border-slate-200/60 text-slate-400"
                    }`}
                  >
                    <span>
                      {msg.sender === "buddy" && (
                        <span className="font-semibold text-slate-500 capitalize">
                          {msg.source === "rule_based" ? "Rule-Based Engine (0 Quota)" : msg.source === "gemini" ? "Gemini Layer" : "System Limit"}
                        </span>
                      )}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {/* CONTEXT CARD (If present) */}
                {msg.card && (
                  <div className="p-3 bg-slate-900 text-white rounded-lg border border-slate-800 text-xs shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold text-blue-400 tracking-wider uppercase">
                        {msg.card.title}
                      </span>
                      {msg.card.tag && (
                        <Badge variant="outline" className="border-slate-700 text-slate-300 text-[10px] py-0 px-1.5 font-medium">
                          {msg.card.tag}
                        </Badge>
                      )}
                    </div>
                    {msg.card.subtitle && (
                      <div className="font-bold text-slate-100 text-xs">{msg.card.subtitle}</div>
                    )}
                    {msg.card.value && (
                      <div className="text-sm font-black text-amber-400 mt-0.5">{msg.card.value}</div>
                    )}
                    {msg.card.actionLabel && msg.card.actionUrl && (
                      <div className="mt-2 pt-2 border-t border-slate-800">
                        <Link
                          href={msg.card.actionUrl}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300"
                        >
                          <span>{msg.card.actionLabel}</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* ACTION BUTTON (If present) */}
                {msg.action && !msg.card && (
                  <div>
                    <Link href={msg.action.url}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-bold border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100 cursor-pointer"
                        rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                      >
                        {msg.action.label}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {msg.sender === "user" && (
                <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-slate-500 font-medium">
              <BuddyAvatar mood="thinking" size="sm" showBadge={false} />
              <span className="animate-pulse">Buddy is routing and processing...</span>
            </div>
          )}
        </CardContent>

        {/* INPUT FORM */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Buddy anything about careers, pathways, assignments, or code..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 h-10 px-3.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <Button
              type="submit"
              variant="primary"
              className="h-10 px-4 font-bold bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || !inputText.trim()}
              rightIcon={<Send className="h-3.5 w-3.5" />}
            >
              Send
            </Button>
          </form>
        </div>
      </Card>

      {/* AI USAGE PANEL MODAL */}
      <Modal
        isOpen={isUsagePanelOpen}
        onClose={() => setIsUsagePanelOpen(false)}
        title="Buddy Hybrid Architecture & Quota Info"
      >
        <div className="space-y-4 py-1 text-slate-900">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-900">
            <div className="flex items-center gap-2 font-bold mb-1">
              <Info className="h-4 w-4 text-blue-600" />
              <span>Rule-Based Engines vs Gemini AI Layer</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              Career matching, pathway roadmaps, progress %, skill gaps, and course recommendations are computed deterministically from PathAI engines and <strong>never consume Gemini quota</strong>. They remain 100% available even if Gemini limit is reached.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Used</div>
              <div className="text-xl font-black text-slate-900 mt-0.5">{usageData.used}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Remaining</div>
              <div className="text-xl font-black text-emerald-600 mt-0.5">{usageData.remaining}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Daily Limit</div>
              <div className="text-xl font-black text-slate-900 mt-0.5">{usageData.limit}</div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900">Today&apos;s Gemini Requests Breakdown</h4>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span>Concept Explanations</span>
                <span className="font-bold text-slate-900">{usageData.breakdown?.explanations || 0}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span>Assignment Guidance</span>
                <span className="font-bold text-slate-900">{usageData.breakdown?.assignments || 0}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span>Code Debugging</span>
                <span className="font-bold text-slate-900">{usageData.breakdown?.debugging || 0}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Resets daily at <strong>{usageData.resetAt}</strong></span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUsagePanelOpen(false)}
              className="h-8 text-xs"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

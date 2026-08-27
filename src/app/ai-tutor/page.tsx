"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { BuddyChat } from "@/components/buddy/BuddyChat";
import { useApp } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Zap, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AITutorPage() {
  const { profile, userSkills, modules } = useApp();

  const activeModule =
    modules.find((m) => m.status === "in_progress" || m.status === "next")?.title ||
    "Machine Learning Fundamentals";

  return (
    <AppLayout>
      <div className="space-y-6 pb-12 max-w-5xl mx-auto">
        {/* HEADER SECTION */}
        <div className="border-b border-slate-200 dark:border-[#273449] pb-4 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary" className="bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30">
                PathAI Assistant
              </Badge>
              <span className="text-xs text-slate-500 dark:text-[#CBD5E1] font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                Rule-Based Engine First
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Meet Buddy</h1>
            <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-0.5 font-sans">
              Buddy is your concise, task-focused AI learning assistant grounded in your active career goal (<strong>{profile.careerGoal}</strong>).
            </p>
          </div>

          {/* ACTIVE CONTEXT SUMMARY PILL */}
          <div className="px-3.5 py-2 bg-slate-50 dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-[#273449] flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400">
              <Target className="h-4 w-4" />
            </div>
            <div className="text-xs">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">Current Focus</div>
              <div className="font-extrabold text-slate-900 dark:text-white">{activeModule}</div>
            </div>
          </div>
        </div>

        {/* MAIN BUDDY CHAT COMPONENT */}
        <BuddyChat />

        {/* SYSTEM ARCHITECTURE INFO CARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-3.5 border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033]">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white mb-0.5">Rule-Based First</h4>
                <p className="text-slate-500 dark:text-[#CBD5E1] leading-relaxed text-[11px]">
                  Career info, prerequisites, scores, and learning paths are served directly from PathAI engines with 100% accuracy.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-3.5 border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033]">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 shrink-0">
                <Zap className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white mb-0.5">Concise 1–4 Sentence Answers</h4>
                <p className="text-slate-500 dark:text-[#CBD5E1] leading-relaxed text-[11px]">
                  Zero filler, zero stories, zero motivational speeches. Buddy delivers exact necessary answers with minimum fluff.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-3.5 border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033]">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Target className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white mb-0.5">20 AI Requests Daily</h4>
                <p className="text-slate-500 dark:text-[#CBD5E1] leading-relaxed text-[11px]">
                  Configurable daily assistance limit. Your core PathAI learning roadmap and resources always remain 100% accessible.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

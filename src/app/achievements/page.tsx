"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { Flame, Award, Zap, CheckCircle2, Target, Star, Lock } from "lucide-react";

export default function AchievementsPage() {
  const { streakData, achievements } = useApp();

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-[#273449] pb-6">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="primary" className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30">
              Consistency & Milestones
            </Badge>
            <span className="text-xs text-slate-500 dark:text-[#CBD5E1] font-medium font-sans">Professional Gamification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Achievements & Streaks
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-1 font-medium">
            Maintain daily learning consistency, complete roadmap milestones, and earn XP rewards.
          </p>
        </div>

        {/* STREAK & XP CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            title="Current Streak"
            value={`${streakData.currentStreakDays} Days`}
            subtitle="Active daily learning"
            icon={<Flame className="h-5 w-5 text-amber-600" />}
            variant="highlight"
          />
          <StatCard
            title="Longest Streak"
            value={`${streakData.longestStreakDays} Days`}
            subtitle="Personal record"
            icon={<Star className="h-5 w-5 text-blue-600" />}
          />
          <StatCard
            title="Total Earned XP"
            value={`${streakData.totalXp} XP`}
            subtitle="Level 4 Scholar"
            icon={<Zap className="h-5 w-5 text-emerald-600" />}
          />
        </div>

        {/* ACHIEVEMENTS GRID */}
        <Card className="shadow-sm border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033]">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Unlocked Milestones & Badges</CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-[#CBD5E1]">
              Achievements earned through regular diagnostic checks and module completions.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  ach.unlocked
                    ? "bg-slate-50 dark:bg-[#111827] border-slate-200 dark:border-[#273449] text-slate-900 dark:text-white"
                    : "bg-white dark:bg-[#172033]/60 border-slate-200/80 dark:border-[#273449]/60 text-slate-400 dark:text-slate-500 opacity-60"
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                    ach.unlocked
                      ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                      : "bg-slate-100 dark:bg-[#111827] text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  {ach.unlocked ? <Award className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ach.title}</h4>
                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-500/30">
                      +{ach.xpReward} XP
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-[#CBD5E1] leading-relaxed">{ach.description}</p>
                  {ach.unlocked && ach.unlockedAt && (
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold pt-0.5">
                      Unlocked on {ach.unlockedAt}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

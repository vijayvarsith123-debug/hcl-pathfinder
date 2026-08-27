"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useApp } from "@/context/AppContext";
import {
  BookOpen,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  FolderGit2,
  CheckSquare,
  Clock,
} from "lucide-react";

export default function LearnTopicPage() {
  const params = useParams();
  const { modules, userSkills, requiredSkills } = useApp();

  const moduleId = params?.id as string;
  const currentModule = modules.find((m) => m.id === moduleId) || modules[4]; // Default to ML Fundamentals

  const primarySkill = currentModule.skillsCovered[0] || "Machine Learning";
  const currentSkillScore = userSkills[primarySkill] ?? 32;
  const requiredSkillScore = requiredSkills[primarySkill] ?? 80;
  const gap = Math.max(0, requiredSkillScore - currentSkillScore);

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Back Button */}
        <div>
          <Link href="/learning-path">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to Roadmap
            </Button>
          </Link>
        </div>

        {/* Topic Title Header */}
        <div className="border-b border-slate-200 dark:border-[#273449] pb-6 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="primary">Module Details</Badge>
            <Badge variant="outline" className="dark:text-[#CBD5E1] dark:border-[#273449]">{currentModule.status.toUpperCase()}</Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{currentModule.title}</h1>
          <p className="text-sm text-slate-600 dark:text-[#CBD5E1] max-w-3xl leading-relaxed font-sans">{currentModule.description}</p>
        </div>

        {/* SKILL GAP BREAKDOWN FOR THIS TOPIC */}
        <Card className="shadow-sm border-blue-200 dark:border-blue-900/40 bg-gradient-to-br from-blue-50/50 via-white to-white dark:from-blue-950/20 dark:via-[#172033] dark:to-[#172033] p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Evaluated Skill</span>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">{primarySkill}</div>
              <p className="text-xs text-slate-500 dark:text-[#CBD5E1]/60">Benchmark required for ML Engineer role</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-[#CBD5E1]">
                <span>Current Level: {currentSkillScore}%</span>
                <span>Target Required: {requiredSkillScore}%</span>
              </div>
              <ProgressBar value={currentSkillScore} max={requiredSkillScore} size="md" variant={gap > 30 ? "warning" : "primary"} showPercentage={false} />
              <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold pt-1">
                Current Skill Gap: {gap}% — PathAI recommended 3 curated resources below to close this gap.
              </p>
            </div>
          </div>
        </Card>

        {/* WHY RECOMMENDED EXPLANATION */}
        <Card className="shadow-sm border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033] p-6 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            PathAI Recommendation Rationale
          </div>
          <p className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
            &quot;This module is positioned at Step {currentModule.orderIndex} in your personalized roadmap because your existing Python and SQL proficiency provides the prerequisite base needed for model fitting. Completing these resources will advance your {primarySkill} score from {currentSkillScore}% toward the target {requiredSkillScore}% benchmark.&quot;
          </p>
        </Card>

        {/* TOPIC RESOURCES & NEXT ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#273449]/60 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Recommended Topic Resources</h3>
              <Badge variant="primary">{currentModule.resourcesCount} Items</Badge>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] flex items-center justify-between text-xs text-slate-800 dark:text-[#CBD5E1]">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Google ML Crash Course: {currentModule.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Google Developers • Course • FREE</div>
                </div>
                <a href="https://developers.google.com/machine-learning/crash-course" target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="text-xs dark:border-[#273449]">
                    Open ↗
                  </Button>
                </a>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] flex items-center justify-between text-xs text-slate-800 dark:text-[#CBD5E1]">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">StatQuest: Visual Intuition Breakdown</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">StatQuest YouTube • Video • FREE</div>
                </div>
                <a href="https://www.youtube.com/watch?v=yIYKR4sgzI8" target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="text-xs dark:border-[#273449]">
                    Watch ↗
                  </Button>
                </a>
              </div>
            </div>
          </Card>

          {/* CAPSTONE & ASSESSMENT SHORTCUTS */}
          <Card className="shadow-sm border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#273449]/60 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Practice & Verification</h3>
            </div>

            <div className="space-y-3">
              {currentModule.projectTitle && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] space-y-2 text-slate-800 dark:text-[#CBD5E1]">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
                    <FolderGit2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Project: {currentModule.projectTitle}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-[#CBD5E1]/70">
                    Apply {primarySkill} algorithms to build a full prediction pipeline.
                  </p>
                  <Link href="/projects" className="inline-block pt-1">
                    <Button size="sm" variant="primary" className="text-xs">
                      View Project Spec
                    </Button>
                  </Link>
                </div>
              )}

              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/30 space-y-2 text-blue-900 dark:text-blue-300">
                <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-300 text-xs">
                  <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Skill Assessment
                </div>
                <p className="text-[11px] text-slate-600 dark:text-[#CBD5E1]/70">
                  Verify your {primarySkill} score to advance to the next module.
                </p>
                <Link href="/assessments" className="inline-block pt-1">
                  <Button size="sm" variant="outline" className="text-xs dark:border-[#273449] dark:text-[#CBD5E1]">
                    Take Quiz
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

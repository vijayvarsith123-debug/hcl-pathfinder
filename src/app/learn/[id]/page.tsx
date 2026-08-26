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
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="primary">Module Details</Badge>
            <Badge variant="outline">{currentModule.status.toUpperCase()}</Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{currentModule.title}</h1>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">{currentModule.description}</p>
        </div>

        {/* SKILL GAP BREAKDOWN FOR THIS TOPIC */}
        <Card className="shadow-sm border-blue-200 bg-gradient-to-br from-blue-50/50 via-white to-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Evaluated Skill</span>
              <div className="text-xl font-extrabold text-slate-900">{primarySkill}</div>
              <p className="text-xs text-slate-500">Benchmark required for ML Engineer role</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Current Level: {currentSkillScore}%</span>
                <span>Target Required: {requiredSkillScore}%</span>
              </div>
              <ProgressBar value={currentSkillScore} max={requiredSkillScore} size="md" variant={gap > 30 ? "warning" : "primary"} showPercentage={false} />
              <p className="text-xs text-amber-700 font-semibold pt-1">
                Current Skill Gap: {gap}% — PathAI recommended 3 curated resources below to close this gap.
              </p>
            </div>
          </div>
        </Card>

        {/* WHY RECOMMENDED EXPLANATION */}
        <Card className="shadow-sm border-slate-200 bg-white p-6 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Sparkles className="h-4 w-4 text-blue-600" />
            PathAI Recommendation Rationale
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            "This module is positioned at Step {currentModule.orderIndex} in your personalized roadmap because your existing Python and SQL proficiency provides the prerequisite base needed for model fitting. Completing these resources will advance your {primarySkill} score from {currentSkillScore}% toward the target {requiredSkillScore}% benchmark."
          </p>
        </Card>

        {/* TOPIC RESOURCES & NEXT ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm border-slate-200 bg-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Recommended Topic Resources</h3>
              <Badge variant="primary">{currentModule.resourcesCount} Items</Badge>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">Google ML Crash Course: {currentModule.title}</div>
                  <div className="text-[11px] text-slate-500">Google Developers • Course • FREE</div>
                </div>
                <a href="https://developers.google.com/machine-learning/crash-course" target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="text-xs">
                    Open ↗
                  </Button>
                </a>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">StatQuest: Visual Intuition Breakdown</div>
                  <div className="text-[11px] text-slate-500">StatQuest YouTube • Video • FREE</div>
                </div>
                <a href="https://www.youtube.com/watch?v=yIYKR4sgzI8" target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="text-xs">
                    Watch ↗
                  </Button>
                </a>
              </div>
            </div>
          </Card>

          {/* CAPSTONE & ASSESSMENT SHORTCUTS */}
          <Card className="shadow-sm border-slate-200 bg-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Practice & Verification</h3>
            </div>

            <div className="space-y-3">
              {currentModule.projectTitle && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <FolderGit2 className="h-4 w-4 text-blue-600" />
                    Project: {currentModule.projectTitle}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Apply {primarySkill} algorithms to build a full prediction pipeline.
                  </p>
                  <Link href="/projects" className="inline-block pt-1">
                    <Button size="sm" variant="primary" className="text-xs">
                      View Project Spec
                    </Button>
                  </Link>
                </div>
              )}

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900 text-xs">
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                  Skill Assessment
                </div>
                <p className="text-[11px] text-slate-600">
                  Verify your {primarySkill} score to advance to the next module.
                </p>
                <Link href="/assessments" className="inline-block pt-1">
                  <Button size="sm" variant="outline" className="text-xs">
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

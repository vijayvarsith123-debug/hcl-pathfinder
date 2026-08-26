"use client";

import React from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Alert } from "@/components/ui/alert";
import { useApp } from "@/context/AppContext";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Play,
  ArrowRight,
  ExternalLink,
  Sparkles,
  RefreshCw,
  CheckSquare,
} from "lucide-react";

export default function WeeklyPlanPage() {
  const { weeklyPlan, toggleTaskStatus, recentRecommendations } = useApp();

  const activeTask = weeklyPlan.dailyTasks.find((t) => t.status !== "completed") || weeklyPlan.dailyTasks[0];

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary" className="bg-blue-50 text-blue-700 border-blue-200">
                Week {weeklyPlan.weekNumber} Schedule
              </Badge>
              <span className="text-xs text-slate-500 font-medium">{weeklyPlan.targetHours} Target Hours</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Weekly Learning Plan
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Current Module: <strong className="text-slate-900 font-semibold">{weeklyPlan.moduleTitle}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/assessments">
              <Button variant="outline" size="sm">
                Take Skill Check
              </Button>
            </Link>
            <Link href="/learning-path">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                View Full Roadmap
              </Button>
            </Link>
          </div>
        </div>

        {/* AI ADAPTIVE RE-PLANNING ALERT IF TRIGGERED */}
        {recentRecommendations.length > 0 && recentRecommendations[0].type === "path_adjustment" && (
          <Alert variant="warning" title="Weekly Plan Automatically Adjusted by PathAI">
            <div className="space-y-1">
              <p>{recentRecommendations[0].reason}</p>
              <p className="font-semibold text-slate-900">{recentRecommendations[0].actionSummary}</p>
            </div>
          </Alert>
        )}

        {/* TOP SUMMARY & RECOMMENDED NEXT ACTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Progress Overview */}
          <div className="lg:col-span-7">
            <Card className="shadow-sm border-slate-200 bg-white h-full flex flex-col justify-between p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Weekly Goal Progress</span>
                  <span className="text-sm font-bold text-slate-900">{weeklyPlan.completedHours} / {weeklyPlan.targetHours} hrs ({weeklyPlan.completionPercentage}%)</span>
                </div>
                <ProgressBar value={weeklyPlan.completionPercentage} size="md" showPercentage={false} />
                <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-900">{weeklyPlan.dailyTasks.filter((t) => t.status === "completed").length}</div>
                    <div className="text-slate-500 text-[11px]">Tasks Done</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-bold text-blue-600">{weeklyPlan.dailyTasks.filter((t) => t.status === "in_progress").length}</div>
                    <div className="text-slate-500 text-[11px]">In Progress</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-700">{weeklyPlan.dailyTasks.filter((t) => t.status === "pending").length}</div>
                    <div className="text-slate-500 text-[11px]">Pending</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Recommended Action Box */}
          <div className="lg:col-span-5">
            <Card className="shadow-sm border-blue-200 bg-gradient-to-br from-blue-50/80 to-white h-full flex flex-col justify-between p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="primary" className="bg-blue-600 text-white font-bold text-xs">
                    Recommended Next Action
                  </Badge>
                  <span className="text-xs font-bold text-blue-700">{activeTask?.estimatedMinutes || 45} mins</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 pt-1">{activeTask?.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Focus on this task to maintain your 8 hours/week pace and keep your roadmap schedule on track.
                </p>
              </div>

              <div className="pt-4">
                {activeTask?.resourceUrl ? (
                  <a href={activeTask.resourceUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" className="w-full text-xs font-semibold" leftIcon={<Play className="h-4 w-4" />}>
                      Start {activeTask.title} ↗
                    </Button>
                  </a>
                ) : (
                  <Link href="/assessments">
                    <Button variant="primary" className="w-full text-xs font-semibold" leftIcon={<CheckSquare className="h-4 w-4" />}>
                      Start Assessment
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* DAY-BY-DAY TASK SCHEDULE LIST */}
        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">Day-by-Day Schedule Breakdown</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Tasks are calculated to respect your 8 hours/week learning availability.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {weeklyPlan.dailyTasks.map((task) => {
              const isDone = task.status === "completed";
              const isInProgress = task.status === "in_progress";

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isDone
                      ? "bg-slate-50 border-slate-200 text-slate-500"
                      : isInProgress
                      ? "bg-blue-50/70 border-blue-200 text-slate-900 ring-1 ring-blue-500/20 shadow-2xs"
                      : "bg-white border-slate-200 text-slate-800 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      type="button"
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`mt-0.5 h-6 w-6 rounded-lg border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        isDone
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-slate-300 bg-white hover:border-blue-500"
                      }`}
                    >
                      {isDone && <CheckCircle2 className="h-4 w-4" />}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-400 font-mono w-20">{task.dayOfWeek}</span>
                        <h4 className={`text-sm font-bold ${isDone ? "line-through text-slate-400" : "text-slate-900"}`}>
                          {task.title}
                        </h4>
                        {task.resourceType && (
                          <Badge variant="outline" size="sm">
                            {task.resourceType}
                          </Badge>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {task.estimatedMinutes} mins
                        </span>
                        {task.resourceProvider && (
                          <span>Provider: <strong className="text-slate-700 font-medium">{task.resourceProvider}</strong></span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 shrink-0">
                    {task.resourceUrl ? (
                      <a href={task.resourceUrl} target="_blank" rel="noopener noreferrer">
                        <Button
                          size="sm"
                          variant={isInProgress ? "primary" : "outline"}
                          className="text-xs gap-1.5"
                        >
                          <span>{isDone ? "Review Material" : "Start Resource"}</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    ) : (
                      <Link href="/assessments">
                        <Button size="sm" variant="primary" className="text-xs">
                          Start Assessment
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

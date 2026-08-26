"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useApp } from "@/context/AppContext";
import { SnakeRoadmapCanvas } from "@/components/roadmap/SnakeRoadmapCanvas";
import { MilestoneDetailModal } from "@/components/roadmap/MilestoneDetailModal";
import { RoadmapMilestone } from "@/lib/roadmap-generator";
import {
  Route,
  CheckCircle2,
  Lock,
  Clock,
  BookOpen,
  FolderGit2,
  ArrowRight,
  Sparkles,
  Target,
  BarChart3,
  Award,
  Zap,
  CheckSquare,
  Play,
  RotateCcw,
} from "lucide-react";

export default function LearningPathPage() {
  const { profile, userSkills, weeklyPlan, systemProgress, updateProfile } = useApp();

  const [targetCareer, setTargetCareer] = useState<string>(
    profile.careerGoal || "Machine Learning Engineer"
  );

  const [selectedMilestone, setSelectedMilestone] = useState<RoadmapMilestone | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectMilestone = (milestone: RoadmapMilestone) => {
    setSelectedMilestone(milestone);
    setIsModalOpen(true);
  };

  const handleCareerChange = (newCareer: string) => {
    setTargetCareer(newCareer);
    updateProfile({ careerGoal: newCareer });
  };

  const activeTask = systemProgress.todaysFocusTask || weeklyPlan.dailyTasks[0];

  const availableCareers = [
    "Machine Learning Engineer",
    "Software Developer",
    "Full-Stack Developer",
    "Data Analyst",
    "Cybersecurity Specialist",
    "Cloud & DevOps Engineer",
  ];

  return (
    <AppLayout>
      <div className="space-y-8 pb-12 font-sans">
        {/* HEADER & CAREER SELECTOR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary" className="bg-blue-50 text-blue-700 border-blue-200">
                Interactive Winding Roadmap
              </Badge>
              <span className="text-xs text-slate-500 font-medium">Single Source of Truth Graph</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {targetCareer} Roadmap
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Data-driven winding pathway based on your <strong>{profile.experienceLevel}</strong> profile and skill gap analysis.
            </p>
          </div>

          {/* CAREER GOAL SELECTOR DROPDOWN */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs">
              <Target className="h-4 w-4 text-blue-600 ml-1" />
              <span className="font-semibold text-slate-700">Target Career:</span>
              <select
                value={targetCareer}
                onChange={(e) => handleCareerChange(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 font-bold text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                {availableCareers.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <Link href="/weekly-plan">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                View Weekly Plan
              </Button>
            </Link>
          </div>
        </div>

        {/* OVERALL STATS ROW — SINGLE SOURCE OF TRUTH */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border-slate-200 bg-white shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Roadmap Completion</span>
              <Route className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {systemProgress.overallProgressPercentage}%
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
              {systemProgress.milestonesProgressSummary}
            </p>
          </Card>

          <Card className="p-4 border-slate-200 bg-white shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Learning Hours</span>
              <Clock className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {systemProgress.totalLearningHours} hrs
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Calculated from completed sessions</p>
          </Card>

          <Card className="p-4 border-slate-200 bg-white shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assessment Average</span>
              <Award className="h-5 w-5 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {systemProgress.avgAssessmentScoreLabel}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Average score across quizzes</p>
          </Card>

          <Card className="p-4 border-slate-200 bg-white shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Projects Mastered</span>
              <FolderGit2 className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {systemProgress.projectsCompletedCount} / {systemProgress.totalProjectsCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Portfolio capstone builds</p>
          </Card>
        </div>

        {/* MAIN WINDING SNAKE ROADMAP CANVAS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span>Interactive Winding Snake Pathway</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Click any milestone node to view details</span>
          </div>

          <SnakeRoadmapCanvas
            milestones={systemProgress.roadmapMilestones}
            activeMilestoneId={systemProgress.currentMilestone.id}
            onSelectMilestone={handleSelectMilestone}
          />
        </div>

        {/* SIDE PANELS: TODAY'S FOCUS & RECOMMENDED FOR YOU */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
          {/* TODAY'S FOCUS TASK WIDGET */}
          <div className="lg:col-span-7">
            <Card className="shadow-sm border-blue-200 bg-gradient-to-br from-blue-50/70 via-white to-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="primary" className="bg-blue-600 text-white font-bold text-xs">
                    Today&apos;s Active Focus
                  </Badge>
                  <span className="text-xs font-semibold text-blue-700">{activeTask?.estimatedMinutes || 45} mins</span>
                </div>
                <CardTitle className="text-base font-bold text-slate-900 pt-2">
                  {activeTask?.title || "Complete Decision Trees Module"}
                </CardTitle>
                <CardDescription className="text-xs text-slate-600">
                  Topic: {activeTask?.topic || "Machine Learning Fundamentals"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-xs text-slate-700 leading-relaxed p-3 bg-white rounded-lg border border-slate-200">
                  <strong className="text-slate-900 font-bold">Why recommended now:</strong> Completing this topic advances your current milestone (<em>{systemProgress.currentMilestone.title}</em>) and boosts your {targetCareer} readiness.
                </p>

                <div className="flex items-center justify-end gap-3 pt-1">
                  <Link href="/weekly-plan">
                    <Button variant="primary" size="sm" className="text-xs font-bold" leftIcon={<Play className="h-3.5 w-3.5" />}>
                      Continue Active Task
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RECOMMENDED RESOURCES FOR YOU */}
          <div className="lg:col-span-5">
            <Card className="shadow-sm border-slate-200 bg-white">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <CardTitle className="text-sm font-bold text-slate-900">Recommended For You</CardTitle>
                </div>
                <CardDescription className="text-xs text-slate-500">
                  Based on active milestone &apos;{systemProgress.currentMilestone.title}&apos;.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2">
                <a
                  href="https://www.youtube.com/playlist?list=PL-osiE80TeTvipOqomVEeZ1HRrcEvtZB_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 text-xs flex items-center justify-between text-slate-800 font-medium transition-all group"
                >
                  <span>Scikit-Learn Machine Learning Course</span>
                  <Badge variant="outline" className="text-[10px] bg-white">Video ↗</Badge>
                </a>

                <a
                  href="https://www.kaggle.com/learn/machine-learning"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 text-xs flex items-center justify-between text-slate-800 font-medium transition-all group"
                >
                  <span>Kaggle Machine Learning Micro-Course</span>
                  <Badge variant="outline" className="text-[10px] bg-white">Practice ↗</Badge>
                </a>

                <div className="pt-2 text-right">
                  <Link href="/resources">
                    <span className="text-xs font-bold text-blue-600 hover:underline">
                      View All 100% Free Resources →
                    </span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* MILESTONE DETAIL MODAL */}
        <MilestoneDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          milestone={selectedMilestone}
        />
      </div>
    </AppLayout>
  );
}

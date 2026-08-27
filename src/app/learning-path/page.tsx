"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { SnakeRoadmapCanvas } from "@/components/roadmap/SnakeRoadmapCanvas";
import { MilestoneDetailModal } from "@/components/roadmap/MilestoneDetailModal";
import { RoadmapMilestone } from "@/lib/roadmap-generator";
import {
  Route,
  Clock,
  BookOpen,
  FolderGit2,
  ArrowRight,
  Sparkles,
  Target,
  Award,
  Search,
  ChevronRight,
  Filter,
} from "lucide-react";

export default function LearningPathPage() {
  const { profile, userSkills, weeklyPlan, systemProgress, updateProfile } = useApp();
  const [selectedMilestone, setSelectedMilestone] = useState<RoadmapMilestone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const milestones = systemProgress.roadmapMilestones || [];
  const careerGoal = profile.careerGoal;

  const handleSelectMilestone = (milestone: RoadmapMilestone) => {
    setSelectedMilestone(milestone);
    setIsModalOpen(true);
  };

  const handleCareerChange = (newCareer: string) => {
    updateProfile({ careerGoal: newCareer });
  };

  const availableCareers = [
    "Machine Learning Engineer",
    "Software Developer",
    "Full-Stack Developer",
    "Data Analyst",
    "Cybersecurity Specialist",
    "Cloud & DevOps Engineer",
  ];

  // Helper counts for filters
  const allCount = milestones.length;
  const completedCount = milestones.filter((m) => m.status === "completed").length;
  const inProgressCount = milestones.filter((m) => m.status === "in_progress").length;
  const upcomingCount = milestones.filter((m) => m.status === "available").length;
  const lockedCount = milestones.filter((m) => m.status === "locked").length;

  // Render Empty State if no career is selected
  const hasSelectedCareer = !!careerGoal && careerGoal !== "";

  if (!hasSelectedCareer) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-8 font-sans">
          <div className="h-20 w-20 rounded-3xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto shadow-md">
            <Target className="h-10 w-10 animate-pulse" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              YOUR PERSONALIZED PATH
            </h1>
            <p className="text-base text-slate-600 dark:text-[#CBD5E1] max-w-xl mx-auto leading-relaxed">
              Your career journey starts here. Tell us your career goal and we&apos;ll create a personalized learning roadmap based on your skills, interests, and career requirements.
            </p>
          </div>

          <div className="pt-4">
            <Link href="/onboarding">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                Find My Career Path
              </Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 pb-12 font-sans">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 dark:border-[#273449]/70 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Badge variant="primary" className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20 text-xs py-0.5 px-2.5 font-bold">
                YOUR LEARNING PATH
              </Badge>
              <span className="text-xs text-slate-500 dark:text-[#CBD5E1]/60 font-semibold">
                Follow your personalized roadmap
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{careerGoal}</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#CBD5E1]/70 mt-1 leading-relaxed">
              Data-driven winding pathway based on your <strong>{profile.experienceLevel}</strong> profile and skill gap analysis.
            </p>
          </div>

          {/* CAREER SELECTOR & ACTIONS */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#111827] p-2 rounded-2xl border border-slate-200 dark:border-[#273449] text-xs">
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400 ml-1" />
              <span className="font-extrabold text-slate-700 dark:text-[#CBD5E1]">Change Goal:</span>
              <select
                value={careerGoal}
                onChange={(e) => handleCareerChange(e.target.value)}
                className="bg-white dark:bg-[#172033] border border-slate-300 dark:border-[#273449] rounded-xl px-2.5 py-1 font-extrabold text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                {availableCareers.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <Link href="/weekly-plan">
              <Button variant="primary" size="sm" className="h-9 font-bold" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                Weekly Plan
              </Button>
            </Link>
          </div>
        </div>

        {/* ROADMAP STATS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033] shadow-2xs rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Roadmap Completion</span>
              <Route className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {systemProgress.overallProgressPercentage}%
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#CBD5E1]/60 mt-0.5 font-semibold">
              {systemProgress.milestonesProgressSummary}
            </p>
          </Card>

          <Card className="p-4 border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033] shadow-2xs rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Learning Hours</span>
              <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {systemProgress.totalLearningHours} hrs
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#CBD5E1]/60 mt-0.5">Calculated from completed sessions</p>
          </Card>

          <Card className="p-4 border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033] shadow-2xs rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Assessment Average</span>
              <Award className="h-5 w-5 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {systemProgress.avgAssessmentScoreLabel}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#CBD5E1]/60 mt-0.5">Average score across quizzes</p>
          </Card>

          <Card className="p-4 border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033] shadow-2xs rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Projects Mastered</span>
              <FolderGit2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {systemProgress.projectsCompletedCount} / {systemProgress.totalProjectsCount}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#CBD5E1]/60 mt-0.5">Portfolio capstone builds</p>
          </Card>
        </div>

        {/* SEARCH & FILTER CONTROLS BAR */}
        <div className="p-4 bg-white dark:bg-[#172033] border border-slate-200 dark:border-[#273449] rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left search bar */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search milestones, skills, topics..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-xs text-slate-900 dark:text-[#F8FAFC] placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Center filters */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: "all", label: "All", count: allCount },
              { id: "completed", label: "Completed", count: completedCount },
              { id: "in_progress", label: "In Progress", count: inProgressCount },
              { id: "upcoming", label: "Upcoming", count: upcomingCount },
              { id: "locked", label: "Locked", count: lockedCount },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`h-9 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  filterStatus === f.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-50 dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-[#273449] text-slate-700 dark:text-[#CBD5E1] border border-slate-200 dark:border-[#273449]"
                }`}
              >
                <span>{f.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  filterStatus === f.id ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-[#273449] text-slate-600 dark:text-[#CBD5E1]"
                }`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Right accessible color legend */}
          <div className="flex items-center gap-4 text-[10px] font-extrabold text-slate-600 dark:text-[#CBD5E1] border-l border-slate-200 dark:border-[#273449] pl-4 max-md:border-l-0 max-md:pl-0 max-md:pt-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-blue-500" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span>Upcoming</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span>Locked</span>
            </div>
          </div>
        </div>

        {/* ROADMAP CANVAS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Learning Journey Map</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-[#CBD5E1]/60 font-semibold">
              Click any node card to view topics, resources, assessments & projects
            </span>
          </div>

          <SnakeRoadmapCanvas
            milestones={milestones}
            activeMilestoneId={systemProgress.currentMilestone.id}
            onSelectMilestone={handleSelectMilestone}
            filterStatus={filterStatus}
            searchQuery={searchQuery}
          />
        </div>

        {/* BOTTOM ACTIVE MODULE WIDGETS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
          {/* Active Task widget */}
          <div className="lg:col-span-7">
            <Card className="shadow-sm border-blue-200 dark:border-blue-900/60 bg-gradient-to-br from-blue-50/50 via-white to-white dark:from-blue-950/20 dark:via-[#172033] dark:to-[#172033] rounded-3xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="primary" className="bg-blue-600 dark:bg-blue-500 text-white font-extrabold text-xs">
                    Current Focus Task
                  </Badge>
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                    {systemProgress.todaysFocusTask?.estimatedMinutes || 45} mins
                  </span>
                </div>
                <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white pt-2">
                  {systemProgress.todaysFocusTask?.title || "No active tasks in your plan."}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-[#CBD5E1]/70">
                  Subtopic: {systemProgress.todaysFocusTask?.topic || "Unassigned"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-relaxed p-3 bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-[#273449]">
                  <strong>Current Milestone:</strong> <em>{systemProgress.currentMilestone.title}</em>. Completing this task raises your overall readiness and updates your weekly plan progress.
                </p>
                <div className="flex items-center justify-end pt-1">
                  <Link href="/weekly-plan">
                    <Button variant="primary" size="sm" className="text-xs font-bold h-9 cursor-pointer">
                      Start Current Task →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Recommendations list */}
          <div className="lg:col-span-5">
            <Card className="shadow-sm border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033] rounded-3xl">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-sm font-extrabold text-slate-900 dark:text-white">Active Recommendations</CardTitle>
                </div>
                <CardDescription className="text-xs text-slate-500 dark:text-[#CBD5E1]/70">
                  Targeted learning assets for your active goal.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {systemProgress.currentMilestone.resources.slice(0, 2).map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-slate-200 dark:border-[#273449] bg-slate-50 dark:bg-[#111827]/40 hover:bg-white dark:hover:bg-[#172033] hover:border-blue-300 dark:hover:border-blue-500 text-xs flex items-center justify-between text-slate-800 dark:text-[#CBD5E1] font-semibold transition-all group"
                  >
                    <span className="truncate pr-4">{res.title}</span>
                    <Badge variant="outline" className="text-[9px] bg-white dark:bg-[#111827] border-slate-200 dark:border-[#273449] shrink-0">
                      {res.type} ↗
                    </Badge>
                  </a>
                ))}
                <div className="pt-2 text-right">
                  <Link href="/resources">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                      Explore all resources →
                    </span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* SLIDE-OVER MILESTONE DETAILS DRAWER */}
        <MilestoneDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          milestone={selectedMilestone}
        />
      </div>
    </AppLayout>
  );
}

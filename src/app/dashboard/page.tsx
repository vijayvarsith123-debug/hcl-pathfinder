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
import { CareerReadinessExplainModal } from "@/components/progress/CareerReadinessExplainModal";
import { RoadmapMilestone } from "@/lib/roadmap-generator";
import { INITIAL_SUBTOPIC_MASTERY } from "@/lib/adaptive/mastery-tracker";
import {
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  Target,
  Clock,
  Award,
  FolderGit2,
  Play,
  ArrowRight,
  Search,
  Bell,
  ChevronDown,
  Lock,
  Flag,
  Flame,
  Star,
  Bookmark,
  BarChart3,
  Layers,
  Zap,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const { profile, streakData, weeklyPlan, systemProgress } = useApp();

  const [selectedHeaderTab, setSelectedHeaderTab] = useState<string>("Home");
  const [selectedMilestone, setSelectedMilestone] = useState<RoadmapMilestone | null>(null);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);

  const readinessAnalysis = systemProgress.readinessAnalysis;

  // Adaptive Engine subtopic mastery data
  const weakSubtopics = INITIAL_SUBTOPIC_MASTERY.filter((s) => s.status === "Weak");

  const headerTabs = ["Home", "My Courses", "Tests", "Results", "Learning Plan"];

  // Monthly activity bar data
  const monthlyBars = [
    { month: "Jan", heightPct: 40 },
    { month: "Feb", heightPct: 55 },
    { month: "Mar", heightPct: 70 },
    { month: "Apr", heightPct: 45 },
    { month: "May", heightPct: 60 },
    { month: "Jun", heightPct: 80 },
    { month: "Jul", heightPct: 50 },
    { month: "Aug", heightPct: 65 },
    { month: "Sep", heightPct: 75 },
    { month: "Oct", heightPct: 90, active: true },
    { month: "Dec", heightPct: 60 },
  ];

  const handleSelectMilestone = (milestone: RoadmapMilestone) => {
    setSelectedMilestone(milestone);
    setIsMilestoneModalOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-12 font-sans transition-colors">
        {/* TOP HEADER SUB-NAVIGATION & SEARCH BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#273449] pb-4">
          {/* HEADER TABS */}
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {headerTabs.map((tab) => {
              const isActive = selectedHeaderTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setSelectedHeaderTab(tab)}
                  className={`text-xs font-bold transition-all py-1.5 border-b-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 font-extrabold"
                      : "border-transparent text-slate-600 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* RIGHT SIDE USER & SEARCH */}
          <div className="flex items-center gap-4 flex-wrap justify-end">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-44 sm:w-56 pl-9 pr-3 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-xs text-slate-900 dark:text-[#F8FAFC] placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>

            <button className="p-2 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-slate-600 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-white transition-colors relative cursor-pointer">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600" />
            </button>

            {/* USER PROFILE INFO */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-[#273449]">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center border border-blue-400 shadow-xs">
                {profile.fullName ? profile.fullName.split(" ").map((n) => n[0]).join("") : "VK"}
              </div>
              <div className="text-left">
                <div className="font-extrabold text-xs text-slate-900 dark:text-[#F8FAFC] leading-tight">{profile.fullName}</div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">{profile.careerGoal}</div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
            </div>
          </div>
        </div>

        {/* 4 TOP SUMMARY CARDS + OVERALL PROGRESS RIGHT CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT 4 CARDS GRID (COL 8) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. COURSES COMPLETED */}
            <Card className="p-4 bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-900 dark:text-[#F8FAFC] rounded-2xl shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-blue-500/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <BookOpen className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </div>
              <div className="mt-3">
                <div className="text-xs text-slate-600 dark:text-[#CBD5E1] font-semibold">Courses Completed</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">8</div>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">+2 courses vs last month</p>
              </div>
            </Card>

            {/* 2. AVG TEST SCORE */}
            <Card className="p-4 bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-900 dark:text-[#F8FAFC] rounded-2xl shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-blue-500/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </div>
              <div className="mt-3">
                <div className="text-xs text-slate-600 dark:text-[#CBD5E1] font-semibold">Avg Test Score</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">82%</div>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">+3% vs last month</p>
              </div>
            </Card>

            {/* 3. TESTS PASSED */}
            <Card className="p-4 bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-900 dark:text-[#F8FAFC] rounded-2xl shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
              </div>
              <div className="mt-3">
                <div className="text-xs text-slate-600 dark:text-[#CBD5E1] font-semibold">Tests Passed</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">14</div>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">+3 vs last month</p>
              </div>
            </Card>

            {/* 4. UPCOMING DEADLINES */}
            <Card className="p-4 bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-900 dark:text-[#F8FAFC] rounded-2xl shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
              </div>
              <div className="mt-3">
                <div className="text-xs text-slate-600 dark:text-[#CBD5E1] font-semibold">Upcoming Deadlines</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">3</div>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-bold">Due soon</p>
              </div>
            </Card>
          </div>

          {/* RIGHT OVERALL PROGRESS CARD (COL 4) */}
          <div className="lg:col-span-4">
            <Card
              onClick={() => setIsExplainModalOpen(true)}
              className="p-5 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-[#172033] dark:via-[#172033] dark:to-[#1E3A8A] border-blue-500/30 text-white rounded-2xl shadow-md cursor-pointer group hover:border-blue-500/60 transition-all relative overflow-hidden h-full flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-100 dark:text-blue-400">
                  Overall Progress
                </span>
                <Target className="h-4 w-4 text-blue-100 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              </div>

              <div className="flex items-center gap-4 my-3">
                {/* Large Circular Progress Ring */}
                <div className="relative h-18 w-18 rounded-full border-4 border-white/30 dark:border-blue-500/30 flex items-center justify-center font-black text-2xl text-white shrink-0 bg-blue-900 dark:bg-[#0B1220] shadow-xs">
                  <span>68%</span>
                </div>
                <div>
                  <div className="text-sm font-extrabold text-white">Career Readiness</div>
                  <div className="text-xl font-black text-blue-100 dark:text-blue-400 mt-0.5">68%</div>
                  <div className="text-[10px] text-blue-100 dark:text-[#CBD5E1] mt-0.5">
                    8 of 12 skills developing or mastered
                  </div>
                </div>
              </div>

              {/* Blue Area Progress Chart */}
              <div className="pt-2 border-t border-white/20 dark:border-[#273449]">
                <div className="h-6 w-full bg-black/20 dark:bg-blue-500/10 rounded border border-white/20 dark:border-blue-500/20 overflow-hidden relative flex items-end">
                  <div className="w-[68%] h-full bg-white dark:bg-blue-500 rounded" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-white dark:text-blue-400 font-bold mt-1.5">
                  <span>Job-Ready Track</span>
                  <span>View Details →</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* MAIN CENTER: YOUR LEARNING ROADMAP & RIGHT QUICK STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT ROADMAP & ACTIVITY (COL 8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. YOUR LEARNING ROADMAP CARD */}
            <Card className="bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-900 dark:text-[#F8FAFC] rounded-2xl shadow-xs overflow-hidden">
              <CardHeader className="p-4 border-b border-slate-100 dark:border-[#273449]/60 bg-slate-50/50 dark:bg-[#111827] flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white">
                    Your Learning Roadmap
                  </CardTitle>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-[#0B1220] px-3 py-1 rounded-xl border border-slate-200 dark:border-[#273449] text-xs font-bold text-slate-800 dark:text-[#CBD5E1]">
                  <span>Data Scientist</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                {/* Winding Snake Roadmap Canvas */}
                <SnakeRoadmapCanvas
                  milestones={systemProgress.roadmapMilestones}
                  activeMilestoneId={systemProgress.currentMilestone.id}
                  onSelectMilestone={handleSelectMilestone}
                  compact={true}
                />

                {/* Bottom Legend & Button */}
                <div className="pt-3 border-t border-slate-100 dark:border-[#273449]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4 text-slate-600 dark:text-[#CBD5E1] font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-blue-500" />
                      <span>In Progress</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <span>Locked</span>
                    </div>
                  </div>

                  <Link href="/learning-path">
                    <Button variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs">
                      View Full Roadmap
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* 2. LEARNING ACTIVITY CARD */}
            <Card className="bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-900 dark:text-[#F8FAFC] rounded-2xl shadow-xs p-4">
              <CardHeader className="p-0 pb-3 border-b border-slate-100 dark:border-[#273449]/60 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Learning Activity</span>
                  </CardTitle>
                </div>
                <Calendar className="h-4 w-4 text-slate-400" />
              </CardHeader>

              <CardContent className="p-0 pt-4 space-y-3 relative">
                {/* TOOLTIP POPUP (OCTOBER) */}
                <div className="absolute top-1 right-24 bg-blue-900 dark:bg-blue-950 border border-blue-500/40 px-2.5 py-1 rounded-lg text-[10px] text-blue-200 font-bold shadow-lg z-10">
                  <div>October</div>
                  <div className="text-white">Avg: 4h 20m per week</div>
                </div>

                {/* BAR CHART */}
                <div className="h-44 flex items-end justify-between gap-2 pt-8 px-2 border-b border-slate-100 dark:border-[#273449] pb-2">
                  {monthlyBars.map((b) => (
                    <div key={b.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <div
                        style={{ height: `${b.heightPct}%` }}
                        className={`w-full max-w-[28px] rounded-t-lg transition-all ${
                          b.active
                            ? "bg-blue-600 dark:bg-blue-500 ring-2 ring-blue-300 dark:ring-blue-400 shadow-xs"
                            : "bg-blue-100 dark:bg-blue-600/30 hover:bg-blue-500/60"
                        }`}
                      />
                      <span className={`text-[10px] font-bold ${b.active ? "text-blue-600 dark:text-blue-400 font-mono" : "text-slate-400"}`}>
                        {b.month}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 3. ADAPTIVE INTELLIGENCE — COMPACT NEEDS ATTENTION + AI INSIGHT */}
            {weakSubtopics.length > 0 && (
              <Card className="bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-900 dark:text-[#F8FAFC] rounded-2xl shadow-xs p-4">
                <CardHeader className="p-0 pb-3 border-b border-slate-100 dark:border-[#273449]/60 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                    <span>Needs Attention</span>
                  </CardTitle>
                  <Link href="/progress">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">View all →</span>
                  </Link>
                </CardHeader>

                <CardContent className="p-0 pt-3 space-y-2">
                  {weakSubtopics.slice(0, 3).map((sub) => (
                    <div key={sub.subtopicId} className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-500/20">
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white">{sub.subtopicName}</div>
                        <div className="text-[10px] text-slate-500 dark:text-[#CBD5E1]">{sub.topicName} · Trend: {sub.trend}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black text-rose-600 dark:text-rose-400 font-mono">{sub.masteryScore}%</div>
                        <Badge variant="danger" className="text-[8px] py-0 px-1.5 font-bold">Weak</Badge>
                      </div>
                    </div>
                  ))}

                  {/* AI Learning Insight */}
                  <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-500/20 text-xs">
                    <div className="flex items-center gap-1.5 font-extrabold text-blue-700 dark:text-blue-300 mb-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>AI Learning Insight</span>
                    </div>
                    <p className="text-[11px] text-slate-700 dark:text-[#CBD5E1] leading-relaxed">
                      {weakSubtopics.length} targeted area{weakSubtopics.length !== 1 ? "s" : ""} will receive additional questions in your next assessment.
                    </p>
                  </div>

                  <Link href="/assessments" className="block pt-1">
                    <Button variant="primary" size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-8 shadow-xs">
                      Take Targeted Assessment →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT COLUMN (COL 4): QUICK STATS, TODAY'S FOCUS, RECOMMENDED */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. QUICK STATS (2x2 GRID) */}
            <Card className="bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-900 dark:text-[#F8FAFC] rounded-2xl shadow-xs p-4">
              <CardHeader className="p-0 pb-3 border-b border-slate-100 dark:border-[#273449]/60">
                <CardTitle className="text-sm font-extrabold text-slate-900 dark:text-white">Quick Stats</CardTitle>
              </CardHeader>

              <CardContent className="p-0 pt-4 grid grid-cols-2 gap-4 text-xs">
                {/* STAT 1 */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449]">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 mb-1" />
                  <div className="text-base font-black text-slate-900 dark:text-white">74.5 hrs</div>
                  <div className="text-[10px] text-slate-600 dark:text-[#CBD5E1] font-semibold">Total Learning</div>
                </div>

                {/* STAT 2 */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449]">
                  <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mb-1" />
                  <div className="text-base font-black text-slate-900 dark:text-white">18</div>
                  <div className="text-[10px] text-slate-600 dark:text-[#CBD5E1] font-semibold">Resources Completed</div>
                </div>

                {/* STAT 3 */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449]">
                  <Star className="h-4 w-4 text-amber-600 dark:text-amber-400 mb-1" />
                  <div className="text-base font-black text-slate-900 dark:text-white">78%</div>
                  <div className="text-[10px] text-slate-600 dark:text-[#CBD5E1] font-semibold">Avg Test Score</div>
                </div>

                {/* STAT 4 */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449]">
                  <FolderGit2 className="h-4 w-4 text-blue-600 dark:text-blue-400 mb-1" />
                  <div className="text-base font-black text-slate-900 dark:text-white">7</div>
                  <div className="text-[10px] text-slate-600 dark:text-[#CBD5E1] font-semibold">Projects Completed</div>
                </div>
              </CardContent>
            </Card>

            {/* 2. TODAY'S FOCUS CARD */}
            <Card className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/80 border-blue-500/30 text-white rounded-2xl shadow-md p-5 flex flex-col justify-between text-center relative overflow-hidden">
              {/* Target Bullseye Decorative Icon */}
              <div className="flex justify-center my-2">
                <div className="h-20 w-20 rounded-full border-4 border-blue-500/30 bg-blue-600/20 flex items-center justify-center text-blue-400 shadow-xl">
                  <Target className="h-10 w-10 animate-pulse" />
                </div>
              </div>

              <div className="space-y-1">
                <Badge variant="primary" className="bg-blue-600 text-white font-extrabold text-[10px] mx-auto">
                  Today&apos;s Focus
                </Badge>
                <h3 className="text-lg font-black text-white pt-1">Data Analysis</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Continue exploring distributions and summary statistics.
                </p>
              </div>

              <div className="pt-4">
                <Link href="/weekly-plan">
                  <Button variant="primary" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 shadow-xs">
                    Continue Learning →
                  </Button>
                </Link>
              </div>
            </Card>

            {/* 3. RECOMMENDED FOR YOU CARD */}
            <Card className="bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-900 dark:text-[#F8FAFC] rounded-2xl shadow-xs p-4">
              <CardHeader className="p-0 pb-3 border-b border-slate-100 dark:border-[#273449]/60 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-extrabold text-slate-900 dark:text-white">Recommended for You</CardTitle>
                <Link href="/resources">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">View all</span>
                </Link>
              </CardHeader>

              <CardContent className="p-0 pt-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] flex items-center gap-3">
                  {/* Thumbnail */}
                  <div className="h-14 w-16 rounded-lg bg-blue-900/60 border border-blue-500/30 flex items-center justify-center text-white shrink-0 relative overflow-hidden group">
                    <Play className="h-6 w-6 text-blue-300 group-hover:scale-110 transition-transform" />
                  </div>

                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate">Advanced SQL</div>
                    <p className="text-[11px] text-slate-600 dark:text-[#CBD5E1] line-clamp-1">Master complex queries and data manipulation.</p>
                    <div className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-bold">Course · 5h 30m</div>
                  </div>

                  <button className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer">
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* MILESTONE DETAIL MODAL */}
        <MilestoneDetailModal
          isOpen={isMilestoneModalOpen}
          onClose={() => setIsMilestoneModalOpen(false)}
          milestone={selectedMilestone}
        />

        {/* CAREER READINESS EXPLAIN MODAL */}
        <CareerReadinessExplainModal
          isOpen={isExplainModalOpen}
          onClose={() => setIsExplainModalOpen(false)}
          analysis={readinessAnalysis}
        />
      </div>
    </AppLayout>
  );
}

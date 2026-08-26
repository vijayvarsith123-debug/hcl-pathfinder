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
} from "lucide-react";

export default function DashboardPage() {
  const { profile, streakData, weeklyPlan, systemProgress } = useApp();

  const [selectedHeaderTab, setSelectedHeaderTab] = useState<string>("Home");
  const [selectedMilestone, setSelectedMilestone] = useState<RoadmapMilestone | null>(null);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);

  const readinessAnalysis = systemProgress.readinessAnalysis;

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
      <div className="space-y-6 pb-12 font-sans bg-[#0B0F19] text-slate-100 min-h-screen -m-6 p-6">
        {/* TOP HEADER SUB-NAVIGATION & SEARCH BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
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
                      ? "border-purple-500 text-purple-400 font-extrabold"
                      : "border-transparent text-slate-400 hover:text-slate-200"
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
                className="h-9 w-44 sm:w-56 pl-9 pr-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors relative cursor-pointer">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-purple-500" />
            </button>

            {/* USER PROFILE INFO */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              <div className="h-8 w-8 rounded-full bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center border border-purple-400 shadow-sm">
                OC
              </div>
              <div className="text-left">
                <div className="font-extrabold text-xs text-white leading-tight">Olive Castillo</div>
                <div className="text-[10px] text-purple-400 font-semibold">UI/UX Designer</div>
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
            <Card className="p-4 bg-slate-900/90 border-slate-800 text-white rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <BookOpen className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </div>
              <div className="mt-3">
                <div className="text-xs text-slate-400 font-semibold">Courses Completed</div>
                <div className="text-2xl font-black text-white mt-0.5">8</div>
                <p className="text-[10px] text-emerald-400 mt-1 font-semibold">+2 courses vs last month</p>
              </div>
            </Card>

            {/* 2. AVG TEST SCORE */}
            <Card className="p-4 bg-slate-900/90 border-slate-800 text-white rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </div>
              <div className="mt-3">
                <div className="text-xs text-slate-400 font-semibold">Avg Test Score</div>
                <div className="text-2xl font-black text-white mt-0.5">82%</div>
                <p className="text-[10px] text-emerald-400 mt-1 font-semibold">+3% vs last month</p>
              </div>
            </Card>

            {/* 3. TESTS PASSED */}
            <Card className="p-4 bg-slate-900/90 border-slate-800 text-white rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <div className="mt-3">
                <div className="text-xs text-slate-400 font-semibold">Tests Passed</div>
                <div className="text-2xl font-black text-white mt-0.5">14</div>
                <p className="text-[10px] text-emerald-400 mt-1 font-semibold">+3 vs last month</p>
              </div>
            </Card>

            {/* 4. UPCOMING DEADLINES */}
            <Card className="p-4 bg-slate-900/90 border-slate-800 text-white rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-orange-500/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-orange-400 transition-colors" />
              </div>
              <div className="mt-3">
                <div className="text-xs text-slate-400 font-semibold">Upcoming Deadlines</div>
                <div className="text-2xl font-black text-white mt-0.5">3</div>
                <p className="text-[10px] text-orange-400 mt-1 font-semibold">Due soon</p>
              </div>
            </Card>
          </div>

          {/* RIGHT OVERALL PROGRESS CARD (COL 4) */}
          <div className="lg:col-span-4">
            <Card
              onClick={() => setIsExplainModalOpen(true)}
              className="p-5 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/60 border-purple-500/30 text-white rounded-2xl shadow-lg cursor-pointer group hover:border-purple-500/60 transition-all relative overflow-hidden h-full flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400">
                  Overall Progress
                </span>
                <Target className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
              </div>

              <div className="flex items-center gap-4 my-3">
                {/* Large Circular Progress Ring */}
                <div className="relative h-18 w-18 rounded-full border-4 border-purple-500/30 flex items-center justify-center font-black text-2xl text-white shrink-0 bg-slate-950 shadow-md">
                  <span>68%</span>
                </div>
                <div>
                  <div className="text-sm font-extrabold text-white">Career Readiness</div>
                  <div className="text-xl font-black text-purple-400 mt-0.5">68%</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">
                    8 of 12 skills developing or mastered
                  </div>
                </div>
              </div>

              {/* Purple Area Progress Chart */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="h-6 w-full bg-purple-500/10 rounded border border-purple-500/20 overflow-hidden relative flex items-end">
                  <div className="w-[68%] h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-purple-400 font-bold mt-1.5">
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
            <Card className="bg-slate-900/90 border-slate-800 text-white rounded-2xl shadow-sm overflow-hidden">
              <CardHeader className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-extrabold text-white">
                    Your Learning Roadmap
                  </CardTitle>
                </div>

                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 text-xs font-bold text-slate-200">
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
                />

                {/* Bottom Legend & Button */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4 text-slate-400 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                      <span>In Progress</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                      <span>Locked</span>
                    </div>
                  </div>

                  <Link href="/learning-path">
                    <Button variant="primary" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs">
                      View Full Roadmap
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* 2. LEARNING ACTIVITY CARD */}
            <Card className="bg-slate-900/90 border-slate-800 text-white rounded-2xl shadow-sm p-4">
              <CardHeader className="p-0 pb-3 border-b border-slate-800/80 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-extrabold text-white flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-purple-400" />
                    <span>Learning Activity</span>
                  </CardTitle>
                </div>
                <Calendar className="h-4 w-4 text-slate-400" />
              </CardHeader>

              <CardContent className="p-0 pt-4 space-y-3 relative">
                {/* TOOLTIP POPUP (OCTOBER) */}
                <div className="absolute top-1 right-24 bg-purple-950 border border-purple-500/40 px-2.5 py-1 rounded-lg text-[10px] text-purple-200 font-bold shadow-lg z-10">
                  <div>October</div>
                  <div className="text-white">Avg: 4h 20m per week</div>
                </div>

                {/* BAR CHART */}
                <div className="h-44 flex items-end justify-between gap-2 pt-8 px-2 border-b border-slate-800 pb-2">
                  {monthlyBars.map((b) => (
                    <div key={b.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <div
                        style={{ height: `${b.heightPct}%` }}
                        className={`w-full max-w-[28px] rounded-t-lg transition-all ${
                          b.active
                            ? "bg-purple-500 ring-2 ring-purple-300 shadow-md shadow-purple-900/50"
                            : "bg-purple-600/40 hover:bg-purple-500"
                        }`}
                      />
                      <span className={`text-[10px] font-bold ${b.active ? "text-purple-400 font-mono" : "text-slate-400"}`}>
                        {b.month}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN (COL 4): QUICK STATS, TODAY'S FOCUS, RECOMMENDED */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. QUICK STATS (2x2 GRID) */}
            <Card className="bg-slate-900/90 border-slate-800 text-white rounded-2xl shadow-sm p-4">
              <CardHeader className="p-0 pb-3 border-b border-slate-800/80">
                <CardTitle className="text-sm font-extrabold text-white">Quick Stats</CardTitle>
              </CardHeader>

              <CardContent className="p-0 pt-4 grid grid-cols-2 gap-4 text-xs">
                {/* STAT 1 */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <Clock className="h-4 w-4 text-purple-400 mb-1" />
                  <div className="text-base font-black text-white">74.5 hrs</div>
                  <div className="text-[10px] text-slate-400 font-semibold">Total Learning</div>
                </div>

                {/* STAT 2 */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <BookOpen className="h-4 w-4 text-emerald-400 mb-1" />
                  <div className="text-base font-black text-white">18</div>
                  <div className="text-[10px] text-slate-400 font-semibold">Resources Completed</div>
                </div>

                {/* STAT 3 */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <Star className="h-4 w-4 text-amber-400 mb-1" />
                  <div className="text-base font-black text-white">78%</div>
                  <div className="text-[10px] text-slate-400 font-semibold">Avg Test Score</div>
                </div>

                {/* STAT 4 */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <FolderGit2 className="h-4 w-4 text-blue-400 mb-1" />
                  <div className="text-base font-black text-white">7</div>
                  <div className="text-[10px] text-slate-400 font-semibold">Projects Completed</div>
                </div>
              </CardContent>
            </Card>

            {/* 2. TODAY'S FOCUS CARD */}
            <Card className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/80 border-purple-500/30 text-white rounded-2xl shadow-lg p-5 flex flex-col justify-between text-center relative overflow-hidden">
              {/* Target Bullseye Decorative Icon */}
              <div className="flex justify-center my-2">
                <div className="h-20 w-20 rounded-full border-4 border-purple-500/30 bg-purple-600/20 flex items-center justify-center text-purple-400 shadow-xl">
                  <Target className="h-10 w-10 animate-pulse" />
                </div>
              </div>

              <div className="space-y-1">
                <Badge variant="primary" className="bg-purple-600 text-white font-extrabold text-[10px] mx-auto">
                  Today&apos;s Focus
                </Badge>
                <h3 className="text-lg font-black text-white pt-1">Data Analysis</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Continue exploring distributions and summary statistics.
                </p>
              </div>

              <div className="pt-4">
                <Link href="/weekly-plan">
                  <Button variant="primary" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-10 shadow-md">
                    Continue Learning →
                  </Button>
                </Link>
              </div>
            </Card>

            {/* 3. RECOMMENDED FOR YOU CARD */}
            <Card className="bg-slate-900/90 border-slate-800 text-white rounded-2xl shadow-sm p-4">
              <CardHeader className="p-0 pb-3 border-b border-slate-800/80 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-extrabold text-white">Recommended for You</CardTitle>
                <Link href="/resources">
                  <span className="text-xs font-bold text-purple-400 hover:underline">View all</span>
                </Link>
              </CardHeader>

              <CardContent className="p-0 pt-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  {/* Thumbnail */}
                  <div className="h-14 w-16 rounded-lg bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-white shrink-0 relative overflow-hidden group">
                    <Play className="h-6 w-6 text-purple-300 group-hover:scale-110 transition-transform" />
                  </div>

                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="font-extrabold text-xs text-white truncate">Advanced SQL</div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">Master complex queries and data manipulation.</p>
                    <div className="text-[10px] text-purple-400 font-mono font-bold">Course · 5h 30m</div>
                  </div>

                  <button className="text-slate-500 hover:text-purple-400 p-1 cursor-pointer">
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

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useApp } from "@/context/AppContext";
import { CareerReadinessExplainModal } from "@/components/progress/CareerReadinessExplainModal";
import {
  Award,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FolderGit2,
  ArrowRight,
  HelpCircle,
  BarChart3,
  Target,
  Zap,
  BookOpen,
  PieChart,
  Layers,
  ChevronDown,
  Filter,
  ArrowUpRight,
} from "lucide-react";

export default function ProgressPage() {
  const { profile, userSkills, completedResources, activeAssessmentResult, systemProgress } = useApp();

  const [activeTab, setActiveTab] = useState<string>("Overview");
  const [skillFilter, setSkillFilter] = useState<string>("All Skills");
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);

  const readinessAnalysis = systemProgress.readinessAnalysis;

  const tabs = [
    "Overview",
    "Skills",
    "Roadmap",
    "Activity",
    "Assessments",
    "Projects",
    "Detailed Report",
  ];

  // SKILL MASTERY MATRIX TABLE ROWS (EXACT DATA AS REQUESTED)
  const matrixRows = [
    {
      skill: "Python",
      category: "Programming",
      importance: "Critical",
      masteryPct: 62,
      levelLabel: "Intermediate",
      status: "In Progress",
      actionText: "Continue",
      actionUrl: "/weekly-plan",
    },
    {
      skill: "Data Structures & Algorithms",
      category: "Computer Science",
      importance: "Critical",
      masteryPct: 3,
      levelLabel: "Beginner",
      status: "Not Started",
      actionText: "Start Learning",
      actionUrl: "/weekly-plan",
    },
    {
      skill: "Object-Oriented Programming",
      category: "Software Design",
      importance: "Critical",
      masteryPct: 3,
      levelLabel: "Beginner",
      status: "Not Started",
      actionText: "Start Learning",
      actionUrl: "/weekly-plan",
    },
    {
      skill: "SQL",
      category: "Databases",
      importance: "High",
      masteryPct: 42,
      levelLabel: "Developing",
      status: "In Progress",
      actionText: "Continue",
      actionUrl: "/weekly-plan",
    },
    {
      skill: "Statistics & Probability",
      category: "Mathematics",
      importance: "High",
      masteryPct: 18,
      levelLabel: "Beginner",
      status: "In Progress",
      actionText: "Practice",
      actionUrl: "/assessments",
    },
    {
      skill: "Machine Learning",
      category: "Core ML",
      importance: "Critical",
      masteryPct: 51,
      levelLabel: "Developing",
      status: "In Progress",
      actionText: "Continue",
      actionUrl: "/weekly-plan",
    },
    {
      skill: "Model Evaluation",
      category: "Core ML",
      importance: "Critical",
      masteryPct: 28,
      levelLabel: "Beginner",
      status: "In Progress",
      actionText: "Practice",
      actionUrl: "/assessments",
    },
    {
      skill: "Deployment",
      category: "MLOps",
      importance: "High",
      masteryPct: 12,
      levelLabel: "Beginner",
      status: "In Progress",
      actionText: "Start Learning",
      actionUrl: "/weekly-plan",
    },
  ];

  // Category Overview Donut percentages
  const categoriesOverview = [
    { name: "Programming", score: 68, color: "bg-blue-500" },
    { name: "Math & Stats", score: 41, color: "bg-amber-500" },
    { name: "Data Handling", score: 55, color: "bg-emerald-500" },
    { name: "Machine Learning", score: 44, color: "bg-purple-500" },
    { name: "Deployment", score: 12, color: "bg-sky-400" },
  ];

  // Skills by Mastery Level Distribution
  const masteryDistribution = [
    { label: "Mastered (80–100%)", count: 3, pct: 25 },
    { label: "Strong (60–79%)", count: 5, pct: 40 },
    { label: "Developing (30–59%)", count: 2, pct: 18 },
    { label: "Beginner (1–29%)", count: 2, pct: 17 },
    { label: "Not Started (0%)", count: 0, pct: 0 },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 pb-12 font-sans bg-slate-950 text-slate-100 min-h-screen -m-6 p-6">
        {/* PAGE HEADER */}
        <div className="border-b border-slate-800 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                My Progress
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Track your skill mastery and career readiness
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExplainModalOpen(true)}
              className="border-purple-500/40 text-purple-300 hover:bg-purple-950/40 text-xs font-bold shrink-0 self-start sm:self-auto"
            >
              Why 68% Readiness? →
            </Button>
          </div>

          {/* HORIZONTAL NAVIGATION TABS */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto no-scrollbar border-b border-slate-800/80 pb-0.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "border-purple-500 text-purple-400 bg-purple-500/10 rounded-t-lg"
                      : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5 TOP SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. CAREER READINESS */}
          <Card
            onClick={() => setIsExplainModalOpen(true)}
            className="p-4 bg-slate-900/90 border-purple-500/30 text-white shadow-lg rounded-2xl cursor-pointer group hover:border-purple-500/60 transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-400">
                Career Readiness
              </span>
              <Target className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>

            <div className="flex items-center gap-3 mt-2">
              {/* Circular Progress Ring */}
              <div className="relative h-14 w-14 rounded-full border-4 border-purple-500/30 flex items-center justify-center font-black text-lg text-white shrink-0 bg-slate-950">
                <span>68%</span>
              </div>
              <div>
                <div className="text-xs font-extrabold text-emerald-400">Developing Strong</div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                  8 of 12 critical skills developing or mastered
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-end text-[11px] font-bold text-purple-400 group-hover:text-purple-300">
              <span>View details →</span>
            </div>
          </Card>

          {/* 2. SKILLS MASTERED */}
          <Card className="p-4 bg-slate-900/90 border-slate-800 text-white rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Skills Mastered
                </span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-black text-white mt-2">8</div>
              <p className="text-[11px] text-emerald-400 mt-1 font-semibold">+2 this month</p>
            </div>
            <Link href="/progress" className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-end text-[11px] font-bold text-purple-400 hover:text-purple-300">
              <span>View skills →</span>
            </Link>
          </Card>

          {/* 3. PROJECTS COMPLETED */}
          <Card className="p-4 bg-slate-900/90 border-slate-800 text-white rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Projects Completed
                </span>
                <FolderGit2 className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-white mt-2">7</div>
              <p className="text-[11px] text-emerald-400 mt-1 font-semibold">+2 this month</p>
            </div>
            <Link href="/projects" className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-end text-[11px] font-bold text-purple-400 hover:text-purple-300">
              <span>View projects →</span>
            </Link>
          </Card>

          {/* 4. ASSESSMENT AVERAGE */}
          <Card className="p-4 bg-slate-900/90 border-slate-800 text-white rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Assessment Average
                </span>
                <Award className="h-4 w-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-white mt-2">82%</div>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">Based on 11 assessments</p>
            </div>
            <Link href="/assessments" className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-end text-[11px] font-bold text-purple-400 hover:text-purple-300">
              <span>View assessments →</span>
            </Link>
          </Card>

          {/* 5. TOTAL LEARNING HOURS */}
          <Card className="p-4 bg-slate-900/90 border-slate-800 text-white rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Total Learning Hours
                </span>
                <Clock className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-3xl font-black text-white mt-2">74.5 hrs</div>
              <p className="text-[11px] text-emerald-400 mt-1 font-semibold">+12.5 hrs this month</p>
            </div>
            <Link href="/weekly-plan" className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-end text-[11px] font-bold text-purple-400 hover:text-purple-300">
              <span>View activity →</span>
            </Link>
          </Card>
        </div>

        {/* MAIN CONTENT GRID: REQUIRED SKILL MASTERY MATRIX + RIGHT ANALYTICS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN (COL 8): REQUIRED SKILL MASTERY MATRIX */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="bg-slate-900/90 border-slate-800 text-white rounded-2xl shadow-lg overflow-hidden">
              <CardHeader className="p-5 border-b border-slate-800/80 bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-extrabold text-white">
                    Required Skill Mastery Matrix
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400 mt-0.5">
                    Your progress towards the skills required for {profile.careerGoal || "Machine Learning Engineer"}
                  </CardDescription>
                </div>

                {/* FILTER DROPDOWN */}
                <div className="flex items-center gap-2">
                  <select
                    value={skillFilter}
                    onChange={(e) => setSkillFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="All Skills">All Skills</option>
                    <option value="Critical Only">Critical Only</option>
                    <option value="In Progress">In Progress Only</option>
                  </select>
                </div>
              </CardHeader>

              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4 font-bold">Skill</th>
                      <th className="py-3 px-4 font-bold">Importance</th>
                      <th className="py-3 px-4 font-bold">Mastery Level</th>
                      <th className="py-3 px-4 font-bold">Progress</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {matrixRows.map((row) => {
                      const isCritical = row.importance === "Critical";
                      const isNotStarted = row.status === "Not Started";

                      return (
                        <tr key={row.skill} className="hover:bg-slate-800/40 transition-colors">
                          {/* SKILL & CATEGORY */}
                          <td className="py-3.5 px-4">
                            <div className="font-extrabold text-slate-100 text-xs">{row.skill}</div>
                            <div className="text-[10px] text-slate-500">{row.category}</div>
                          </td>

                          {/* IMPORTANCE */}
                          <td className="py-3.5 px-4">
                            <Badge
                              variant={isCritical ? "danger" : "warning"}
                              className="text-[9px] py-0.5 px-2 font-bold uppercase tracking-wider"
                            >
                              {row.importance}
                            </Badge>
                          </td>

                          {/* MASTERY LEVEL TEXT */}
                          <td className="py-3.5 px-4 font-mono">
                            <span className="font-bold text-slate-100">{row.masteryPct}%</span>{" "}
                            <span className="text-slate-400 text-[10px]">({row.levelLabel})</span>
                          </td>

                          {/* PROGRESS BAR */}
                          <td className="py-3.5 px-4 w-32">
                            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                              <div
                                style={{ width: `${row.masteryPct}%` }}
                                className={`h-full rounded-full ${
                                  row.masteryPct >= 60
                                    ? "bg-purple-500"
                                    : row.masteryPct >= 30
                                    ? "bg-blue-500"
                                    : "bg-amber-500"
                                }`}
                              />
                            </div>
                          </td>

                          {/* STATUS */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isNotStarted
                                  ? "bg-slate-800 text-slate-400"
                                  : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>

                          {/* ACTION BUTTON */}
                          <td className="py-3.5 px-4 text-right">
                            <Link href={row.actionUrl}>
                              <Button
                                size="sm"
                                variant={isNotStarted ? "outline" : "primary"}
                                className={`text-[11px] h-7 px-3 font-bold ${
                                  isNotStarted
                                    ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                                    : "bg-purple-600 hover:bg-purple-700 text-white"
                                }`}
                              >
                                {row.actionText}
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* BOTTOM CONTROL */}
                <div className="p-3 text-center border-t border-slate-800 bg-slate-950/40">
                  <button className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1 cursor-pointer">
                    <span>View All Skills ↓</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN (COL 4): 3 STACKED ANALYTICS CARDS */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. SKILL CATEGORY OVERVIEW (DONUT / RADIAL CHART) */}
            <Card className="bg-slate-900/90 border-slate-800 text-white rounded-2xl shadow-sm p-4">
              <CardHeader className="p-0 pb-3 border-b border-slate-800/80">
                <CardTitle className="text-sm font-extrabold text-white flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-purple-400" />
                  <span>Skill Category Overview</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 pt-4 space-y-4">
                {/* Donut Chart Visual Representation */}
                <div className="flex items-center justify-center relative my-2">
                  <div className="h-32 w-32 rounded-full border-8 border-purple-500/20 flex items-center justify-center border-t-purple-500 border-r-blue-500 border-b-emerald-500 border-l-amber-500 animate-spin-slow">
                    <div className="h-20 w-20 rounded-full bg-slate-950 flex flex-col items-center justify-center text-center">
                      <span className="text-base font-black text-white">55%</span>
                      <span className="text-[9px] text-slate-400 font-mono">AVG</span>
                    </div>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="space-y-1.5 text-xs font-semibold">
                  {categoriesOverview.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between p-1.5 rounded bg-slate-950/60">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${cat.color}`} />
                        <span className="text-slate-300">{cat.name}</span>
                      </div>
                      <span className="font-mono font-bold text-white">{cat.score}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 2. SKILLS BY MASTERY LEVEL */}
            <Card className="bg-slate-900/90 border-slate-800 text-white rounded-2xl shadow-sm p-4">
              <CardHeader className="p-0 pb-3 border-b border-slate-800/80">
                <CardTitle className="text-sm font-extrabold text-white flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-400" />
                  <span>Skills by Mastery Level</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 pt-4 space-y-2.5 text-xs">
                {masteryDistribution.map((dist) => (
                  <div key={dist.label} className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300">{dist.label}</span>
                      <span className="font-mono font-bold text-purple-400">{dist.count}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        style={{ width: `${dist.pct}%` }}
                        className="bg-purple-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 3. WHAT'S HOLDING YOU BACK? */}
            <Card className="bg-slate-900/90 border-slate-800 text-white rounded-2xl shadow-sm p-4">
              <CardHeader className="p-0 pb-3 border-b border-slate-800/80">
                <CardTitle className="text-sm font-extrabold text-white flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span>What&apos;s Holding You Back?</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 pt-3 space-y-2.5 text-xs">
                {/* GAP 1 */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-red-500/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white">Deployment</span>
                    <Badge variant="danger" className="text-[9px] py-0 px-1.5">Critical Gap</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400">Focus area to improve career readiness</p>
                  <div className="text-right font-mono font-extrabold text-red-400 text-[11px]">12% mastery</div>
                </div>

                {/* GAP 2 */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white">Model Evaluation</span>
                    <Badge variant="warning" className="text-[9px] py-0 px-1.5">High Gap</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400">Essential for ML model development</p>
                  <div className="text-right font-mono font-extrabold text-amber-400 text-[11px]">28% mastery</div>
                </div>

                {/* GAP 3 */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white">Statistics & Probability</span>
                    <Badge variant="secondary" className="text-[9px] py-0 px-1.5">Medium Gap</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400">Important for data understanding</p>
                  <div className="text-right font-mono font-extrabold text-amber-300 text-[11px]">18% mastery</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* BOTTOM SECTION: SKILL GAP ANALYSIS & RECOMMENDED FOCUS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* SKILL GAP ANALYSIS */}
          <Card className="bg-slate-900/90 border-slate-800 text-white rounded-2xl p-5 shadow-lg">
            <div className="space-y-2">
              <h3 className="font-extrabold text-base text-white">Skill Gap Analysis</h3>
              <p className="text-xs text-slate-400">Focus on closing these gaps to improve your career readiness</p>

              <div className="flex items-center gap-4 pt-3 flex-wrap">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-red-500/30 text-xs">
                  <span className="h-6 w-6 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-black">4</span>
                  <span className="font-bold text-slate-200">Critical Gaps</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 text-xs">
                  <span className="h-6 w-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">3</span>
                  <span className="font-bold text-slate-200">High Priority Gaps</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <span className="h-6 w-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-black">2</span>
                  <span className="font-bold text-slate-200">Medium Priority Gaps</span>
                </div>
              </div>
            </div>
          </Card>

          {/* RECOMMENDED FOCUS */}
          <Card className="bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950 border-purple-500/30 text-white rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="primary" className="bg-purple-600 text-white font-extrabold text-[10px]">
                  Recommended Focus
                </Badge>
              </div>
              <h3 className="font-extrabold text-base text-white pt-1">
                Focus on Deployment and Model Evaluation
              </h3>
              <p className="text-xs text-slate-300">
                These skills have the biggest impact on your career readiness score.
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <Link href="/weekly-plan">
                <Button variant="primary" className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  View Recommendations →
                </Button>
              </Link>
            </div>
          </Card>
        </div>

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

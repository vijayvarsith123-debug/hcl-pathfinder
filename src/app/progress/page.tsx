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
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { INITIAL_SUBTOPIC_MASTERY } from "@/lib/adaptive/mastery-tracker";

export default function ProgressPage() {
  const { profile, userSkills, completedResources, activeAssessmentResult, systemProgress } = useApp();

  const [activeTab, setActiveTab] = useState<string>("Overview");
  const [skillFilter, setSkillFilter] = useState<string>("All Skills");
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);

  const readinessAnalysis = systemProgress.readinessAnalysis;

  const tabs = [
    "Overview",
    "Subtopic Mastery",
    "Roadmap",
    "Activity",
    "Assessments",
    "Projects",
    "Detailed Report",
  ];

  // ADAPTIVE SUBTOPIC MASTERY DATA
  const subtopicMasteryData = INITIAL_SUBTOPIC_MASTERY;
  const weakSubtopics = subtopicMasteryData.filter((s) => s.status === "Weak");

  // Category Overview percentages
  const categoriesOverview = [
    { name: "Programming", score: 68, color: "bg-blue-600" },
    { name: "Math & Stats", score: 41, color: "bg-amber-500" },
    { name: "Data Handling", score: 55, color: "bg-emerald-500" },
    { name: "Machine Learning", score: 44, color: "bg-sky-500" },
    { name: "Deployment", score: 12, color: "bg-indigo-500" },
  ];

  // Skills by Mastery Level Distribution
  const masteryDistribution = [
    { label: "Mastered (80–100%)", count: 2, pct: 33 },
    { label: "Developing (60–79%)", count: 1, pct: 17 },
    { label: "Weak (< 60%)", count: 3, pct: 50 },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 pb-12 font-sans transition-colors">
        {/* PAGE HEADER */}
        <div className="border-b border-slate-200 dark:border-[#273449] pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="primary" className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30">
                  Adaptive Intelligence Layer
                </Badge>
                <span className="text-xs text-slate-500 dark:text-[#CBD5E1] font-medium">• Subtopic Mastery & Performance Trends</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                My Progress & Subtopic Mastery
              </h1>
              <p className="text-xs text-slate-600 dark:text-[#CBD5E1] mt-1 font-medium">
                Track subtopic-level proficiency, weak area trends, and AI-driven optional support recommendations.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExplainModalOpen(true)}
              className="border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-bold shrink-0 self-start sm:self-auto"
            >
              Why 68% Readiness? →
            </Button>
          </div>

          {/* HORIZONTAL NAVIGATION TABS */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-[#273449] pb-0.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40 rounded-t-lg"
                      : "border-transparent text-slate-600 dark:text-[#CBD5E1] hover:text-slate-900 dark:hover:text-white"
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
            className="p-4 bg-white dark:bg-[#172033] border-blue-500/30 text-slate-900 dark:text-[#F8FAFC] shadow-xs rounded-2xl cursor-pointer group hover:border-blue-500/60 transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Career Readiness
              </span>
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
            </div>

            <div className="flex items-center gap-3 mt-2">
              <div className="relative h-14 w-14 rounded-full border-4 border-blue-500/30 flex items-center justify-center font-black text-lg text-slate-900 dark:text-white shrink-0 bg-slate-50 dark:bg-[#0B1220]">
                <span>68%</span>
              </div>
              <div>
                <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">Developing Strong</div>
                <div className="text-[10px] text-slate-600 dark:text-[#CBD5E1] mt-0.5 line-clamp-2">
                  8 of 12 critical skills developing or mastered
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-[#273449]/60 flex items-center justify-end text-[11px] font-bold text-blue-600 dark:text-blue-400">
              <span>View details →</span>
            </div>
          </Card>

          {/* 2. SUBTOPICS MASTERED */}
          <Card className="p-4 bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-900 dark:text-[#F8FAFC] rounded-2xl flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-[#CBD5E1]">
                  Subtopics Mastered
                </span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">2</div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">DataFrames & Missing Values</p>
            </div>
            <Link href="/progress" className="mt-3 pt-2 border-t border-slate-100 dark:border-[#273449]/60 flex items-center justify-end text-[11px] font-bold text-blue-600 dark:text-blue-400">
              <span>View subtopics →</span>
            </Link>
          </Card>

          {/* 3. WEAK AREAS (NEEDS ATTENTION) */}
          <Card className="p-4 bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-900 dark:text-[#F8FAFC] rounded-2xl flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Needs Attention
                </span>
                <AlertTriangle className="h-4 w-4 text-rose-500" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">{weakSubtopics.length}</div>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-bold">Filtering, GroupBy & Trees</p>
            </div>
            <Link href="/assessments" className="mt-3 pt-2 border-t border-slate-100 dark:border-[#273449]/60 flex items-center justify-end text-[11px] font-bold text-rose-600 dark:text-rose-400">
              <span>Targeted Assessment →</span>
            </Link>
          </Card>

          {/* 4. ASSESSMENT AVERAGE */}
          <Card className="p-4 bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-900 dark:text-[#F8FAFC] rounded-2xl flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-[#CBD5E1]">
                  Assessment Average
                </span>
                <Award className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">72%</div>
              <p className="text-[11px] text-slate-600 dark:text-[#CBD5E1] mt-1 font-medium">Based on recent diagnostic</p>
            </div>
            <Link href="/assessments" className="mt-3 pt-2 border-t border-slate-100 dark:border-[#273449]/60 flex items-center justify-end text-[11px] font-bold text-blue-600 dark:text-blue-400">
              <span>Take Assessment →</span>
            </Link>
          </Card>

          {/* 5. TOTAL LEARNING HOURS */}
          <Card className="p-4 bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-900 dark:text-[#F8FAFC] rounded-2xl flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-[#CBD5E1]">
                  Total Learning Hours
                </span>
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">74.5 hrs</div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">+12.5 hrs this month</p>
            </div>
            <Link href="/weekly-plan" className="mt-3 pt-2 border-t border-slate-100 dark:border-[#273449]/60 flex items-center justify-end text-[11px] font-bold text-blue-600 dark:text-blue-400">
              <span>View schedule →</span>
            </Link>
          </Card>
        </div>

        {/* MAIN CONTENT GRID: ADAPTIVE SUBTOPIC MASTERY MATRIX + RIGHT ANALYTICS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN (COL 8): SUBTOPIC MASTERY MATRIX & PERFORMANCE TRENDS */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-900 dark:text-[#F8FAFC] rounded-2xl shadow-xs overflow-hidden">
              <CardHeader className="p-5 border-b border-slate-100 dark:border-[#273449]/60 bg-slate-50/50 dark:bg-[#111827] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Adaptive Subtopic Mastery Matrix
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-600 dark:text-[#CBD5E1] mt-0.5">
                    Deterministic thresholds: Weak (&lt; 60%), Developing (60–79%), Mastered (≥ 80%)
                  </CardDescription>
                </div>

                {/* FILTER DROPDOWN */}
                <div className="flex items-center gap-2">
                  <select
                    value={skillFilter}
                    onChange={(e) => setSkillFilter(e.target.value)}
                    className="bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-[#273449] rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-[#CBD5E1] focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="All Skills">All Subtopics</option>
                    <option value="Weak Only">Weak Only (&lt; 60%)</option>
                    <option value="Mastered Only">Mastered Only (≥ 80%)</option>
                  </select>
                </div>
              </CardHeader>

              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-[#0B1220] text-slate-600 dark:text-[#CBD5E1] uppercase font-mono text-[10px] tracking-wider border-b border-slate-200 dark:border-[#273449]">
                    <tr>
                      <th className="py-3 px-4 font-bold">Subtopic & Topic</th>
                      <th className="py-3 px-4 font-bold">Mastery Score</th>
                      <th className="py-3 px-4 font-bold">Progress Bar</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 font-bold">Trend History</th>
                      <th className="py-3 px-4 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#273449]/60 font-medium">
                    {subtopicMasteryData.map((row) => {
                      const isWeak = row.status === "Weak";
                      const isMastered = row.status === "Mastered";

                      return (
                        <tr key={row.subtopicId} className="hover:bg-slate-50 dark:hover:bg-[#1E293B]/60 transition-colors">
                          {/* SUBTOPIC & TOPIC */}
                          <td className="py-3.5 px-4">
                            <div className="font-extrabold text-slate-900 dark:text-[#F8FAFC] text-xs">{row.subtopicName}</div>
                            <div className="text-[10px] text-slate-500 dark:text-[#94A3B8]">{row.topicName}</div>
                          </td>

                          {/* MASTERY SCORE */}
                          <td className="py-3.5 px-4 font-mono">
                            <span className="font-bold text-slate-900 dark:text-white">{row.masteryScore}%</span>
                          </td>

                          {/* PROGRESS BAR */}
                          <td className="py-3.5 px-4 w-32">
                            <div className="w-full bg-slate-100 dark:bg-[#111827] rounded-full h-2 overflow-hidden">
                              <div
                                style={{ width: `${row.masteryScore}%` }}
                                className={`h-full rounded-full ${
                                  isMastered
                                    ? "bg-emerald-500"
                                    : isWeak
                                    ? "bg-rose-500"
                                    : "bg-blue-600 dark:bg-blue-500"
                                }`}
                              />
                            </div>
                          </td>

                          {/* STATUS BADGE */}
                          <td className="py-3.5 px-4">
                            <Badge
                              variant={isWeak ? "danger" : isMastered ? "success" : "warning"}
                              className="text-[9px] py-0.5 px-2 font-bold uppercase tracking-wider"
                            >
                              {row.status}
                            </Badge>
                          </td>

                          {/* PERFORMANCE TREND */}
                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            <div className="flex items-center gap-1">
                              <TrendingUp className={`h-3.5 w-3.5 ${row.trend === "Improving" ? "text-emerald-500" : "text-amber-500"}`} />
                              <span className="text-slate-700 dark:text-[#CBD5E1] font-bold">
                                {row.history.map((h) => `${h.score}%`).join(" → ")}
                              </span>
                            </div>
                          </td>

                          {/* ACTION BUTTON */}
                          <td className="py-3.5 px-4 text-right">
                            <Link href="/assessments">
                              <Button
                                size="sm"
                                variant={isWeak ? "primary" : "outline"}
                                className={`text-[11px] h-7 px-3 font-bold ${
                                  isWeak
                                    ? "bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
                                    : "border-slate-200 dark:border-[#273449] text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                {isWeak ? "Target Practice" : "Practice"}
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* AI MISCONCEPTION & PERFORMANCE INSIGHT CARD */}
            <Card className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-[#172033] dark:via-[#172033] dark:to-[#1E3A8A] border-blue-500/30 text-white rounded-2xl p-5 shadow-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-200" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-100">
                    Adaptive Engine Performance Insight
                  </span>
                </div>

                <h3 className="font-black text-base text-white">
                  Pandas Filtering performance is improving steadily (+10% increase).
                </h3>

                <p className="text-xs text-blue-100 dark:text-[#CBD5E1] leading-relaxed">
                  Your recent diagnostic errors suggest difficulty with boolean indexing syntax (`df[df['col'] &gt; val]`). Your next assessment will automatically include 2 additional targeted questions on Filtering.
                </p>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN (COL 4): 3 STACKED ANALYTICS CARDS */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. SKILL CATEGORY OVERVIEW */}
            <Card className="bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-900 dark:text-[#F8FAFC] rounded-2xl shadow-xs p-4">
              <CardHeader className="p-0 pb-3 border-b border-slate-100 dark:border-[#273449]/60">
                <CardTitle className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Skill Category Overview</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 pt-4 space-y-4">
                <div className="flex items-center justify-center relative my-2">
                  <div className="h-32 w-32 rounded-full border-8 border-blue-500/20 flex items-center justify-center border-t-blue-600 border-r-sky-500 border-b-emerald-500 border-l-amber-500">
                    <div className="h-20 w-20 rounded-full bg-white dark:bg-[#0B1220] flex flex-col items-center justify-center text-center shadow-xs">
                      <span className="text-base font-black text-slate-900 dark:text-white">55%</span>
                      <span className="text-[9px] text-slate-500 dark:text-[#CBD5E1] font-mono">AVG</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-semibold">
                  {categoriesOverview.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between p-1.5 rounded bg-slate-50 dark:bg-[#111827]">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${cat.color}`} />
                        <span className="text-slate-700 dark:text-[#CBD5E1]">{cat.name}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{cat.score}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 2. SUBTOPICS BY MASTERY LEVEL */}
            <Card className="bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-900 dark:text-[#F8FAFC] rounded-2xl shadow-xs p-4">
              <CardHeader className="p-0 pb-3 border-b border-slate-100 dark:border-[#273449]/60">
                <CardTitle className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Subtopics by Mastery Level</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 pt-4 space-y-2.5 text-xs">
                {masteryDistribution.map((dist) => (
                  <div key={dist.label} className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-700 dark:text-[#CBD5E1]">{dist.label}</span>
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{dist.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-[#111827] rounded-full h-1.5 overflow-hidden">
                      <div
                        style={{ width: `${dist.pct}%` }}
                        className="bg-blue-600 dark:bg-blue-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 3. OPTIONAL SUPPORT CARD */}
            <Card className="bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-900 dark:text-[#F8FAFC] rounded-2xl shadow-xs p-4">
              <CardHeader className="p-0 pb-3 border-b border-slate-100 dark:border-[#273449]/60">
                <CardTitle className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-amber-500" />
                  <span>Optional Support Resources</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 pt-3 space-y-2 text-xs">
                <a
                  href="https://www.youtube.com/watch?v=2AFGPdNn4FM"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] block hover:border-blue-500 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">StatQuest: Boolean Indexing</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-[#CBD5E1]">10-min visual guide on Pandas row filtering</p>
                  <span className="text-[9px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Optional Support</span>
                </a>

                <a
                  href="https://www.youtube.com/watch?v=_L39rN6gz7Y"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] block hover:border-blue-500 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">StatQuest: Gini Impurity</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-[#CBD5E1]">Visual intuition for Decision Tree splits</p>
                  <span className="text-[9px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Optional Support</span>
                </a>
              </CardContent>
            </Card>
          </div>
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

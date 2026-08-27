"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Brain,
  Layers,
  Target,
  BarChart2,
  BookOpen,
  FolderGit2,
  CheckSquare,
  Bot,
  RefreshCw,
  Zap,
  Code,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BuddyAvatar } from "@/components/buddy/BuddyAvatar";

export default function LandingPage() {
  const [activeBuddyQuery, setActiveBuddyQuery] = useState(0);

  const sampleBuddyQueries = [
    {
      user: "What is my weakest skill?",
      buddy: "Statistics — 32% (Weak). Target proficiency is 70%. Practice Probability before moving to the Machine Learning module.",
      mood: "focused" as const,
      tag: "Rule-Based PathAI Engine",
    },
    {
      user: "What should I learn next?",
      buddy: "Practice Probability next. Your mastery is 32%, making it your weakest prerequisite before advancing in Machine Learning Fundamentals.",
      mood: "focused" as const,
      tag: "Rule-Based PathAI Engine",
    },
    {
      user: "What is SQL JOIN?",
      buddy: "A JOIN combines rows from two tables using a related column. For example, an INNER JOIN returns rows that have matching values in both tables.",
      mood: "explaining" as const,
      tag: "Gemini AI Layer (Temp: 0.1)",
    },
    {
      user: "Why is my Python code throwing TypeError?",
      buddy: "The error occurs because `x` is a string, but the code treats it as an integer. Convert it with `int(x)` before performing the calculation.",
      mood: "thinking" as const,
      tag: "Gemini AI Layer (Temp: 0.1)",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Tell Us Your Goal",
      description: "Describe your career goal in natural language. PathAI extracts target roles, required skills, and timelines.",
      icon: Target,
    },
    {
      number: "02",
      title: "Understand Your Skills",
      description: "Take a brief diagnostic assessment. PathAI evaluates your current proficiency against industry role benchmarks.",
      icon: BarChart2,
    },
    {
      number: "03",
      title: "Build Your Learning Path",
      description: "Get a prerequisite-aware, personalized roadmap tailored to your weekly availability and skill gaps.",
      icon: Layers,
    },
    {
      number: "04",
      title: "Learn and Adapt",
      description: "As you complete assessments, PathAI continuously adjusts your weekly tasks so you never waste time.",
      icon: RefreshCw,
    },
  ];

  const features = [
    {
      title: "Natural Language Goal Parsing",
      description: "Type 'I want to become an ML Engineer in 8 months' and PathAI maps the exact required skills.",
      icon: Brain,
    },
    {
      title: "Skill-Gap Scoring Engine",
      description: "Identifies your exact percentage gaps (e.g., Statistics: 38% gap) to prioritize critical modules.",
      icon: Target,
    },
    {
      title: "Adaptive Learning Engine",
      description: "Scored low on a quiz? PathAI automatically inserts prerequisite review tasks and modifies next week's plan.",
      icon: RefreshCw,
    },
    {
      title: "Curated Free Learning Resources",
      description: "Connects you to top 100% free courses, YouTube playlists, and documentation for 193+ computer-centric topics.",
      icon: BookOpen,
    },
    {
      title: "Hands-on Capstone Projects",
      description: "Real-world tech projects matching your current level, complete with step-by-step checklists.",
      icon: FolderGit2,
    },
    {
      title: "Task-Focused Buddy AI Assistant",
      description: "Ask questions anytime. Buddy gives direct 1–4 sentence factual answers grounded in your active learning roadmap.",
      icon: Bot,
    },
  ];

  const computerCareers = [
    { title: "Software Development", count: "13 Topics", skills: "DSA, OOP, Git, Databases, SQL, OS, System Design, Testing" },
    { title: "Full-Stack Development", count: "12 Topics", skills: "HTML, CSS, JS, TS, React, Next.js, REST APIs, Web Security" },
    { title: "AI & Data Science", count: "20 Topics", skills: "Python, NumPy, Pandas, Math, ML, Deep Learning, MLOps" },
    { title: "Cybersecurity & Security Ops", count: "20 Topics", skills: "Networking, Linux, OWASP, Pen Testing, Digital Forensics, CTF" },
    { title: "Cloud & DevOps Engineering", count: "21 Topics", skills: "Docker, Kubernetes, CI/CD, Terraform, AWS/GCP, Monitoring" },
    { title: "Mobile & Game Development", count: "25 Topics", skills: "Flutter, React Native, Game Math, Game Physics, Unity/Unreal" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1220] text-slate-900 dark:text-[#F8FAFC] flex flex-col font-sans transition-colors">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-100 dark:border-[#273449]/70 bg-gradient-to-b from-slate-50/80 via-white to-white dark:from-[#111827]/40 dark:via-[#0B1220] dark:to-[#0B1220]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <Badge variant="primary" className="px-3 py-1 text-xs gap-1.5 font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                Computer-Centric AI Personalization Engine
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Your Goals. Your Skills. <br />
                <span className="text-blue-600 dark:text-blue-400">Your Learning Path.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-[#CBD5E1] max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                PathAI creates a personalized, prerequisite-aware learning roadmap for computer-centric tech careers. Always know <strong className="text-slate-900 dark:text-white font-bold">what to learn next, and why.</strong>
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/onboarding" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="primary"
                    className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all font-bold cursor-pointer"
                    leftIcon={<Sparkles className="h-5 w-5" />}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Build My Learning Path
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto font-bold dark:border-[#273449] dark:text-[#CBD5E1] cursor-pointer">
                    Instant Demo Login →
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400 font-bold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>100% Free Verified Resources</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Prerequisite-Aware Logic</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Buddy AI Assistant Included</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Platform Outline Preview */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033] p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-[#273449]/60">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-500" />
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-400 dark:text-slate-500">PathAI System Overview</span>
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                  PathAI Architecture
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/20 text-xs">
                    <div className="font-bold text-blue-900 dark:text-blue-300 flex items-center justify-between">
                      <span>1. Goal Parsing Engine</span>
                      <Badge variant="primary" className="bg-blue-600 text-white text-[10px] font-bold">Natural Language</Badge>
                    </div>
                    <p className="text-blue-700 dark:text-blue-400 text-[11px] mt-1">Extracts role requirements, timeline, and weekly hour budgets.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-xs">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>2. Skill Gap & Prerequisite Graph</span>
                      <Badge variant="outline" className="border-slate-300 dark:border-[#273449] text-slate-600 dark:text-[#CBD5E1] text-[10px] font-bold">Deterministic</Badge>
                    </div>
                    <p className="text-slate-600 dark:text-[#CBD5E1] text-[11px] mt-1">Calculates exact % proficiency gaps against industry role benchmarks.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-xs">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>3. Adaptive Re-planning</span>
                      <Badge variant="outline" className="border-slate-300 dark:border-[#273449] text-slate-600 dark:text-[#CBD5E1] text-[10px] font-bold">Dynamic</Badge>
                    </div>
                    <p className="text-slate-600 dark:text-[#CBD5E1] text-[11px] mt-1">Low quiz score? Automatically inserts prerequisite review topics.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-500/20 text-xs">
                    <div className="font-bold text-orange-900 dark:text-orange-300 flex items-center justify-between">
                      <span>4. Buddy AI Learning Assistant</span>
                      <Badge variant="secondary" className="bg-orange-500 text-white text-[10px] font-bold">Rule-Based First</Badge>
                    </div>
                    <p className="text-orange-800 dark:text-orange-400 text-[11px] mt-1">Concise, direct 1–4 sentence factual assistance with zero fluff.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEET BUDDY AI ASSISTANT SECTION */}
      <section id="buddy-preview" className="py-20 bg-slate-900 dark:bg-[#111827]/80 text-white relative overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/40 font-bold">
              Introducing Buddy
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Meet Buddy — PathAI&apos;s Task-Focused AI Assistant
            </h2>
            <p className="text-slate-300 text-base leading-relaxed font-sans">
              Buddy is not a generic conversational chatbot. Buddy is designed for maximum learning velocity: direct, factual, task-focused, and concise (1–4 sentences), with zero fluff or motivational speeches.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Interactive Buddy Simulator */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden shadow-2xl">
                {/* Simulator Header */}
                <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <BuddyAvatar mood={sampleBuddyQueries[activeBuddyQuery].mood} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white">Buddy</span>
                        <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px] py-0 px-1.5 font-bold">
                          PathAI Assistant
                        </Badge>
                      </div>
                      <span className="text-[11px] text-slate-400 font-sans">Concise Task-Focused Assistant</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono font-bold">AI: 18 / 20 remaining</span>
                </div>

                {/* Simulator Query Buttons */}
                <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex gap-2 overflow-x-auto">
                  {sampleBuddyQueries.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveBuddyQuery(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                        activeBuddyQuery === idx
                          ? "bg-orange-500 text-white shadow-xs"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      Prompt {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Simulator Chat Screen */}
                <div className="p-6 space-y-4 bg-slate-900/90">
                  {/* User Bubble */}
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white p-3.5 rounded-xl text-xs max-w-md font-bold">
                      &quot;{sampleBuddyQueries[activeBuddyQuery].user}&quot;
                    </div>
                  </div>

                  {/* Buddy Bubble */}
                  <div className="flex gap-3 items-start">
                    <BuddyAvatar mood={sampleBuddyQueries[activeBuddyQuery].mood} size="sm" showBadge={false} />
                    <div className="bg-slate-800 border border-slate-700 text-slate-100 p-4 rounded-xl text-xs leading-relaxed max-w-lg space-y-2">
                      <p className="font-medium">{sampleBuddyQueries[activeBuddyQuery].buddy}</p>
                      <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-orange-400">
                          {sampleBuddyQueries[activeBuddyQuery].tag}
                        </span>
                        <span>Mood: {sampleBuddyQueries[activeBuddyQuery].mood}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Buddy Principles */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Rule-Based Engine First</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Career requirements, prerequisites, scores, and roadmap actions are computed directly from PathAI engines with 100% accuracy.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Zap className="h-4 w-4" />
                  <span>Concise 1–4 Sentence Answers</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Buddy gives the minimum useful explanation. Zero stories, zero jokes, zero fluff.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                  <Code className="h-4 w-4" />
                  <span>Code Debugging: Problem → Cause → Fix</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Technical code errors are diagnosed instantly without lengthy tutorials unless requested.
                </p>
              </div>

              <div className="pt-2">
                <Link href="/login">
                  <Button variant="primary" size="lg" className="w-full bg-orange-500 hover:bg-orange-600 font-bold text-xs h-11 cursor-pointer">
                    Try Buddy AI Assistant Now →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-slate-50/60 dark:bg-[#111827]/40 border-b border-slate-100 dark:border-[#273449]/70 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <Badge variant="primary" className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30 font-bold">
              Methodology
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How PathAI Personalizes Your Journey
            </h2>
            <p className="text-slate-600 dark:text-[#CBD5E1] text-base leading-relaxed">
              Four structured steps to convert your career ambition into daily measurable actions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <Card key={step.number} className="p-6 relative bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-blue-600/30 dark:text-blue-400/20">{step.number}</span>
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-[#CBD5E1]/80 leading-relaxed font-sans">{step.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMPUTER-CENTRIC CAREER CATALOG SECTION */}
      <section id="careers" className="py-20 bg-white dark:bg-[#0B1220] border-b border-slate-100 dark:border-[#273449]/70 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <Badge variant="primary" className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30 font-bold">
              Focused Career Catalog
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              193+ Computer-Centric Tech & Computing Topics
            </h2>
            <p className="text-slate-600 dark:text-[#CBD5E1] text-base leading-relaxed">
              PathAI&apos;s catalog focuses strictly on technology, software engineering, AI, cybersecurity, and cloud careers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {computerCareers.map((c, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-slate-200 dark:border-[#273449] bg-slate-50/50 dark:bg-[#111827] hover:bg-white dark:hover:bg-[#172033] hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{c.title}</h3>
                  <Badge variant="outline" className="text-[10px] font-bold border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40">
                    {c.count}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-relaxed mt-1 font-sans">
                  <strong className="text-slate-800 dark:text-white font-bold">Key Topics:</strong> {c.skills}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES GRID SECTION */}
      <section id="features" className="py-20 bg-slate-50/60 dark:bg-[#111827]/40 border-b border-slate-100 dark:border-[#273449]/70 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <Badge variant="primary" className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30 font-bold">
              Core Capabilities
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Everything You Need To Master Any Tech Career
            </h2>
            <p className="text-slate-600 dark:text-[#CBD5E1] text-base leading-relaxed">
              Built for serious self-directed learners who want structure without expensive subscriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="p-6 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033] hover:border-blue-200 dark:hover:border-blue-500 hover:shadow-md transition-all group">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-[#CBD5E1]/80 leading-relaxed font-sans">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 bg-white dark:bg-[#0B1220] transition-colors">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ready to Build Your Computer-Centric Career Roadmap?
          </h2>
          <p className="text-slate-600 dark:text-[#CBD5E1] text-base max-w-2xl mx-auto leading-relaxed">
            Join self-directed learners using PathAI to master Machine Learning, Data Engineering, and modern software careers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/onboarding">
              <Button
                size="lg"
                variant="primary"
                className="px-8 shadow-lg hover:shadow-xl w-full sm:w-auto font-bold cursor-pointer"
                leftIcon={<Sparkles className="h-5 w-5" />}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Build My Free Learning Path
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8 w-full sm:w-auto font-bold dark:border-[#273449] dark:text-[#CBD5E1] cursor-pointer">
                Log In to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import {
  BookOpen,
  Search,
  ExternalLink,
  Sparkles,
  Clock,
  CheckCircle2,
  Play,
  FileText,
  Code,
  CheckSquare,
} from "lucide-react";
import { generateResourceRecommendationReason } from "@/lib/recommendation-engine";

interface ResourceRecord {
  id: string;
  title: string;
  provider: string;
  url: string;
  type: "COURSE" | "VIDEO" | "ARTICLE" | "DOCUMENTATION" | "PRACTICE" | "PROJECT" | "ASSESSMENT";
  skillName: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  durationMinutes: number;
  isFree: boolean;
  description: string;
}

const DEMO_RESOURCES: ResourceRecord[] = [
  {
    id: "res-1",
    title: "StatQuest: Logistic Regression & Odds Ratios Clearly Explained",
    provider: "StatQuest with Josh Starmer (YouTube)",
    url: "https://www.youtube.com/watch?v=yIYKR4sgzI8",
    type: "VIDEO",
    skillName: "Statistics",
    difficulty: "Beginner",
    durationMinutes: 20,
    isFree: true,
    description: "Visual step-by-step breakdown of how logistic regression computes probabilities and fits sigmoid decision curves.",
  },
  {
    id: "res-2",
    title: "Google Developers Machine Learning Crash Course",
    provider: "Google Developers",
    url: "https://developers.google.com/machine-learning/crash-course",
    type: "COURSE",
    skillName: "Machine Learning",
    difficulty: "Intermediate",
    durationMinutes: 180,
    isFree: true,
    description: "Google's fast-paced practical introduction to ML concepts, scikit-learn algorithms, loss functions, and gradient descent.",
  },
  {
    id: "res-3",
    title: "Scikit-Learn Official User Guide: Model Evaluation & Metrics",
    provider: "Scikit-Learn Docs",
    url: "https://scikit-learn.org/stable/modules/model_evaluation.html",
    type: "DOCUMENTATION",
    skillName: "Machine Learning",
    difficulty: "Intermediate",
    durationMinutes: 45,
    isFree: true,
    description: "Comprehensive documentation covering precision, recall, F1-score, ROC-AUC curves, and cross-validation strategies.",
  },
  {
    id: "res-4",
    title: "Kaggle Learn: Intermediate Machine Learning Micro-Course",
    provider: "Kaggle",
    url: "https://www.kaggle.com/learn/intermediate-machine-learning",
    type: "PRACTICE",
    skillName: "Machine Learning",
    difficulty: "Intermediate",
    durationMinutes: 120,
    isFree: true,
    description: "Interactive Jupyter notebook tutorials covering missing values, categorical encoding, XGBoost pipelines, and leakage.",
  },
  {
    id: "res-5",
    title: "PyTorch Official Tutorial: Deep Learning with PyTorch 60min Blitz",
    provider: "PyTorch.org",
    url: "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html",
    type: "DOCUMENTATION",
    skillName: "Deep Learning",
    difficulty: "Intermediate",
    durationMinutes: 60,
    isFree: true,
    description: "Official hands-on walkthrough of PyTorch Tensors, Autograd automatic differentiation, and Neural Network modules.",
  },
  {
    id: "res-6",
    title: "MIT 18.06 Linear Algebra Lecture Series",
    provider: "MIT OpenCourseWare",
    url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/",
    type: "COURSE",
    skillName: "Mathematics",
    difficulty: "Intermediate",
    durationMinutes: 240,
    isFree: true,
    description: "World-class lecture series by Prof. Gilbert Strang covering matrix operations, eigenvectors, and SVD decomposition.",
  },
  {
    id: "res-7",
    title: "SQL Zoo Interactive Queries & Window Functions",
    provider: "SQLZoo.net",
    url: "https://sqlzoo.net/",
    type: "PRACTICE",
    skillName: "SQL",
    difficulty: "Beginner",
    durationMinutes: 90,
    isFree: true,
    description: "Interactive browser SQL prompt for testing SELECT, JOIN, GROUP BY, and OVER() partition window functions.",
  },
];

export default function ResourcesPage() {
  const { userSkills, markResourceCompleted, completedResources } = useApp();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = DEMO_RESOURCES.filter((res) => {
    const matchesTab =
      activeTab === "all" || res.type.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary" className="bg-blue-50 text-blue-700 border-blue-200">
                Curated Free Resource Library
              </Badge>
              <span className="text-xs text-slate-500 font-medium">100% Verified External Links</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Recommended Learning Resources
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              PathAI selects top-rated free courses, tutorials, and documentation matching your active skill gaps.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72">
            <Input
              type="text"
              placeholder="Search resources or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: "all", label: "All Resources", count: DEMO_RESOURCES.length },
            { id: "course", label: "Free Courses", icon: <BookOpen className="h-4 w-4" /> },
            { id: "video", label: "Videos & Lectures", icon: <Play className="h-4 w-4" /> },
            { id: "documentation", label: "Documentation", icon: <FileText className="h-4 w-4" /> },
            { id: "practice", label: "Interactive Practice", icon: <Code className="h-4 w-4" /> },
          ]}
        />

        {/* Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((res) => {
            const currentSkillScore = userSkills[res.skillName] ?? 50;
            const recommendationReason = generateResourceRecommendationReason(
              res.title,
              res.skillName,
              currentSkillScore,
              "Machine Learning Fundamentals"
            );

            const isDone = completedResources.includes(res.id);

            return (
              <Card key={res.id} className="shadow-sm border-slate-200 bg-white hover:border-blue-300 transition-all flex flex-col justify-between p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" size="sm">
                        {res.type}
                      </Badge>
                      <Badge variant="outline" size="sm">
                        {res.skillName}
                      </Badge>
                    </div>

                    {res.isFree && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        FREE
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{res.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>

                  {/* WHY RECOMMENDED BOX */}
                  <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-xs text-slate-700 leading-relaxed space-y-1">
                    <div className="font-bold text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      Why recommended for you:
                    </div>
                    <p className="text-[11px] text-slate-600">{recommendationReason}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-700">{res.provider}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {res.durationMinutes} mins
                    </span>
                  </div>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => markResourceCompleted(res.id)}
                  >
                    <Button size="sm" variant={isDone ? "secondary" : "primary"} className="text-xs gap-1.5">
                      <span>{isDone ? "Completed ✓" : "Open Resource"}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

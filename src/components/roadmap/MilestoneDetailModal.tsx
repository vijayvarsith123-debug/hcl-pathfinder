"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Alert } from "@/components/ui/alert";
import { RoadmapMilestone } from "@/lib/roadmap-generator";
import {
  CheckCircle2,
  Clock,
  BookOpen,
  FolderGit2,
  CheckSquare,
  Lock,
  ArrowRight,
  AlertTriangle,
  Play,
  X,
  Sparkles,
} from "lucide-react";

interface MilestoneDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: RoadmapMilestone | null;
  onTopicToggle?: (topicId: string) => void;
}

export const MilestoneDetailModal: React.FC<MilestoneDetailModalProps> = ({
  isOpen,
  onClose,
  milestone,
  onTopicToggle,
}) => {
  const [mounted, setMounted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const timer = setTimeout(() => setShowContent(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted || !milestone) return null;

  const isCompleted = milestone.status === "completed";
  const isInProgress = milestone.status === "in_progress";
  const isAvailable = milestone.status === "available";
  const isLocked = milestone.status === "locked";

  const getPrimaryButtonText = () => {
    if (isCompleted) return "Review Module Resources";
    if (isInProgress) return "Continue Learning";
    if (isAvailable) return "Start Learning";
    return "Locked — Complete Prerequisites First";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Overlay backdrop with fade animation */}
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ease-in-out ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-full sm:w-[460px] md:w-[480px] bg-white dark:bg-[#172033] shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out border-l border-slate-200 dark:border-[#273449] ${
          showContent ? "translate-x-0" : "translate-x-full"
        } max-sm:h-[85vh] max-sm:bottom-0 max-sm:top-auto max-sm:rounded-t-2xl max-sm:border-t max-sm:border-l-0 ${
          !showContent && "max-sm:translate-y-full max-sm:translate-x-0"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 dark:border-[#273449] flex items-center justify-between shrink-0 bg-slate-50 dark:bg-[#111827] max-sm:rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-slate-900 dark:bg-blue-950 text-white dark:text-blue-300 text-xs font-mono font-bold">
              STEP {milestone.stepNumber.toString().padStart(2, "0")}
            </span>
            <Badge variant="outline" className="border-slate-300 dark:border-[#273449] text-slate-700 dark:text-[#CBD5E1] text-xs font-semibold">
              {milestone.category}
            </Badge>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-[#273449] text-slate-500 dark:text-[#CBD5E1] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
          {/* Title & Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {milestone.title}
              </h2>
              <Badge
                variant={
                  isCompleted
                    ? "success"
                    : isInProgress
                    ? "primary"
                    : isAvailable
                    ? "outline"
                    : "secondary"
                }
                className="text-xs px-2.5 py-1 font-bold"
              >
                {isCompleted ? "Completed ✓" : isInProgress ? "In Progress" : isAvailable ? "Available to Start" : "Locked 🔒"}
              </Badge>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
              {milestone.description}
            </p>
          </div>

          {/* Skill Gap Warning (If applicable) */}
          {milestone.isWeakArea && (
            <Alert variant="warning" title="Skill Gap Target Milestone" className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-500/20">
              <div className="flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  Your diagnostic assessment identified proficiency gaps in <strong>{milestone.skills.join(", ")}</strong>. PathAI has added extra practice topics and targeted assessments to ensure mastery before advancing.
                </div>
              </div>
            </Alert>
          )}

          {/* Stats & Progress Bar */}
          <div className="p-4 bg-slate-50 dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-[#273449] space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-[#CBD5E1]">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500 dark:text-[#CBD5E1]" />
                <span>Estimated Time: <strong>{milestone.estimatedHours} Hours</strong></span>
              </div>
              <span>Milestone Completion: <strong>{milestone.progressPercentage}%</strong></span>
            </div>
            <ProgressBar value={milestone.progressPercentage} size="md" showPercentage />
          </div>

          {/* Required Target Skills */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Required Target Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {milestone.skills.map((skill) => (
                <Badge key={skill} variant="primary" className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30 text-xs py-1 px-2.5 font-bold">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          {milestone.prerequisites && milestone.prerequisites.length > 0 && (
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Prerequisites</h4>
              <div className="space-y-1.5">
                {milestone.prerequisites.map((prereq, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-[#CBD5E1]">
                    {isLocked ? (
                      <Lock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    )}
                    <span className={isLocked ? "text-slate-500" : ""}>
                      {prereq} {isLocked ? "(Incomplete)" : "(Completed)"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Topics Checklist */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Module Topics ({milestone.topics.filter((t) => t.status === "completed").length}/{milestone.topics.length} Done)
            </h4>
            <div className="space-y-2">
              {milestone.topics.map((t) => {
                const isTopicDone = t.status === "completed";
                const isTopicActive = t.status === "in_progress";

                return (
                  <div
                    key={t.id}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                      isTopicDone
                        ? "bg-slate-50 dark:bg-[#111827]/40 border-slate-200 dark:border-[#273449] text-slate-700 dark:text-[#CBD5E1]"
                        : isTopicActive
                        ? "bg-blue-50/80 dark:bg-blue-950/30 border-blue-200 dark:border-blue-500/30 text-blue-900 dark:text-blue-300 font-semibold shadow-2xs"
                        : "bg-white dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-500 dark:text-[#CBD5E1]/60 hover:border-slate-300 dark:hover:border-slate-600"
                    } ${onTopicToggle ? "cursor-pointer" : ""}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isTopicDone
                            ? "bg-emerald-600 dark:bg-emerald-500 text-white"
                            : isTopicActive
                            ? "bg-blue-600 dark:bg-blue-500 text-white"
                            : "border border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        {isTopicDone ? "✓" : isTopicActive ? "→" : "○"}
                      </div>
                      <span>{t.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase">
                      {isTopicDone ? "Mastered" : isTopicActive ? "Active" : "Pending"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Capstone Project Card */}
          {milestone.project && (
            <div className="p-4 rounded-xl bg-slate-900 dark:bg-[#111827] text-white border border-slate-800 dark:border-[#273449] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xs text-blue-400 dark:text-blue-300">
                  <FolderGit2 className="h-4 w-4" />
                  <span>Capstone Project</span>
                </div>
                <Badge variant="outline" className="border-slate-700 text-slate-300 text-[10px]">
                  Hands-on Portfolio
                </Badge>
              </div>
              <h5 className="font-extrabold text-sm text-slate-100">{milestone.project.title}</h5>
              <p className="text-xs text-slate-300 leading-relaxed">{milestone.project.description}</p>
              <div className="pt-1">
                <Link href={milestone.project.url} onClick={onClose}>
                  <Button variant="outline" size="sm" className="text-xs font-bold border-slate-700 hover:bg-slate-800 text-slate-200 hover:text-white h-8 cursor-pointer">
                    Open Project Spec & Requirements →
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Assessment Challenge Card */}
          {milestone.assessment && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111827]/40 border border-slate-200 dark:border-[#273449] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Assessment Challenge</span>
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-[#CBD5E1]">
                  Min Pass: <strong>{milestone.assessment.minPassingScore}%</strong>
                </span>
              </div>
              <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">{milestone.assessment.title}</h5>
              {milestone.assessment.currentScore !== undefined && (
                <div className="text-xs text-slate-600 dark:text-[#CBD5E1]">
                  Your Highest Score: <strong className="text-emerald-700 dark:text-emerald-400">{milestone.assessment.currentScore}%</strong>
                </div>
              )}
              <div className="pt-1">
                <Link href={milestone.assessment.url} onClick={onClose}>
                  <Button variant="outline" size="sm" className="text-xs font-bold border-slate-300 dark:border-[#273449] text-slate-800 dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-[#273449] h-8 cursor-pointer">
                    Take Assessment Challenge →
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Curated Resources */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Curated Free Resources</h4>
            <div className="space-y-2">
              {milestone.resources.map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033] hover:border-blue-300 dark:hover:border-blue-500 text-xs flex items-center justify-between text-slate-800 dark:text-[#CBD5E1] font-medium transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 group-hover:text-blue-700" />
                    <span>{res.title}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-slate-50 dark:bg-[#111827] border-slate-200 dark:border-[#273449]">
                    {res.type} ↗
                  </Badge>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer / Actions Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-[#273449] bg-slate-50 dark:bg-[#111827] flex items-center justify-between gap-3 shrink-0 animate-fade-in">
          <div className="flex items-center gap-2">
            <Link href="/resources" onClick={onClose}>
              <Button variant="outline" size="sm" className="text-xs font-semibold dark:border-[#273449] dark:text-[#CBD5E1] cursor-pointer">
                Resources
              </Button>
            </Link>
            <Link href="/weekly-plan" onClick={onClose}>
              <Button variant="outline" size="sm" className="text-xs font-semibold dark:border-[#273449] dark:text-[#CBD5E1] cursor-pointer">
                Practice
              </Button>
            </Link>
          </div>

          <Link href={isLocked ? "#" : "/weekly-plan"} onClick={onClose}>
            <Button
              variant="primary"
              size="sm"
              disabled={isLocked}
              className="text-xs font-bold px-4 h-9 shadow-sm cursor-pointer"
              leftIcon={isInProgress || isAvailable ? <Play className="h-3.5 w-3.5" /> : undefined}
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              {getPrimaryButtonText()}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

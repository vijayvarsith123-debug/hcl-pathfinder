"use client";

import React from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
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
  Layers,
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
  if (!milestone) return null;

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
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="space-y-5 text-slate-900 font-sans -mt-2">
        {/* HEADER SECTION */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-slate-900 text-white text-xs font-mono font-bold">
                STEP {milestone.stepNumber.toString().padStart(2, "0")}
              </span>
              <Badge variant="outline" className="border-slate-300 text-slate-700 text-xs font-semibold">
                {milestone.category}
              </Badge>
            </div>

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

          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{milestone.title}</h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{milestone.description}</p>
        </div>

        {/* SKILL GAP WARNING (If applicable) */}
        {milestone.isWeakArea && (
          <Alert variant="warning" title="Skill Gap Target Milestone">
            <div className="flex items-start gap-2 text-xs">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                Your diagnostic assessment identified proficiency gaps in <strong>{milestone.skills.join(", ")}</strong>. PathAI has added extra practice topics and targeted assessments to ensure mastery before advancing.
              </div>
            </div>
          </Alert>
        )}

        {/* STATS & PROGRESS BAR */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <span>Estimated Time: <strong>{milestone.estimatedHours} Hours</strong></span>
            </div>
            <span>Milestone Completion: <strong>{milestone.progressPercentage}%</strong></span>
          </div>

          <ProgressBar value={milestone.progressPercentage} size="md" showPercentage />
        </div>

        {/* REQUIRED SKILLS */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Required Target Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {milestone.skills.map((skill) => (
              <Badge key={skill} variant="primary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs py-1 px-2.5">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* TOPICS CHECKLIST */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
            Module Topics ({milestone.topics.filter((t) => t.status === "completed").length}/{milestone.topics.length} Done)
          </h4>
          <div className="space-y-1.5">
            {milestone.topics.map((t) => {
              const isTopicDone = t.status === "completed";
              const isTopicActive = t.status === "in_progress";

              return (
                <div
                  key={t.id}
                  onClick={() => onTopicToggle && onTopicToggle(t.id)}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                    isTopicDone
                      ? "bg-slate-50 border-slate-200 text-slate-700"
                      : isTopicActive
                      ? "bg-blue-50/80 border-blue-200 text-blue-900 font-semibold shadow-2xs"
                      : "bg-white border-slate-200/80 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isTopicDone
                          ? "bg-emerald-600 text-white"
                          : isTopicActive
                          ? "bg-blue-600 text-white"
                          : "border border-slate-300 text-slate-400"
                      }`}
                    >
                      {isTopicDone ? "✓" : isTopicActive ? "→" : "○"}
                    </div>
                    <span>{t.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {isTopicDone ? "Mastered" : isTopicActive ? "Active" : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CAPSTONE PROJECT CARD */}
        {milestone.project && (
          <div className="p-3.5 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-blue-400">
                <FolderGit2 className="h-4 w-4" />
                <span>Capstone Project: {milestone.project.title}</span>
              </div>
              <Badge variant="outline" className="border-slate-700 text-slate-300 text-[10px]">
                Hands-on Portfolio
              </Badge>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{milestone.project.description}</p>
            <div className="pt-1">
              <Link href={milestone.project.url} onClick={onClose}>
                <Button variant="outline" size="sm" className="text-xs font-bold border-slate-700 text-slate-200 hover:bg-slate-800 h-8">
                  View Project Spec & Requirements →
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* ASSESSMENT CHALLENGE CARD */}
        {milestone.assessment && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <CheckSquare className="h-4 w-4 text-emerald-600" />
                <span>Assessment: {milestone.assessment.title}</span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Min Pass: <strong>{milestone.assessment.minPassingScore}%</strong>
              </span>
            </div>
            {milestone.assessment.currentScore !== undefined && (
              <div className="text-xs text-slate-600">
                Your Highest Score: <strong className="text-emerald-700">{milestone.assessment.currentScore}%</strong>
              </div>
            )}
            <div className="pt-1">
              <Link href={milestone.assessment.url} onClick={onClose}>
                <Button variant="outline" size="sm" className="text-xs font-bold border-slate-300 text-slate-800 hover:bg-slate-100 h-8">
                  Take Assessment Challenge →
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* CURATED RESOURCES */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Curated Free Resources</h4>
          <div className="space-y-1.5">
            {milestone.resources.map((res, idx) => (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-blue-300 text-xs flex items-center justify-between text-slate-800 font-medium transition-all group"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-blue-600 group-hover:text-blue-700" />
                  <span>{res.title}</span>
                </div>
                <Badge variant="outline" className="text-[10px] bg-slate-50">
                  {res.type} ↗
                </Badge>
              </a>
            ))}
          </div>
        </div>

        {/* ACTION BUTTONS BAR */}
        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link href="/resources" onClick={onClose}>
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                Browse Resources
              </Button>
            </Link>
            <Link href="/weekly-plan" onClick={onClose}>
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                Practice
              </Button>
            </Link>
          </div>

          <Link href={isLocked ? "#" : "/weekly-plan"} onClick={onClose}>
            <Button
              variant="primary"
              size="sm"
              disabled={isLocked}
              className="text-xs font-bold px-4 h-9 shadow-sm"
              leftIcon={isInProgress || isAvailable ? <Play className="h-3.5 w-3.5" /> : undefined}
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              {getPrimaryButtonText()}
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
};

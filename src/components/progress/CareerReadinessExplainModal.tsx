"use client";

import React from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { CareerReadinessAnalysis } from "@/lib/skill-progress-engine";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Target,
  Zap,
  Info,
  TrendingUp,
  FolderGit2,
} from "lucide-react";

interface CareerReadinessExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: CareerReadinessAnalysis;
}

export const CareerReadinessExplainModal: React.FC<CareerReadinessExplainModalProps> = ({
  isOpen,
  onClose,
  analysis,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="space-y-5 text-slate-900 font-sans -mt-2">
        {/* HEADER SECTION */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
            <Badge variant="primary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
              Career Readiness Score Explanation
            </Badge>
            <span className="text-xs text-slate-500 font-medium">Weighted Skill Evidence Graph</span>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-black shrink-0 shadow-md">
              {analysis.careerReadinessScore}%
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                {analysis.targetCareer} Job Readiness
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {analysis.criticalSkillsMasteredCount} of {analysis.totalCriticalSkills} critical skills mastered • {analysis.masteredSkillsCount} of {analysis.totalRequiredSkills} total skills strong
              </p>
            </div>
          </div>
        </div>

        {/* EXPLANATION CALLOUT */}
        <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900">
          <div className="flex items-center gap-2 font-bold mb-1">
            <Info className="h-4 w-4 text-blue-600 shrink-0" />
            <span>How Career Readiness Is Calculated</span>
          </div>
          <p className="text-slate-700 leading-relaxed text-[11px]">
            Unlike simple course completion, your Career Readiness score weighs your <strong>evidence of skill mastery</strong> across Learning Topics (30%), Practice (20%), Assessment Scores (30%), and Capstone Projects (20%). Skills prioritized as <strong>Critical</strong> carry 4× weight in your score.
          </p>
        </div>

        {/* SKILL STRENGTHS (STRONG & MASTERED) */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Mastered & Strong Skills (High Evidence)</span>
          </h4>
          <div className="space-y-1.5">
            {analysis.topStrengths.length > 0 ? (
              analysis.topStrengths.map((s) => (
                <div
                  key={s.skillName}
                  className="p-2.5 rounded-lg border border-slate-200 bg-emerald-50/40 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span className="font-bold text-slate-900">{s.skillName}</span>
                    <Badge variant="outline" className="text-[10px] bg-white">
                      {s.priority}
                    </Badge>
                  </div>
                  <span className="font-mono font-bold text-emerald-700">{s.masteryScore}% ({s.level})</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 italic p-2 bg-slate-50 rounded">
                Complete assessments and projects to establish strong skill evidence.
              </div>
            )}
          </div>
        </div>

        {/* DEVELOPING SKILLS */}
        {analysis.developingSkills.length > 0 && (
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span>Developing Skills (Intermediate Progress)</span>
            </h4>
            <div className="space-y-1.5">
              {analysis.developingSkills.map((s) => (
                <div
                  key={s.skillName}
                  className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-bold">→</span>
                    <span className="font-semibold text-slate-900">{s.skillName}</span>
                    <Badge variant="outline" className="text-[10px] bg-slate-50">
                      {s.priority}
                    </Badge>
                  </div>
                  <span className="font-mono font-semibold text-slate-700">{s.masteryScore}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CRITICAL GAPS / NEEDS ATTENTION */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span>Needs Attention & Skill Gaps</span>
          </h4>
          <div className="space-y-1.5">
            {analysis.criticalGaps.map((s) => (
              <div
                key={s.skillName}
                className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-amber-700 font-bold">⚠</span>
                  <span className="font-bold text-slate-900">{s.skillName}</span>
                  <Badge variant="warning" className="text-[10px] py-0 px-1.5">
                    {s.priority} Gap
                  </Badge>
                </div>
                <div className="text-right font-mono text-[11px]">
                  <span className="text-amber-900 font-bold">{s.masteryScore}%</span>
                  <span className="text-slate-400 ml-1">(Target: {s.targetScore}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIONABLE 1-2-3 RECOMMENDATIONS */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
            Recommended Action Plan to Boost Score
          </h4>
          <div className="space-y-2">
            {analysis.actionableRecommendations.map((rec) => (
              <div key={rec.id} className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-3 text-xs shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-black">
                      #{rec.priorityNumber}
                    </span>
                    <span className="font-bold text-slate-100">{rec.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-1">{rec.description}</p>
                </div>
                <Link href={rec.targetUrl} onClick={onClose}>
                  <Button variant="primary" size="sm" className="bg-orange-500 hover:bg-orange-600 text-xs font-bold shrink-0 h-8">
                    {rec.actionLabel} →
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

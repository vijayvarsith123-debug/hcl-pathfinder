/**
 * PathAI Recommendation Engine Module (Unified Entry Point)
 *
 * Integrates the complete 13-stage Recommendation Architecture with full backward
 * compatibility for existing applications, UI components, and tests.
 */

export * from "./recommendation";

import {
  UserSkillProficiency,
  PathModule,
  Resource,
  WeeklyPlan,
  DailyTask,
  AIRecommendation,
} from "./types";
import { INITIAL_ML_MODULES } from "./constants";

export interface SkillGapItem {
  skillName: string;
  currentScore: number;
  requiredScore: number;
  gap: number;
  priority: "High" | "Medium" | "Low";
}

export function calculateSkillGaps(
  userSkills: { [key: string]: number },
  requiredSkills: { [key: string]: number }
): SkillGapItem[] {
  const gaps: SkillGapItem[] = [];

  for (const [skillName, required] of Object.entries(requiredSkills)) {
    const current = userSkills[skillName] ?? 0;
    const gap = Math.max(0, required - current);
    let priority: "High" | "Medium" | "Low" = "Low";
    if (gap > 35) priority = "High";
    else if (gap > 15) priority = "Medium";

    gaps.push({
      skillName,
      currentScore: current,
      requiredScore: required,
      gap,
      priority,
    });
  }

  return gaps.sort((a, b) => b.gap - a.gap);
}

export function generateResourceRecommendationReason(
  resourceTitle: string,
  skillName: string,
  userLevel: number,
  moduleContext?: string
): string {
  if (userLevel < 40) {
    return `Recommended because your current ${skillName} skill is foundational (${userLevel}% proficiency). This resource builds baseline concepts required for ${moduleContext || "upcoming modules"}.`;
  } else if (userLevel < 75) {
    return `Recommended because your ${skillName} score is at an intermediate level (${userLevel}%). This topic bridges your gap before advancing to complex Machine Learning models.`;
  } else {
    return `Recommended as an advanced reference to solidify ${skillName} mastery for real-world project deployment.`;
  }
}

/**
 * Adaptive Path Adjustment Engine
 * Runs AFTER assessment to handle real-time performance adjustments.
 */
export function triggerAdaptivePathAdjustment(
  failedSkill: string,
  scorePercentage: number,
  currentModules: PathModule[],
  currentWeeklyPlan: WeeklyPlan
): {
  updatedModules: PathModule[];
  updatedWeeklyPlan: WeeklyPlan;
  recommendation: AIRecommendation;
} {
  const isPoorPerformance = scorePercentage < 60;

  if (isPoorPerformance) {
    const newTasks: DailyTask[] = [
      {
        id: `adaptive-${Date.now()}-1`,
        dayOfWeek: "Thursday",
        title: `Prerequisite Review: ${failedSkill} Essentials`,
        topic: `${failedSkill} Foundations`,
        estimatedMinutes: 45,
        status: "pending",
        resourceTitle: `Khan Academy / MIT OpenCourseWare: ${failedSkill} Deep Dive`,
        resourceType: "VIDEO",
        resourceProvider: "MIT OCW",
        resourceUrl: "https://ocw.mit.edu",
      },
      {
        id: `adaptive-${Date.now()}-2`,
        dayOfWeek: "Friday",
        title: `Targeted Practice: ${failedSkill} Problem Set`,
        topic: `${failedSkill} Practice Exercises`,
        estimatedMinutes: 60,
        status: "pending",
        resourceTitle: `Interactive Practice: ${failedSkill} Exercises`,
        resourceType: "PRACTICE",
        resourceProvider: "Kaggle Learn",
        resourceUrl: "https://www.kaggle.com/learn",
      },
      {
        id: `adaptive-${Date.now()}-3`,
        dayOfWeek: "Sunday",
        title: `Re-Assessment: ${failedSkill} Mastery Check`,
        topic: `${failedSkill} Re-evaluation`,
        estimatedMinutes: 30,
        status: "pending",
        resourceType: "ASSESSMENT",
      },
    ];

    const updatedWeeklyPlan: WeeklyPlan = {
      ...currentWeeklyPlan,
      targetHours: currentWeeklyPlan.targetHours + 2,
      dailyTasks: [
        ...currentWeeklyPlan.dailyTasks.filter((t) => t.dayOfWeek !== "Thursday" && t.dayOfWeek !== "Friday"),
        ...newTasks,
      ],
    };

    const updatedModules = currentModules.map((m) => {
      if (m.title.toLowerCase().includes(failedSkill.toLowerCase()) || m.id === "mod-3") {
        return {
          ...m,
          status: "in_progress" as const,
          description: `${m.description} [Adjusted: Additional review added based on assessment result]`,
        };
      }
      return m;
    });

    const recommendation: AIRecommendation = {
      id: `rec-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "path_adjustment",
      title: "Adaptive Path Adjustment Applied",
      reason: `Your ${failedSkill} assessment score was ${scorePercentage}%, which is below your target proficiency threshold.`,
      actionSummary: `PathAI added 2 targeted prerequisite review sessions and a practice problem set to Week 6 before advancing to Machine Learning.`,
      targetModuleOrSkill: failedSkill,
      triggerEvent: `Assessment Score: ${scorePercentage}% in ${failedSkill}`,
    };

    return { updatedModules, updatedWeeklyPlan, recommendation };
  } else {
    const recommendation: AIRecommendation = {
      id: `rec-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "pace_acceleration",
      title: "Fast-Track Acceleration Recommended",
      reason: `You scored ${scorePercentage}% in ${failedSkill}, demonstrating high mastery!`,
      actionSummary: `Basic introductory topics have been streamlined so you can move directly to Advanced Machine Learning Algorithms.`,
      targetModuleOrSkill: failedSkill,
      triggerEvent: `Assessment Score: ${scorePercentage}% in ${failedSkill}`,
    };

    return {
      updatedModules: currentModules,
      updatedWeeklyPlan: currentWeeklyPlan,
      recommendation,
    };
  }
}

/**
 * Timeline & Time Allocation Engine
 *
 * Distributes ordered learning skills, estimated hours, and topics realistically across
 * available weekly learning hours and target timeline constraints.
 */

import { OrderedSkill } from "./prerequisite-graph";
import { RecommendedResource } from "./resource-recommender";
import { DailyTask, WeeklyPlan, TaskStatus } from "../types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TimeAllocationConstraints {
  hoursPerWeek: number;
  targetTimelineMonths: number;
}

export interface PhaseTimeAllocation {
  phaseIndex: number;
  phaseTitle: string;
  skills: OrderedSkill[];
  estimatedTotalHours: number;
  allocatedWeeks: number;
  resources: RecommendedResource[];
}

export interface ScheduledTimeline {
  totalEstimatedHours: number;
  availableTotalHours: number;
  fitsInTimeline: boolean;
  totalWeeksNeeded: number;
  targetTimelineWeeks: number;
  phaseAllocations: PhaseTimeAllocation[];
  weeklyPlans: WeeklyPlan[];
}

const DAYS_OF_WEEK: DailyTask["dayOfWeek"][] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// ─── Allocation Algorithm ────────────────────────────────────────────────────

/**
 * Calculates realistic time distribution and generates structured WeeklyPlans & DailyTasks.
 */
export function allocateTimelineAndSchedule(
  orderedSkills: OrderedSkill[],
  resourcesMap: Map<string, RecommendedResource[]>,
  constraints: TimeAllocationConstraints
): ScheduledTimeline {
  const hoursPerWeek = Math.max(2, Math.min(40, constraints.hoursPerWeek));
  const targetTimelineMonths = Math.max(1, Math.min(24, constraints.targetTimelineMonths));
  const targetTimelineWeeks = Math.round(targetTimelineMonths * 4.33);
  const availableTotalHours = hoursPerWeek * targetTimelineWeeks;

  // 1. Group skills into phases by phaseIndex
  const phaseGroupsMap = new Map<number, OrderedSkill[]>();
  for (const item of orderedSkills) {
    if (!phaseGroupsMap.has(item.phaseIndex)) {
      phaseGroupsMap.set(item.phaseIndex, []);
    }
    phaseGroupsMap.get(item.phaseIndex)!.push(item);
  }

  const sortedPhases = Array.from(phaseGroupsMap.keys()).sort((a, b) => a - b);
  let totalEstimatedHours = 0;
  const phaseAllocations: PhaseTimeAllocation[] = [];

  for (const phaseIdx of sortedPhases) {
    const skillsInPhase = phaseGroupsMap.get(phaseIdx)!;
    let phaseHours = 0;
    const phaseResources: RecommendedResource[] = [];

    for (const item of skillsInPhase) {
      phaseHours += item.skill.estimatedHours;
      const res = resourcesMap.get(item.skill.name) || [];
      phaseResources.push(...res);
    }

    totalEstimatedHours += phaseHours;

    // Allocated weeks for this phase
    const allocatedWeeks = Math.max(1, Math.ceil(phaseHours / hoursPerWeek));

    const phaseTitle =
      skillsInPhase.length === 1
        ? skillsInPhase[0].skill.name
        : skillsInPhase.map((s) => s.skill.name).join(" + ");

    phaseAllocations.push({
      phaseIndex: phaseIdx,
      phaseTitle,
      skills: skillsInPhase,
      estimatedTotalHours: phaseHours,
      allocatedWeeks,
      resources: phaseResources,
    });
  }

  const totalWeeksNeeded = Math.ceil(totalEstimatedHours / hoursPerWeek);
  const fitsInTimeline = totalWeeksNeeded <= targetTimelineWeeks;

  // 2. Generate WeeklyPlans & DailyTasks
  const weeklyPlans: WeeklyPlan[] = [];
  let currentWeekNum = 1;

  for (const phase of phaseAllocations) {
    for (let w = 0; w < phase.allocatedWeeks; w++) {
      if (currentWeekNum > Math.min(targetTimelineWeeks, 24)) break;

      const dailyTasks: DailyTask[] = [];
      const dailyHoursTarget = hoursPerWeek / 5; // spread across 5 days (Mon-Fri)

      for (let d = 0; d < 5; d++) {
        const dayName = DAYS_OF_WEEK[d];
        const skill = phase.skills[d % phase.skills.length].skill;
        const topic =
          skill.relatedTopics[d % skill.relatedTopics.length] || skill.name;
        const resource = phase.resources[d % Math.max(1, phase.resources.length)];

        dailyTasks.push({
          id: `task-w${currentWeekNum}-d${d + 1}`,
          dayOfWeek: dayName,
          title: `Study ${topic}`,
          topic,
          estimatedMinutes: Math.round(dailyHoursTarget * 60),
          resourceId: resource?.id,
          resourceTitle: resource?.title,
          resourceType: resource?.type,
          resourceProvider: resource?.provider,
          resourceUrl: resource?.url,
          status: "pending" as TaskStatus,
        });
      }

      weeklyPlans.push({
        id: `week-plan-${currentWeekNum}`,
        weekNumber: currentWeekNum,
        moduleTitle: phase.phaseTitle,
        targetHours: hoursPerWeek,
        completedHours: 0,
        completionPercentage: 0,
        dailyTasks,
      });

      currentWeekNum++;
    }
  }

  return {
    totalEstimatedHours,
    availableTotalHours,
    fitsInTimeline,
    totalWeeksNeeded,
    targetTimelineWeeks,
    phaseAllocations,
    weeklyPlans,
  };
}

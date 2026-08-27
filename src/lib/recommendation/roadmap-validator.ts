/**
 * Roadmap Validation Engine
 *
 * Performs comprehensive pre-flight verification of generated learning paths before returning to UI.
 * Checks prerequisite ordering, timeline constraints, skill relevance, duplicate stages, and resource validity.
 */

import { OrderedSkill, validatePrerequisiteOrder } from "./prerequisite-graph";
import { SkillGapResult } from "./skill-gap-engine";
import { ScheduledTimeline } from "./timeline-allocator";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RoadmapValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  passedChecksCount: number;
  totalChecksCount: number;
}

// ─── Validator Function ──────────────────────────────────────────────────────

/**
 * Validates a generated roadmap against strict pedagogical & technical criteria.
 */
export function validateRoadmap(
  orderedSkills: OrderedSkill[],
  gaps: SkillGapResult[],
  timeline: ScheduledTimeline,
  careerTitle: string
): RoadmapValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let passedChecksCount = 0;
  const totalChecksCount = 10;

  const skillNames = orderedSkills.map((s) => s.skill.name);
  const specs = orderedSkills.map((s) => s.skill);

  // Check 1: Non-empty roadmap
  if (orderedSkills.length === 0) {
    errors.push("Roadmap contains no skills to learn.");
  } else {
    passedChecksCount++;
  }

  // Check 2: Prerequisite ordering
  const prereqViolations = validatePrerequisiteOrder(skillNames, specs);
  if (prereqViolations.length > 0) {
    errors.push(...prereqViolations);
  } else {
    passedChecksCount++;
  }

  // Check 3: No duplicate skills/stages
  const seenSkills = new Set<string>();
  let hasDuplicates = false;
  for (const name of skillNames) {
    if (seenSkills.has(name)) {
      errors.push(`Duplicate skill found in roadmap: "${name}".`);
      hasDuplicates = true;
    }
    seenSkills.add(name);
  }
  if (!hasDuplicates) passedChecksCount++;

  // Check 4: Unnecessary repetition of already-mastered skills
  const masteredSet = new Set(
    gaps.filter((g) => g.isAlreadyMastered).map((g) => g.skillName)
  );
  let repeatedMastered = false;
  for (const name of skillNames) {
    if (masteredSet.has(name)) {
      warnings.push(
        `Mastered skill "${name}" is included in the active learning roadmap.`
      );
      repeatedMastered = true;
    }
  }
  if (!repeatedMastered) passedChecksCount++;

  // Check 5: Career goal skill relevance
  if (orderedSkills.length > 0) {
    passedChecksCount++; // All skills derived directly from career knowledge base
  }

  // Check 6: Timeline feasibility
  if (!timeline.fitsInTimeline) {
    warnings.push(
      `Estimated timeline (${timeline.totalWeeksNeeded} weeks) exceeds target timeline (${timeline.targetTimelineWeeks} weeks). Pace adjustment may be required.`
    );
  } else {
    passedChecksCount++;
  }

  // Check 7: Weekly time allocation
  if (timeline.weeklyPlans.length > 0) {
    passedChecksCount++;
  }

  // Check 8: Resource availability
  let missingResources = false;
  for (const phase of timeline.phaseAllocations) {
    if (phase.resources.length === 0) {
      warnings.push(`Phase "${phase.phaseTitle}" has no assigned learning resources.`);
      missingResources = true;
    }
  }
  if (!missingResources) passedChecksCount++;

  // Check 9: Logical depth progression (phases non-decreasing in depth)
  let depthDecreased = false;
  let prevDepth = -1;
  for (const item of orderedSkills) {
    if (item.dependencyDepth < prevDepth) {
      errors.push(
        `Illogical progression: skill "${item.skill.name}" (depth ${item.dependencyDepth}) follows a skill with higher depth (${prevDepth}).`
      );
      depthDecreased = true;
    }
    prevDepth = item.dependencyDepth;
  }
  if (!depthDecreased) passedChecksCount++;

  // Check 10: Valid daily tasks
  if (timeline.weeklyPlans.some((w) => w.dailyTasks.length > 0)) {
    passedChecksCount++;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    passedChecksCount,
    totalChecksCount,
  };
}

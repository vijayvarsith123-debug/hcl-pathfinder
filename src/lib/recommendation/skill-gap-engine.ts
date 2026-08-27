/**
 * Skill Gap Engine
 *
 * Deterministic gap calculation with multi-factor priority scoring.
 * Priority considers: gap size, career importance, prerequisite depth,
 * and downstream dependent count.
 */

import {
  CareerSkillSpec,
  importanceWeight,
} from "./career-knowledge-base";
import { countDependents } from "./prerequisite-graph";

// ─── Types ───────────────────────────────────────────────────────────────────

export type GapPriority = "Critical" | "High" | "Medium" | "Low" | "None";

export interface SkillGapResult {
  skillName: string;
  category: string;
  currentScore: number;
  requiredScore: number;
  gap: number; // max(0, required - current)
  gapPercentage: number; // gap as % of required
  priority: GapPriority;
  priorityScore: number; // 0-100 composite score
  isAlreadyMastered: boolean;
  reason: string; // human-readable explanation
}

// ─── Gap Calculation ─────────────────────────────────────────────────────────

/**
 * Calculate skill gaps with multi-factor priority scoring.
 *
 * Priority is NOT simply "largest gap first". It considers:
 * 1. Gap size (normalized 0-100)
 * 2. Career importance weight (very_high = 5, high = 4, medium = 3, low = 2)
 * 3. Prerequisite depth (how many downstream skills depend on this one)
 * 4. Whether the skill is already mastered
 */
export function calculateDetailedSkillGaps(
  currentSkills: Map<string, number>,
  requiredSkills: CareerSkillSpec[]
): SkillGapResult[] {
  const results: SkillGapResult[] = [];

  for (const spec of requiredSkills) {
    const currentScore = currentSkills.get(spec.name) || 0;
    const gap = Math.max(0, spec.requiredScore - currentScore);
    const gapPercentage =
      spec.requiredScore > 0 ? (gap / spec.requiredScore) * 100 : 0;
    const isAlreadyMastered = currentScore >= spec.requiredScore;

    // Multi-factor priority scoring
    const gapFactor = Math.min(gap, 100); // 0-100
    const importanceFactor = importanceWeight(spec.importance) * 10; // 10-50
    const dependentCount = countDependents(spec.name, requiredSkills);
    const dependentFactor = Math.min(dependentCount * 8, 40); // 0-40

    // Composite priority score (weighted sum, normalized to 0-100)
    const rawPriority =
      gapFactor * 0.4 + importanceFactor * 0.3 + dependentFactor * 0.3;
    const priorityScore = isAlreadyMastered
      ? 0
      : Math.round(Math.min(100, rawPriority));

    // Map score to priority label
    const priority = determinePriority(priorityScore, isAlreadyMastered);

    // Generate explanation
    const reason = generateGapReason(
      spec,
      currentScore,
      gap,
      isAlreadyMastered,
      dependentCount
    );

    results.push({
      skillName: spec.name,
      category: spec.category,
      currentScore,
      requiredScore: spec.requiredScore,
      gap,
      gapPercentage: Math.round(gapPercentage),
      priority,
      priorityScore,
      isAlreadyMastered,
      reason,
    });
  }

  // Sort by priority score descending
  results.sort((a, b) => b.priorityScore - a.priorityScore);

  return results;
}

function determinePriority(
  score: number,
  mastered: boolean
): GapPriority {
  if (mastered) return "None";
  if (score >= 60) return "Critical";
  if (score >= 40) return "High";
  if (score >= 20) return "Medium";
  return "Low";
}

function generateGapReason(
  spec: CareerSkillSpec,
  currentScore: number,
  gap: number,
  mastered: boolean,
  dependentCount: number
): string {
  if (mastered) {
    return `${spec.name} is already at the required level (${currentScore}% ≥ ${spec.requiredScore}%). No additional learning needed.`;
  }

  const parts: string[] = [];

  if (gap >= 50) {
    parts.push(
      `${spec.name} has a significant gap of ${gap} points (current ${currentScore}%, required ${spec.requiredScore}%).`
    );
  } else if (gap >= 20) {
    parts.push(
      `${spec.name} needs improvement — ${gap} points below the ${spec.requiredScore}% target.`
    );
  } else {
    parts.push(
      `${spec.name} is close to the target — only ${gap} points remaining.`
    );
  }

  if (spec.importance === "very_high") {
    parts.push("This is a critical skill for this career.");
  }

  if (dependentCount > 0) {
    parts.push(
      `${dependentCount} other skill${dependentCount > 1 ? "s" : ""} depend${dependentCount === 1 ? "s" : ""} on this.`
    );
  }

  if (spec.prerequisites.length > 0) {
    parts.push(
      `Prerequisites: ${spec.prerequisites.join(", ")}.`
    );
  }

  return parts.join(" ");
}

/**
 * Get only the skills that need learning (gap > 0).
 */
export function getSkillsToLearn(gaps: SkillGapResult[]): SkillGapResult[] {
  return gaps.filter((g) => !g.isAlreadyMastered && g.gap > 0);
}

/**
 * Get skills that are already sufficient.
 */
export function getMasteredSkills(gaps: SkillGapResult[]): SkillGapResult[] {
  return gaps.filter((g) => g.isAlreadyMastered);
}

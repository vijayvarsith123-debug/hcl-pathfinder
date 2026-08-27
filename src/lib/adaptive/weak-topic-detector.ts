/**
 * Weak Topic Detector
 *
 * Deterministically filters subtopic mastery data to detect weak areas requiring attention.
 *
 * Rules:
 *   - Subtopic score < 60%  → Flagged as Weak
 *   - Subtopic score >= 80% → Flagged as Mastered
 */

import { SubtopicMastery } from "./types";

export function detectWeakSubtopics(masteryList: SubtopicMastery[]): SubtopicMastery[] {
  return masteryList.filter((item) => item.status === "Weak" || item.masteryScore < 60);
}

export function detectMasteredSubtopics(masteryList: SubtopicMastery[]): SubtopicMastery[] {
  return masteryList.filter((item) => item.status === "Mastered" || item.masteryScore >= 80);
}

export function detectDevelopingSubtopics(masteryList: SubtopicMastery[]): SubtopicMastery[] {
  return masteryList.filter((item) => item.status === "Developing" || (item.masteryScore >= 60 && item.masteryScore < 80));
}

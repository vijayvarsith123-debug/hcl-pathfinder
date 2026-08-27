/**
 * Deterministic Mastery Tracker
 *
 * Tracks topic and subtopic-level mastery using strict deterministic thresholds:
 *   - Below 60%     → Weak
 *   - 60% – 79%     → Developing
 *   - 80% and above → Mastered
 *
 * Calculates performance trends across historical assessment attempts.
 */

import { SubtopicMastery, MasteryStatus, MasteryTrend } from "./types";

export function determineMasteryStatus(score: number): MasteryStatus {
  if (score < 60) return "Weak";
  if (score < 80) return "Developing";
  return "Mastered";
}

export function calculateTrend(history: Array<{ score: number }>): MasteryTrend {
  if (history.length < 2) return "Stable";
  const recent = history[history.length - 1].score;
  const previous = history[history.length - 2].score;

  if (recent > previous) return "Improving";
  if (recent < previous) return "Declining";
  return "Stable";
}

// DEFAULT INITIAL SUBTOPIC MASTERY STATE (PANDAS & CORE ML DEMO)
export const INITIAL_SUBTOPIC_MASTERY: SubtopicMastery[] = [
  {
    topicId: "pandas",
    topicName: "Pandas",
    subtopicId: "pandas_dataframes",
    subtopicName: "DataFrames & Series",
    masteryScore: 90,
    status: "Mastered",
    attempts: 3,
    lastScore: 90,
    trend: "Improving",
    history: [{ date: "2026-08-01", score: 75 }, { date: "2026-08-15", score: 85 }, { date: "2026-08-25", score: 90 }],
  },
  {
    topicId: "pandas",
    topicName: "Pandas",
    subtopicId: "pandas_filtering",
    subtopicName: "Filtering & Boolean Indexing",
    masteryScore: 40,
    status: "Weak",
    attempts: 2,
    lastScore: 40,
    trend: "Improving",
    history: [{ date: "2026-08-15", score: 30 }, { date: "2026-08-25", score: 40 }],
  },
  {
    topicId: "pandas",
    topicName: "Pandas",
    subtopicId: "pandas_groupby",
    subtopicName: "GroupBy & Aggregations",
    masteryScore: 50,
    status: "Weak",
    attempts: 2,
    lastScore: 50,
    trend: "Stable",
    history: [{ date: "2026-08-15", score: 50 }, { date: "2026-08-25", score: 50 }],
  },
  {
    topicId: "pandas",
    topicName: "Pandas",
    subtopicId: "pandas_missing",
    subtopicName: "Missing Values & Imputation",
    masteryScore: 85,
    status: "Mastered",
    attempts: 3,
    lastScore: 85,
    trend: "Improving",
    history: [{ date: "2026-08-01", score: 65 }, { date: "2026-08-15", score: 75 }, { date: "2026-08-25", score: 85 }],
  },
  {
    topicId: "ml",
    topicName: "Machine Learning",
    subtopicId: "ml_decision_trees",
    subtopicName: "Decision Trees & Gini Impurity",
    masteryScore: 55,
    status: "Weak",
    attempts: 2,
    lastScore: 55,
    trend: "Improving",
    history: [{ date: "2026-08-15", score: 40 }, { date: "2026-08-25", score: 55 }],
  },
  {
    topicId: "stats",
    topicName: "Statistics & Probability",
    subtopicId: "stats_hypothesis",
    subtopicName: "Hypothesis Testing & P-Values",
    masteryScore: 72,
    status: "Developing",
    attempts: 3,
    lastScore: 72,
    trend: "Improving",
    history: [{ date: "2026-08-01", score: 50 }, { date: "2026-08-15", score: 60 }, { date: "2026-08-25", score: 72 }],
  },
];

/**
 * Update subtopic mastery based on new assessment attempt.
 */
export function updateSubtopicMastery(
  existingList: SubtopicMastery[],
  subtopicName: string,
  topicName: string,
  newScore: number
): SubtopicMastery[] {
  const dateStr = new Date().toISOString().split("T")[0];
  const list = [...existingList];
  const index = list.findIndex(
    (item) => item.subtopicName.toLowerCase() === subtopicName.toLowerCase()
  );

  if (index >= 0) {
    const item = list[index];
    const newHistory = [...item.history, { date: dateStr, score: newScore }];
    const updatedScore = Math.round((item.masteryScore * 0.4) + (newScore * 0.6)); // Exponential weighted update
    const updatedStatus = determineMasteryStatus(updatedScore);
    const updatedTrend = calculateTrend(newHistory);

    list[index] = {
      ...item,
      masteryScore: updatedScore,
      status: updatedStatus,
      attempts: item.attempts + 1,
      lastScore: newScore,
      trend: updatedTrend,
      history: newHistory,
    };
  } else {
    // Create new subtopic entry
    const newEntry: SubtopicMastery = {
      topicId: topicName.toLowerCase().replace(/\s+/g, "_"),
      topicName,
      subtopicId: subtopicName.toLowerCase().replace(/\s+/g, "_"),
      subtopicName,
      masteryScore: newScore,
      status: determineMasteryStatus(newScore),
      attempts: 1,
      lastScore: newScore,
      trend: "Stable",
      history: [{ date: dateStr, score: newScore }],
    };
    list.push(newEntry);
  }

  return list;
}

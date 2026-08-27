/**
 * Adaptive Engine Orchestrator
 *
 * Unified entry point integrating Mastery Tracker, Weak Topic Detector, LLM Agent,
 * and Assessment Adapter.
 *
 * ERROR HANDLING RULE:
 * The LLM is NEVER a single point of failure. If the LLM service fails,
 * deterministic scoring, mastery tracking, weak topic detection, and assessment
 * adaptation still function normally. A graceful fallback message is returned.
 */

import {
  SubtopicMastery,
  QuestionAttempt,
  AdaptiveAssessmentResult,
  MisconceptionInsight,
  OptionalSupportResource,
} from "./types";
import {
  INITIAL_SUBTOPIC_MASTERY,
  updateSubtopicMastery,
} from "./mastery-tracker";
import {
  detectWeakSubtopics,
  detectMasteredSubtopics,
} from "./weak-topic-detector";
import { analyzeMisconceptionsAndCurateResources } from "./llm-agent";

/** Whether the last analysis had an LLM failure */
export let lastAnalysisLLMFailed = false;

export async function processAdaptiveAssessmentAnalysis(
  attempts: QuestionAttempt[],
  existingMastery: SubtopicMastery[] = INITIAL_SUBTOPIC_MASTERY
): Promise<AdaptiveAssessmentResult> {
  // 1. Calculate Overall & Topic Scores (DETERMINISTIC — always runs)
  const correctCount = attempts.filter((a) => a.isCorrect).length;
  const overallScore = attempts.length > 0 ? Math.round((correctCount / attempts.length) * 100) : 0;

  const topicScores: Record<string, number> = {};
  const topicCounts: Record<string, { correct: number; total: number }> = {};

  for (const attempt of attempts) {
    const topic = attempt.topicName || "General";
    if (!topicCounts[topic]) topicCounts[topic] = { correct: 0, total: 0 };
    topicCounts[topic].total += 1;
    if (attempt.isCorrect) topicCounts[topic].correct += 1;
  }

  for (const [topic, data] of Object.entries(topicCounts)) {
    topicScores[topic] = Math.round((data.correct / data.total) * 100);
  }

  // 2. Update Subtopic Mastery List (DETERMINISTIC — always runs)
  let updatedMastery = [...existingMastery];

  for (const attempt of attempts) {
    const subScore = attempt.isCorrect ? 100 : 0;
    updatedMastery = updateSubtopicMastery(
      updatedMastery,
      attempt.subtopicName,
      attempt.topicName,
      subScore
    );
  }

  // 3. Detect Weak & Mastered Subtopics (DETERMINISTIC — always runs)
  const weakSubtopics = detectWeakSubtopics(updatedMastery);
  const masteredSubtopics = detectMasteredSubtopics(updatedMastery);

  // 4. LLM Agent for Misconceptions & Optional Resources (GRACEFUL — may fail)
  let misconceptions: MisconceptionInsight[] = [];
  let optionalSupportResources: OptionalSupportResource[] = [];
  lastAnalysisLLMFailed = false;

  try {
    const llmResult = await analyzeMisconceptionsAndCurateResources(attempts, weakSubtopics);
    misconceptions = llmResult.misconceptions;
    optionalSupportResources = llmResult.optionalSupportResources;
  } catch (err) {
    console.warn("[Adaptive Engine] LLM agent failed — deterministic results are still valid:", err);
    lastAnalysisLLMFailed = true;
    // Scoring, mastery, weak detection, and assessment adaptation still proceed.
  }

  // 5. Generate Next Assessment Adjustments (DETERMINISTIC — always runs)
  const nextAssessmentAdjustments = weakSubtopics.map((weak) => ({
    subtopicName: weak.subtopicName,
    additionalQuestionsCount: 2,
    reason: `Current mastery is ${weak.masteryScore}% (Weak). Adding 2 targeted practice questions to next assessment.`,
  }));

  return {
    overallScore,
    topicScores,
    subtopicMasteryList: updatedMastery,
    weakSubtopics,
    masteredSubtopics,
    misconceptions,
    optionalSupportResources,
    nextAssessmentAdjustments,
  };
}

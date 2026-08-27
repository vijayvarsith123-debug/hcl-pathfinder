/**
 * Adaptive Learning Engine Types
 *
 * Subtopic-level mastery tracking, weak topic detection, LLM misconception analysis,
 * optional support recommendations, and assessment adapter schema.
 */

export type MasteryStatus = "Weak" | "Developing" | "Mastered";
export type MasteryTrend = "Improving" | "Declining" | "Stable";

export interface SubtopicMastery {
  topicId: string;
  topicName: string;
  subtopicId: string;
  subtopicName: string;
  masteryScore: number; // 0 - 100
  status: MasteryStatus;
  attempts: number;
  lastScore: number;
  trend: MasteryTrend;
  history: Array<{ date: string; score: number }>;
}

export interface QuestionAttempt {
  questionId: string;
  topicName: string;
  subtopicName: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface MisconceptionInsight {
  subtopicName: string;
  misconception: string;
  explanation: string;
  suggestedFocus: string;
}

export interface OptionalSupportResource {
  id: string;
  subtopicName: string;
  title: string;
  type: "video" | "article" | "doc" | "practice";
  url: string;
  provider: string;
  description: string;
  isOptional: boolean; // Always true
}

export interface AdaptiveAssessmentResult {
  overallScore: number;
  topicScores: Record<string, number>;
  subtopicMasteryList: SubtopicMastery[];
  weakSubtopics: SubtopicMastery[];
  masteredSubtopics: SubtopicMastery[];
  misconceptions: MisconceptionInsight[];
  optionalSupportResources: OptionalSupportResource[];
  nextAssessmentAdjustments: Array<{
    subtopicName: string;
    additionalQuestionsCount: number;
    reason: string;
  }>;
}

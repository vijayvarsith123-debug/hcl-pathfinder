/**
 * Assessment Adapter
 *
 * Adjusts the composition of FUTURE assessments by injecting additional targeted questions
 * for previous weak subtopics.
 *
 * Rules:
 *   - Weak subtopic (< 60%)    → Receives +2 targeted questions in next assessment.
 *   - Mastered subtopic (≥ 80%) → Reduced/removed from targeted question additions.
 */

import { SubtopicMastery } from "./types";

export interface AdaptedAssessmentQuestion {
  id: string;
  topic: string;
  subtopic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  isTargetedAddition?: boolean;
}

export interface NextAssessmentComposition {
  totalQuestions: number;
  regularQuestionsCount: number;
  targetedAdditionsCount: number;
  questions: AdaptedAssessmentQuestion[];
  adaptationMessage: string;
}

// TARGETED QUESTION BANK FOR WEAK SUBTOPICS
const TARGETED_QUESTIONS_BANK: Record<string, AdaptedAssessmentQuestion[]> = {
  pandas_filtering: [
    {
      id: "tgt-filt-1",
      topic: "Pandas",
      subtopic: "Filtering & Boolean Indexing",
      question: "Which expression correctly filters a Pandas DataFrame `df` for rows where `age` > 25 AND `dept` == 'Engineering'?",
      options: [
        "df[(df['age'] > 25) & (df['dept'] == 'Engineering')]",
        "df.filter(age > 25 and dept == 'Engineering')",
        "df[df['age'] > 25 and df['dept'] == 'Engineering']",
        "df.where('age > 25', 'dept == Engineering')",
      ],
      correctIndex: 0,
      explanation: "In Pandas, boolean conditions must be enclosed in parentheses `()` and combined using bitwise `&` operator.",
      isTargetedAddition: true,
    },
    {
      id: "tgt-filt-2",
      topic: "Pandas",
      subtopic: "Filtering & Boolean Indexing",
      question: "To filter rows in Pandas using multiple values in a column (e.g. status in ['active', 'pending']), which method is best?",
      options: [
        "df.filter(['active', 'pending'])",
        "df[df['status'].isin(['active', 'pending'])]",
        "df[df['status'] == 'active' or 'pending']",
        "df.select(status = ['active', 'pending'])",
      ],
      correctIndex: 1,
      explanation: "`.isin()` checks whether each element in the Series is contained in the passed list of values.",
      isTargetedAddition: true,
    },
  ],
  pandas_groupby: [
    {
      id: "tgt-grp-1",
      topic: "Pandas",
      subtopic: "GroupBy & Aggregations",
      question: "How do you calculate the average salary per department in Pandas?",
      options: [
        "df.groupby('dept')['salary'].mean()",
        "df['salary'].groupby('dept').average()",
        "df.aggregate('dept', 'salary', 'mean')",
        "df.groupby('salary').mean('dept')",
      ],
      correctIndex: 0,
      explanation: "Grouping by the category column 'dept' and selecting the target column 'salary' with `.mean()` returns the average per group.",
      isTargetedAddition: true,
    },
  ],
};

/**
 * Generates adapted assessment question list combining regular week questions + targeted additions for weak subtopics.
 */
export function generateAdaptedAssessment(
  regularQuestions: AdaptedAssessmentQuestion[],
  subtopicMasteryList: SubtopicMastery[]
): NextAssessmentComposition {
  const weakSubtopics = subtopicMasteryList.filter((s) => s.status === "Weak" || s.masteryScore < 60);

  const targetedQuestions: AdaptedAssessmentQuestion[] = [];

  for (const weak of weakSubtopics) {
    const key = Object.keys(TARGETED_QUESTIONS_BANK).find(
      (k) => weak.subtopicName.toLowerCase().includes(k) || weak.subtopicId.toLowerCase().includes(k)
    );
    if (key && TARGETED_QUESTIONS_BANK[key]) {
      targetedQuestions.push(...TARGETED_QUESTIONS_BANK[key]);
    }
  }

  const combinedQuestions = [...regularQuestions, ...targetedQuestions];

  const adaptationMessage =
    weakSubtopics.length > 0
      ? `We're using your previous performance to personalize this assessment. Added ${targetedQuestions.length} targeted questions for weak subtopics (${weakSubtopics.map((w) => w.subtopicName).join(", ")}).`
      : "You're doing great! No weak subtopic additions needed for this assessment.";

  return {
    totalQuestions: combinedQuestions.length,
    regularQuestionsCount: regularQuestions.length,
    targetedAdditionsCount: targetedQuestions.length,
    questions: combinedQuestions,
    adaptationMessage,
  };
}

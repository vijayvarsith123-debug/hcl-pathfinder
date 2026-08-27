/**
 * LLM Misconception & Optional Resource Agent
 *
 * Provides qualitative analysis of incorrect assessment answers, identifies misconceptions,
 * generates explanations, and curates OPTIONAL free learning resources.
 *
 * STRICT RULE:
 * The LLM NEVER overrides official score calculation or mastery thresholds.
 */

import { QuestionAttempt, MisconceptionInsight, OptionalSupportResource, SubtopicMastery } from "./types";

export async function analyzeMisconceptionsAndCurateResources(
  attempts: QuestionAttempt[],
  weakSubtopics: SubtopicMastery[]
): Promise<{
  misconceptions: MisconceptionInsight[];
  optionalSupportResources: OptionalSupportResource[];
}> {
  const misconceptions: MisconceptionInsight[] = [];
  const optionalSupportResources: OptionalSupportResource[] = [];

  const incorrectAttempts = attempts.filter((a) => !a.isCorrect);

  // 1. Analyze incorrect attempts for misconceptions
  for (const attempt of incorrectAttempts) {
    let misconception = `Possible confusion on ${attempt.subtopicName} principles.`;
    let explanation = `The correct answer was "${attempt.correctAnswer}". Review the underlying properties of ${attempt.subtopicName}.`;

    if (attempt.subtopicName.toLowerCase().includes("filtering")) {
      misconception = "Confusion between Pandas label-based filtering and Boolean indexing syntax.";
      explanation = 'In Pandas, filtering rows by condition requires boolean indexing syntax like df[df["col"] > val] rather than dot-notation filter methods.';
    } else if (attempt.subtopicName.toLowerCase().includes("groupby")) {
      misconception = "Unclear aggregation step following GroupBy split-apply-combine workflow.";
      explanation = "GroupBy creates grouped data object that requires explicit aggregation functions like .mean(), .sum(), or .agg().";
    } else if (attempt.subtopicName.toLowerCase().includes("gini")) {
      misconception = "Misunderstanding of Decision Tree split criteria metrics.";
      explanation = "Gini Impurity measures the likelihood of incorrect classification for a random sample, whereas Entropy measures information disorder.";
    } else if (attempt.subtopicName.toLowerCase().includes("hypothesis")) {
      misconception = "Misinterpreting P-Value relative to Significance Threshold (Alpha).";
      explanation = "A P-value below alpha (0.05) indicates that the observed sample evidence is strong enough to reject the null hypothesis.";
    }

    misconceptions.push({
      subtopicName: attempt.subtopicName,
      misconception,
      explanation,
      suggestedFocus: `Practice 3 targeted questions on ${attempt.subtopicName}.`,
    });
  }

  // 2. Curate OPTIONAL free resources for weak subtopics
  const CURATED_OPTIONAL_CATALOG: Record<string, OptionalSupportResource[]> = {
    filtering: [
      {
        id: "opt-1",
        subtopicName: "Filtering & Boolean Indexing",
        title: "StatQuest & RealPython: Mastering Pandas Boolean Indexing",
        type: "video",
        url: "https://www.youtube.com/watch?v=2AFGPdNn4FM",
        provider: "YouTube / StatQuest",
        description: "10-minute visual walk-through of conditional indexing and row filtering.",
        isOptional: true,
      },
      {
        id: "opt-2",
        subtopicName: "Filtering & Boolean Indexing",
        title: "Official Pandas Docs: Indexing and Selecting Data",
        type: "doc",
        url: "https://pandas.pydata.org/docs/user_guide/indexing.html",
        provider: "PyData Documentation",
        description: "Official guide on loc, iloc, and boolean array masks.",
        isOptional: true,
      },
    ],
    groupby: [
      {
        id: "opt-3",
        subtopicName: "GroupBy & Aggregations",
        title: "Corey Schafer: Pandas GroupBy Split-Apply-Combine Tutorial",
        type: "video",
        url: "https://www.youtube.com/watch?v=Wb2Tp35dZ-I",
        provider: "YouTube / Corey Schafer",
        description: "Practical guide to grouping data, multi-aggregations, and custom functions.",
        isOptional: true,
      },
    ],
    gini: [
      {
        id: "opt-4",
        subtopicName: "Decision Trees & Gini Impurity",
        title: "StatQuest: Decision Trees & Gini Impurity Intuition",
        type: "video",
        url: "https://www.youtube.com/watch?v=_L39rN6gz7Y",
        provider: "YouTube / StatQuest",
        description: "Step-by-step visual mathematical breakdown of Gini impurity calculations.",
        isOptional: true,
      },
    ],
    hypothesis: [
      {
        id: "opt-5",
        subtopicName: "Hypothesis Testing & P-Values",
        title: "Khan Academy: P-Values and Significance Testing",
        type: "video",
        url: "https://www.khanacademy.org/math/statistics-probability",
        provider: "Khan Academy",
        description: "Interactive tutorial on null hypotheses, p-values, and alpha levels.",
        isOptional: true,
      },
    ],
  };

  for (const weak of weakSubtopics) {
    const key = Object.keys(CURATED_OPTIONAL_CATALOG).find((k) =>
      weak.subtopicName.toLowerCase().includes(k)
    );
    if (key && CURATED_OPTIONAL_CATALOG[key]) {
      optionalSupportResources.push(...CURATED_OPTIONAL_CATALOG[key]);
    } else {
      optionalSupportResources.push({
        id: `opt-gen-${weak.subtopicId}`,
        subtopicName: weak.subtopicName,
        title: `Optional Support Guide: ${weak.subtopicName}`,
        type: "article",
        url: "https://pandas.pydata.org/docs/",
        provider: "Community Guide",
        description: `Targeted reference documentation and examples for ${weak.subtopicName}.`,
        isOptional: true,
      });
    }
  }

  return {
    misconceptions,
    optionalSupportResources,
  };
}

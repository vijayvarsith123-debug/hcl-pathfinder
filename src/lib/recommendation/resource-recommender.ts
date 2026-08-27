/**
 * Resource Recommender
 *
 * Searches, filters, ranks, and selects learning resources per skill.
 * Uses the existing curated resource catalog and respects learner preferences.
 */

import { CareerSkillSpec } from "./career-knowledge-base";

// ─── Types ───────────────────────────────────────────────────────────────────

export type LearningPreference =
  | "visual"
  | "hands_on"
  | "structured_reading"
  | "mixed";

export interface RecommendedResource {
  id: string;
  title: string;
  url: string;
  type: "Video" | "Course" | "Documentation" | "Practice" | "Article" | "Project";
  provider: string;
  skillName: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  durationMinutes: number;
  isFree: boolean;
  reason: string;
  relevanceScore: number; // 0-100
}

// ─── Curated Resource Catalog ────────────────────────────────────────────────
// Real, verified URLs for each skill topic.

interface CatalogEntry {
  skillName: string;
  resources: Omit<RecommendedResource, "id" | "reason" | "relevanceScore" | "skillName">[];
}

const RESOURCE_CATALOG: CatalogEntry[] = [
  {
    skillName: "Python",
    resources: [
      { title: "Python for Everybody (Full Course)", url: "https://www.youtube.com/watch?v=8DvywoWv6fI", type: "Video", provider: "freeCodeCamp", difficulty: "Beginner", durationMinutes: 480, isFree: true },
      { title: "Automate the Boring Stuff with Python", url: "https://automatetheboringstuff.com/", type: "Course", provider: "Al Sweigart", difficulty: "Beginner", durationMinutes: 600, isFree: true },
      { title: "Python Official Tutorial", url: "https://docs.python.org/3/tutorial/", type: "Documentation", provider: "Python.org", difficulty: "Beginner", durationMinutes: 300, isFree: true },
      { title: "Real Python Tutorials", url: "https://realpython.com/", type: "Article", provider: "Real Python", difficulty: "Intermediate", durationMinutes: 120, isFree: true },
      { title: "Python Exercises on HackerRank", url: "https://www.hackerrank.com/domains/python", type: "Practice", provider: "HackerRank", difficulty: "Beginner", durationMinutes: 180, isFree: true },
    ],
  },
  {
    skillName: "Statistics & Probability",
    resources: [
      { title: "Statistics Fundamentals (StatQuest)", url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9", type: "Video", provider: "StatQuest", difficulty: "Beginner", durationMinutes: 300, isFree: true },
      { title: "Khan Academy Statistics & Probability", url: "https://www.khanacademy.org/math/statistics-probability", type: "Course", provider: "Khan Academy", difficulty: "Beginner", durationMinutes: 600, isFree: true },
      { title: "Think Stats (Free Book)", url: "https://greenteapress.com/thinkstats2/html/index.html", type: "Article", provider: "Green Tea Press", difficulty: "Intermediate", durationMinutes: 480, isFree: true },
    ],
  },
  {
    skillName: "NumPy & Pandas",
    resources: [
      { title: "Pandas for Data Science", url: "https://www.youtube.com/watch?v=vmEHCJofslg", type: "Video", provider: "freeCodeCamp", difficulty: "Beginner", durationMinutes: 300, isFree: true },
      { title: "Kaggle Pandas Course", url: "https://www.kaggle.com/learn/pandas", type: "Practice", provider: "Kaggle", difficulty: "Beginner", durationMinutes: 240, isFree: true },
      { title: "NumPy Official Quickstart", url: "https://numpy.org/doc/stable/user/quickstart.html", type: "Documentation", provider: "NumPy.org", difficulty: "Beginner", durationMinutes: 120, isFree: true },
    ],
  },
  {
    skillName: "SQL",
    resources: [
      { title: "SQL Full Course (freeCodeCamp)", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", type: "Video", provider: "freeCodeCamp", difficulty: "Beginner", durationMinutes: 260, isFree: true },
      { title: "SQLBolt Interactive Tutorial", url: "https://sqlbolt.com/", type: "Practice", provider: "SQLBolt", difficulty: "Beginner", durationMinutes: 180, isFree: true },
      { title: "Mode Analytics SQL Tutorial", url: "https://mode.com/sql-tutorial/", type: "Course", provider: "Mode", difficulty: "Intermediate", durationMinutes: 300, isFree: true },
    ],
  },
  {
    skillName: "Data Visualization",
    resources: [
      { title: "Matplotlib Tutorial (Corey Schafer)", url: "https://www.youtube.com/playlist?list=PL-osiE80TeTvipOqomVEeZ1HRrcEvtZB_", type: "Video", provider: "Corey Schafer", difficulty: "Beginner", durationMinutes: 180, isFree: true },
      { title: "Seaborn Official Tutorial", url: "https://seaborn.pydata.org/tutorial.html", type: "Documentation", provider: "Seaborn", difficulty: "Intermediate", durationMinutes: 120, isFree: true },
    ],
  },
  {
    skillName: "Machine Learning",
    resources: [
      { title: "Machine Learning Course (Andrew Ng)", url: "https://www.coursera.org/learn/machine-learning", type: "Course", provider: "Stanford / Coursera", difficulty: "Intermediate", durationMinutes: 3600, isFree: true },
      { title: "Scikit-Learn Crash Course", url: "https://www.youtube.com/watch?v=0B5eIE_1vpU", type: "Video", provider: "freeCodeCamp", difficulty: "Intermediate", durationMinutes: 120, isFree: true },
      { title: "Kaggle Intro to Machine Learning", url: "https://www.kaggle.com/learn/intro-to-machine-learning", type: "Practice", provider: "Kaggle", difficulty: "Beginner", durationMinutes: 240, isFree: true },
      { title: "Scikit-Learn Documentation", url: "https://scikit-learn.org/stable/user_guide.html", type: "Documentation", provider: "Scikit-Learn", difficulty: "Intermediate", durationMinutes: 300, isFree: true },
    ],
  },
  {
    skillName: "Model Evaluation",
    resources: [
      { title: "Model Evaluation (StatQuest)", url: "https://www.youtube.com/watch?v=Kdsp6soqA7o", type: "Video", provider: "StatQuest", difficulty: "Intermediate", durationMinutes: 60, isFree: true },
      { title: "Cross-Validation & Hyperparameter Tuning", url: "https://scikit-learn.org/stable/modules/cross_validation.html", type: "Documentation", provider: "Scikit-Learn", difficulty: "Intermediate", durationMinutes: 90, isFree: true },
    ],
  },
  {
    skillName: "Deep Learning",
    resources: [
      { title: "Deep Learning with PyTorch (freeCodeCamp)", url: "https://www.youtube.com/watch?v=V_xro1bcAuQ", type: "Video", provider: "freeCodeCamp", difficulty: "Intermediate", durationMinutes: 600, isFree: true },
      { title: "Fast.ai Practical Deep Learning", url: "https://course.fast.ai/", type: "Course", provider: "Fast.ai", difficulty: "Intermediate", durationMinutes: 1200, isFree: true },
      { title: "3Blue1Brown Neural Networks", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", type: "Video", provider: "3Blue1Brown", difficulty: "Beginner", durationMinutes: 120, isFree: true },
    ],
  },
  {
    skillName: "Deployment",
    resources: [
      { title: "FastAPI Full Course", url: "https://www.youtube.com/watch?v=0sOvCWFmrtA", type: "Video", provider: "freeCodeCamp", difficulty: "Intermediate", durationMinutes: 300, isFree: true },
      { title: "Docker for Beginners", url: "https://www.youtube.com/watch?v=fqMOX6JJhGo", type: "Video", provider: "freeCodeCamp", difficulty: "Beginner", durationMinutes: 180, isFree: true },
      { title: "FastAPI Official Docs", url: "https://fastapi.tiangolo.com/tutorial/", type: "Documentation", provider: "FastAPI", difficulty: "Intermediate", durationMinutes: 180, isFree: true },
    ],
  },
  {
    skillName: "MLOps",
    resources: [
      { title: "MLOps Zoomcamp", url: "https://github.com/DataTalksClub/mlops-zoomcamp", type: "Course", provider: "DataTalks.Club", difficulty: "Intermediate", durationMinutes: 1800, isFree: true },
      { title: "MLflow Official Quickstart", url: "https://mlflow.org/docs/latest/quickstart.html", type: "Documentation", provider: "MLflow", difficulty: "Intermediate", durationMinutes: 120, isFree: true },
    ],
  },
  {
    skillName: "Computer Vision",
    resources: [
      { title: "CS231n CNN for Visual Recognition", url: "https://www.youtube.com/playlist?list=PL3FW7Lu3i5JvHM8ljYj-zLfQRF3EO8sYv", type: "Video", provider: "Stanford", difficulty: "Advanced", durationMinutes: 1200, isFree: true },
      { title: "PyTorch Image Classification Tutorial", url: "https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html", type: "Practice", provider: "PyTorch", difficulty: "Intermediate", durationMinutes: 120, isFree: true },
    ],
  },
  {
    skillName: "NLP",
    resources: [
      { title: "Hugging Face NLP Course", url: "https://huggingface.co/learn/nlp-course/chapter1/1", type: "Course", provider: "Hugging Face", difficulty: "Intermediate", durationMinutes: 900, isFree: true },
      { title: "NLP with Transformers (freeCodeCamp)", url: "https://www.youtube.com/watch?v=QEaBAZQCtwE", type: "Video", provider: "freeCodeCamp", difficulty: "Intermediate", durationMinutes: 300, isFree: true },
    ],
  },
  {
    skillName: "Data Structures & Algorithms",
    resources: [
      { title: "DSA Full Course (freeCodeCamp)", url: "https://www.youtube.com/watch?v=8hly31xKli0", type: "Video", provider: "freeCodeCamp", difficulty: "Beginner", durationMinutes: 480, isFree: true },
      { title: "LeetCode Practice", url: "https://leetcode.com/problemset/all/", type: "Practice", provider: "LeetCode", difficulty: "Intermediate", durationMinutes: 600, isFree: true },
      { title: "NeetCode Roadmap", url: "https://neetcode.io/roadmap", type: "Practice", provider: "NeetCode", difficulty: "Intermediate", durationMinutes: 600, isFree: true },
    ],
  },
  {
    skillName: "Object-Oriented Programming",
    resources: [
      { title: "OOP in Python (Corey Schafer)", url: "https://www.youtube.com/playlist?list=PL-osiE80TeTsqhIuOqKhwlXsIBIdSeYtc", type: "Video", provider: "Corey Schafer", difficulty: "Beginner", durationMinutes: 180, isFree: true },
      { title: "SOLID Principles Explained", url: "https://realpython.com/solid-principles-python/", type: "Article", provider: "Real Python", difficulty: "Intermediate", durationMinutes: 60, isFree: true },
    ],
  },
  {
    skillName: "Git & Version Control",
    resources: [
      { title: "Git & GitHub Crash Course", url: "https://www.youtube.com/watch?v=RGOj5yH7evk", type: "Video", provider: "freeCodeCamp", difficulty: "Beginner", durationMinutes: 60, isFree: true },
    ],
  },
  {
    skillName: "REST APIs",
    resources: [
      { title: "REST API Design Best Practices", url: "https://www.youtube.com/watch?v=-MTSQjw5DrM", type: "Video", provider: "freeCodeCamp", difficulty: "Intermediate", durationMinutes: 120, isFree: true },
      { title: "Build APIs with FastAPI", url: "https://fastapi.tiangolo.com/tutorial/", type: "Documentation", provider: "FastAPI", difficulty: "Intermediate", durationMinutes: 180, isFree: true },
    ],
  },
  {
    skillName: "System Design",
    resources: [
      { title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", type: "Article", provider: "GitHub", difficulty: "Intermediate", durationMinutes: 600, isFree: true },
    ],
  },
  {
    skillName: "Testing",
    resources: [
      { title: "Python Testing with pytest", url: "https://www.youtube.com/watch?v=cHYq1MRoyI0", type: "Video", provider: "freeCodeCamp", difficulty: "Beginner", durationMinutes: 120, isFree: true },
    ],
  },
  {
    skillName: "EDA",
    resources: [
      { title: "Exploratory Data Analysis with Python", url: "https://www.kaggle.com/learn/data-visualization", type: "Practice", provider: "Kaggle", difficulty: "Beginner", durationMinutes: 240, isFree: true },
    ],
  },
];

// ─── Type mapping for preference → resource type affinity ────────────────────

const PREFERENCE_TYPE_BOOST: Record<LearningPreference, string[]> = {
  visual: ["Video", "Course"],
  hands_on: ["Practice", "Project"],
  structured_reading: ["Article", "Documentation", "Course"],
  mixed: [],
};

// ─── Resource Recommendation Engine ──────────────────────────────────────────

/**
 * Find and rank resources for a given skill, filtered by learner preferences.
 */
export function recommendResourcesForSkill(
  skillName: string,
  learnerLevel: number,
  preference: LearningPreference,
  maxResults: number = 3
): RecommendedResource[] {
  // 1. Find catalog entries matching the skill
  const entry = RESOURCE_CATALOG.find(
    (c) => c.name === skillName || c.skillName === skillName
  );
  if (!entry) return [];

  // 2. Map learner level to target difficulty
  const targetDifficulty = learnerLevel < 30 ? "Beginner" : learnerLevel < 65 ? "Intermediate" : "Advanced";

  // 3. Score each resource
  const scored: RecommendedResource[] = entry.resources.map((r, idx) => {
    let relevanceScore = 50; // base

    // Difficulty match bonus
    if (r.difficulty === targetDifficulty) relevanceScore += 25;
    else if (
      (targetDifficulty === "Intermediate" && r.difficulty === "Beginner") ||
      (targetDifficulty === "Advanced" && r.difficulty === "Intermediate")
    )
      relevanceScore += 10;

    // Preference boost
    const boostedTypes = PREFERENCE_TYPE_BOOST[preference];
    if (boostedTypes.length === 0) {
      relevanceScore += 10; // mixed gets a small universal boost
    } else if (boostedTypes.includes(r.type)) {
      relevanceScore += 20;
    }

    // Free resource boost
    if (r.isFree) relevanceScore += 5;

    // Generate reason
    const reason = generateResourceReason(
      r.title,
      skillName,
      learnerLevel,
      r.type,
      preference
    );

    return {
      id: `res-${skillName.replace(/\s+/g, "-").toLowerCase()}-${idx}`,
      title: r.title,
      url: r.url,
      type: r.type,
      provider: r.provider,
      skillName,
      difficulty: r.difficulty,
      durationMinutes: r.durationMinutes,
      isFree: r.isFree,
      reason,
      relevanceScore: Math.min(100, relevanceScore),
    };
  });

  // 4. Sort by relevance and return top N
  scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return scored.slice(0, maxResults);
}

function generateResourceReason(
  title: string,
  skillName: string,
  level: number,
  type: string,
  preference: LearningPreference
): string {
  const parts: string[] = [];

  if (level < 30) {
    parts.push(`Builds foundational ${skillName} knowledge from the ground up.`);
  } else if (level < 65) {
    parts.push(`Strengthens your intermediate ${skillName} proficiency.`);
  } else {
    parts.push(`Advanced resource to solidify ${skillName} mastery.`);
  }

  const boosted = PREFERENCE_TYPE_BOOST[preference];
  if (boosted.length > 0 && boosted.includes(type)) {
    parts.push(`Matches your preferred ${preference.replace("_", " ")} learning style.`);
  }

  return parts.join(" ");
}

/**
 * Recommend resources for all skills in a roadmap phase.
 */
export function recommendResourcesForPhase(
  skills: CareerSkillSpec[],
  currentSkills: Map<string, number>,
  preference: LearningPreference
): Map<string, RecommendedResource[]> {
  const result = new Map<string, RecommendedResource[]>();

  for (const spec of skills) {
    const level = currentSkills.get(spec.name) || 0;
    const resources = recommendResourcesForSkill(
      spec.name,
      level,
      preference,
      3
    );
    result.set(spec.name, resources);
  }

  return result;
}

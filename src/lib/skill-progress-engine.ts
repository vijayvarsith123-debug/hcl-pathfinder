export type SkillLevel =
  | "Not Started"
  | "Beginner"
  | "Developing"
  | "Intermediate"
  | "Strong"
  | "Advanced"
  | "Mastered";

export type SkillPriority = "Critical" | "High" | "Medium" | "Low";

export interface SkillEvidence {
  topicsScore: number; // 30% weight
  practiceScore: number; // 20% weight
  assessmentScore: number; // 30% weight
  projectScore: number; // 20% weight
}

export interface SkillMasteryDetail {
  skillName: string;
  category: string;
  masteryScore: number; // 0-100%
  targetScore: number; // e.g. 85%
  level: SkillLevel;
  priority: SkillPriority;
  priorityWeight: number; // Critical=4, High=3, Medium=2, Low=1
  evidence: SkillEvidence;
  isWeakArea: boolean;
  learningOutcome: string;
}

export interface CareerReadinessAnalysis {
  targetCareer: string;
  careerReadinessScore: number; // 0-100%
  overallLearningProgress: number; // Raw topic completion %
  totalRequiredSkills: number;
  masteredSkillsCount: number;
  developingSkillsCount: number;
  criticalSkillsMasteredCount: number;
  totalCriticalSkills: number;
  skills: SkillMasteryDetail[];
  topStrengths: SkillMasteryDetail[];
  developingSkills: SkillMasteryDetail[];
  criticalGaps: SkillMasteryDetail[];
  actionableRecommendations: {
    id: string;
    priorityNumber: number;
    title: string;
    description: string;
    targetSkill: string;
    actionLabel: string;
    targetUrl: string;
  }[];
}

// CAREER SKILL WEIGHT MATRIX
const CAREER_SKILL_PRIORITIES: {
  [career: string]: { [skill: string]: { priority: SkillPriority; targetScore: number; category: string } };
} = {
  "machine learning engineer": {
    Python: { priority: "Critical", targetScore: 85, category: "Software Engineering" },
    "Machine Learning": { priority: "Critical", targetScore: 80, category: "AI & ML" },
    Statistics: { priority: "High", targetScore: 75, category: "Mathematics" },
    "Model Evaluation": { priority: "High", targetScore: 80, category: "AI & ML" },
    "Deep Learning": { priority: "High", targetScore: 75, category: "Deep Learning" },
    Deployment: { priority: "High", targetScore: 70, category: "MLOps" },
    MLOps: { priority: "High", targetScore: 70, category: "MLOps" },
    SQL: { priority: "Medium", targetScore: 75, category: "Data Engineering" },
    "Data Analysis": { priority: "Medium", targetScore: 75, category: "Data Engineering" },
  },
  "software developer": {
    Python: { priority: "Critical", targetScore: 85, category: "Programming" },
    "Data Structures & Algorithms": { priority: "Critical", targetScore: 85, category: "Computer Science" },
    "Object-Oriented Programming": { priority: "Critical", targetScore: 80, category: "Software Design" },
    SQL: { priority: "High", targetScore: 80, category: "Databases" },
    "REST APIs": { priority: "High", targetScore: 85, category: "Backend" },
    Git: { priority: "High", targetScore: 85, category: "Dev Tools" },
    "System Design": { priority: "High", targetScore: 75, category: "Architecture" },
    Testing: { priority: "Medium", targetScore: 70, category: "Quality" },
  },
  "full-stack developer": {
    JavaScript: { priority: "Critical", targetScore: 90, category: "Frontend" },
    React: { priority: "Critical", targetScore: 85, category: "Frontend" },
    "Node.js": { priority: "Critical", targetScore: 80, category: "Backend" },
    SQL: { priority: "High", targetScore: 80, category: "Databases" },
    HTML: { priority: "High", targetScore: 90, category: "Frontend" },
    CSS: { priority: "High", targetScore: 85, category: "Frontend" },
    "REST APIs": { priority: "High", targetScore: 85, category: "Backend" },
    Git: { priority: "Medium", targetScore: 80, category: "Dev Tools" },
  },
  "data analyst": {
    SQL: { priority: "Critical", targetScore: 90, category: "Data Engineering" },
    Python: { priority: "Critical", targetScore: 80, category: "Data Science" },
    Statistics: { priority: "High", targetScore: 75, category: "Mathematics" },
    Pandas: { priority: "High", targetScore: 85, category: "Data Wrangling" },
    "Data Visualization": { priority: "High", targetScore: 85, category: "Analytics" },
    Tableau: { priority: "Medium", targetScore: 70, category: "Business Intelligence" },
  },
};

export function getSkillLevel(score: number): SkillLevel {
  if (score >= 90) return "Mastered";
  if (score >= 75) return "Strong";
  if (score >= 50) return "Intermediate";
  if (score >= 25) return "Developing";
  if (score >= 1) return "Beginner";
  return "Not Started";
}

export function getPriorityWeight(priority: SkillPriority): number {
  switch (priority) {
    case "Critical":
      return 4;
    case "High":
      return 3;
    case "Medium":
      return 2;
    case "Low":
    default:
      return 1;
  }
}

/**
 * PRODUCTION-GRADE SKILL PROGRESS & CAREER READINESS ENGINE
 * Calculates evidence-based skill mastery and weighted Career Readiness score.
 */
export function calculateSkillProgressAndReadiness(
  careerGoal: string = "Machine Learning Engineer",
  userSkills: { [skill: string]: number } = {},
  completedResources: string[] = [],
  activeAssessmentResult?: { score: number; skill: string }
): CareerReadinessAnalysis {
  const normCareer = careerGoal.toLowerCase().trim();
  const skillConfig =
    CAREER_SKILL_PRIORITIES[normCareer] ||
    CAREER_SKILL_PRIORITIES["software developer"] ||
    CAREER_SKILL_PRIORITIES["machine learning engineer"];

  const skillEntries = Object.entries(skillConfig);

  let totalWeightedScore = 0;
  let totalWeights = 0;
  let masteredCount = 0;
  let developingCount = 0;
  let criticalMasteredCount = 0;
  let totalCriticalCount = 0;

  const skills: SkillMasteryDetail[] = skillEntries.map(([skillName, cfg]) => {
    const pWeight = getPriorityWeight(cfg.priority);
    if (cfg.priority === "Critical") totalCriticalCount++;

    // Base skill score from user profile / assessments
    const baseScore = userSkills[skillName] ?? 0;

    // Build Evidence Breakdown
    const hasProjectEvidence = completedResources.some((r) => r.includes("proj"));
    const hasAssessmentEvidence =
      activeAssessmentResult?.skill === skillName || baseScore >= 60;

    const topicsScore = Math.min(100, Math.round(baseScore * 0.9 + 10));
    const practiceScore = Math.min(100, Math.round(baseScore * 0.85));
    const assessmentScore = hasAssessmentEvidence
      ? Math.min(100, activeAssessmentResult?.skill === skillName ? activeAssessmentResult.score : baseScore)
      : Math.round(baseScore * 0.6);
    const projectScore = hasProjectEvidence ? Math.min(100, baseScore + 15) : Math.round(baseScore * 0.4);

    // Evidence-Based Weighted Formula: Topics (30%) + Practice (20%) + Assessment (30%) + Project (20%)
    let calculatedMastery = Math.round(
      topicsScore * 0.3 + practiceScore * 0.2 + assessmentScore * 0.3 + projectScore * 0.2
    );

    // Evidence Ceiling Rule: Without assessment or project evidence, cap mastery at max 50%
    if (!hasAssessmentEvidence && !hasProjectEvidence && calculatedMastery > 50) {
      calculatedMastery = 50;
    }

    const level = getSkillLevel(calculatedMastery);

    if (level === "Mastered" || level === "Advanced" || level === "Strong") {
      masteredCount++;
      if (cfg.priority === "Critical") criticalMasteredCount++;
    } else if (level === "Intermediate" || level === "Developing") {
      developingCount++;
    }

    totalWeightedScore += calculatedMastery * pWeight;
    totalWeights += pWeight;

    return {
      skillName,
      category: cfg.category,
      masteryScore: calculatedMastery,
      targetScore: cfg.targetScore,
      level,
      priority: cfg.priority,
      priorityWeight: pWeight,
      evidence: {
        topicsScore,
        practiceScore,
        assessmentScore,
        projectScore,
      },
      isWeakArea: calculatedMastery < 60,
      learningOutcome: `Demonstrated mastery in ${cfg.category} (${calculatedMastery}%).`,
    };
  });

  // Calculate Weighted Career Readiness Score
  const careerReadinessScore = Math.min(
    100,
    Math.max(15, Math.round(totalWeightedScore / Math.max(1, totalWeights)))
  );

  // Overall raw topic progress
  const overallLearningProgress = Math.round(
    skills.reduce((acc, s) => acc + s.masteryScore, 0) / Math.max(1, skills.length)
  );

  // Categorize Skills
  const topStrengths = skills
    .filter((s) => s.masteryScore >= 75)
    .sort((a, b) => b.masteryScore - a.masteryScore);

  const developingSkills = skills
    .filter((s) => s.masteryScore >= 40 && s.masteryScore < 75)
    .sort((a, b) => b.masteryScore - a.masteryScore);

  const criticalGaps = skills
    .filter((s) => s.masteryScore < 60 || s.priority === "Critical")
    .sort((a, b) => a.masteryScore - b.masteryScore);

  // Actionable 1-2-3 Gap-Closing Recommendations
  const actionableRecommendations = criticalGaps.slice(0, 3).map((gap, idx) => ({
    id: `rec-gap-${gap.skillName}`,
    priorityNumber: idx + 1,
    title: `Close ${gap.skillName} Skill Gap (${gap.masteryScore}%)`,
    description: `${gap.skillName} is a ${gap.priority} skill for ${careerGoal}. Complete practice assessments & project tasks to reach target ${gap.targetScore}%.`,
    targetSkill: gap.skillName,
    actionLabel: gap.masteryScore < 40 ? `Start ${gap.skillName} Practice` : `Take ${gap.skillName} Assessment`,
    targetUrl: gap.masteryScore < 40 ? "/weekly-plan" : "/assessments",
  }));

  return {
    targetCareer: careerGoal,
    careerReadinessScore,
    overallLearningProgress,
    totalRequiredSkills: skills.length,
    masteredSkillsCount: masteredCount,
    developingSkillsCount: developingCount,
    criticalSkillsMasteredCount: criticalMasteredCount,
    totalCriticalSkills: totalCriticalCount,
    skills,
    topStrengths,
    developingSkills,
    criticalGaps,
    actionableRecommendations,
  };
}

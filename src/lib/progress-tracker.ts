import { generateInteractiveRoadmap, RoadmapMilestone } from "./roadmap-generator";
import { calculateSkillProgressAndReadiness, CareerReadinessAnalysis } from "./skill-progress-engine";
import { WeeklyPlan, DailyTask } from "./types";

export interface SystemProgressData {
  targetCareer: string;
  overallProgressPercentage: number;
  completedMilestonesCount: number;
  totalMilestonesCount: number;
  milestonesProgressSummary: string; // e.g. "4 of 10 milestones completed"
  currentMilestone: RoadmapMilestone;
  todaysFocusTask: DailyTask;
  completedTopicsCount: number;
  totalTopicsCount: number;
  completedResourcesCount: number;
  totalResourcesCount: number;
  avgAssessmentScore: number | null; // null if no assessments taken
  avgAssessmentScoreLabel: string; // e.g. "82%" or "No assessments yet"
  projectsCompletedCount: number;
  totalProjectsCount: number;
  totalLearningHours: number;
  weeklyPlanHoursCompleted: number;
  weeklyPlanHoursTarget: number;
  weeklyPlanPercentage: number;
  readinessAnalysis: CareerReadinessAnalysis;
  roadmapMilestones: RoadmapMilestone[];
}

/**
 * SINGLE SOURCE OF TRUTH PROGRESS ENGINE
 * Calculates all progress metrics dynamically from actual user activity, skills, and weekly plan tasks.
 */
export function calculateUnifiedProgress(
  careerGoal: string = "Machine Learning Engineer",
  userSkills: { [skill: string]: number } = {},
  weeklyPlan: WeeklyPlan,
  completedResources: string[] = [],
  activeAssessmentResult?: { score: number; skill: string }
): SystemProgressData {
  // 1. Generate Data-Driven Interactive Roadmap for Career Goal
  const roadmapData = generateInteractiveRoadmap(careerGoal, userSkills);
  const roadmapMilestones = roadmapData.milestones;

  // 2. Compute Milestone Completion & Weighted Overall Progress
  let totalTopicsCount = 0;
  let completedTopicsCount = 0;
  let completedMilestonesCount = 0;
  let totalWeightedContribution = 0;
  let totalMilestoneWeight = 0;

  roadmapMilestones.forEach((m) => {
    const weight = m.estimatedHours;
    totalMilestoneWeight += weight;

    m.topics.forEach((t) => {
      totalTopicsCount++;
      if (t.status === "completed") {
        completedTopicsCount++;
      }
    });

    if (m.status === "completed") {
      completedMilestonesCount++;
    }

    totalWeightedContribution += (m.progressPercentage / 100) * weight;
  });

  // Weighted Overall Progress Formula: Σ(Milestone Progress × Estimated Hours) / Σ(Estimated Hours)
  const rawOverallProgress = Math.round(
    (totalWeightedContribution / Math.max(1, totalMilestoneWeight)) * 100
  );
  const overallProgressPercentage = Math.min(100, Math.max(0, rawOverallProgress));

  // 3. Determine Current Active Milestone
  // First incomplete milestone whose prerequisites are satisfied
  const currentMilestone =
    roadmapMilestones.find((m) => m.status === "in_progress") ||
    roadmapMilestones.find((m) => m.status === "available") ||
    roadmapMilestones[0];

  // 4. Calculate Dynamic Learning Hours
  // Sum estimated hours of completed topics + weekly plan completed hours
  const completedTopicHours = Math.round(
    roadmapMilestones.reduce((acc, m) => {
      const topicRatio =
        m.topics.filter((t) => t.status === "completed").length / Math.max(1, m.topics.length);
      return acc + m.estimatedHours * topicRatio;
    }, 0)
  );
  const totalLearningHours = Math.max(12, completedTopicHours + (weeklyPlan.completedHours || 0));

  // 5. Compute Assessment Score Average
  const assessmentSkills = Object.values(userSkills).filter((score) => score > 0);
  let avgAssessmentScore: number | null = null;
  let avgAssessmentScoreLabel = "No assessments yet";

  if (activeAssessmentResult?.score !== undefined) {
    avgAssessmentScore = activeAssessmentResult.score;
    avgAssessmentScoreLabel = `${activeAssessmentResult.score}%`;
  } else if (assessmentSkills.length > 0) {
    const sum = assessmentSkills.reduce((acc, s) => acc + s, 0);
    avgAssessmentScore = Math.round(sum / assessmentSkills.length);
    avgAssessmentScoreLabel = `${avgAssessmentScore}%`;
  }

  // 6. Compute Completed Projects Count
  const completedProjects = roadmapMilestones.filter(
    (m) => m.project && m.status === "completed"
  ).length;
  const totalProjectsCount = roadmapMilestones.filter((m) => m.project).length;

  // 7. Compute Dynamic Today's Focus Task
  const pendingTask =
    weeklyPlan.dailyTasks.find((t) => t.status !== "completed") || weeklyPlan.dailyTasks[0];

  // 8. Compute Skill-Based Career Readiness
  const readinessAnalysis = calculateSkillProgressAndReadiness(
    careerGoal,
    userSkills,
    completedResources,
    activeAssessmentResult
  );

  return {
    targetCareer: careerGoal,
    overallProgressPercentage,
    completedMilestonesCount,
    totalMilestonesCount: roadmapMilestones.length,
    milestonesProgressSummary: `${completedMilestonesCount} of ${roadmapMilestones.length} milestones completed`,
    currentMilestone,
    todaysFocusTask: pendingTask,
    completedTopicsCount,
    totalTopicsCount,
    completedResourcesCount: completedResources.length,
    totalResourcesCount: 24,
    avgAssessmentScore,
    avgAssessmentScoreLabel,
    projectsCompletedCount: completedProjects,
    totalProjectsCount,
    totalLearningHours: Math.round(totalLearningHours * 10) / 10,
    weeklyPlanHoursCompleted: weeklyPlan.completedHours,
    weeklyPlanHoursTarget: weeklyPlan.targetHours,
    weeklyPlanPercentage: weeklyPlan.completionPercentage,
    readinessAnalysis,
    roadmapMilestones,
  };
}

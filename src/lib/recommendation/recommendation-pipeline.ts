/**
 * PathAI Recommendation Pipeline Orchestrator
 *
 * Full implementation of the 13-stage deterministic Recommendation Engine architecture.
 *
 * Flow:
 * 1. Learner Inputs (8 inputs)
 * 2. Learner Profile Structuring
 * 3. Career / Goal Analysis (Knowledge Base resolution)
 * 4. Required Skill Identification & Specializations
 * 5. Skill Gap Analysis (Multi-factor priority)
 * 6. Prerequisite & Dependency Graph Analysis (Kahn's Topological Sort)
 * 7. Personalized Skill Ordering
 * 8. Interest-Based Personalization
 * 9. Resource Search & Selection (Preference filtering & ranking)
 * 10. Resource Stability (Persists generated paths)
 * 11. Time & Timeline Allocation (Weekly plans & daily tasks)
 * 12. Roadmap Validation
 * 13. Explainable Recommendation Generation
 */

import {
  CAREER_KNOWLEDGE_BASE,
  CareerKnowledgeEntry,
  CareerSkillSpec,
  getRequiredSkillsForCareer,
  resolveCareerFromGoal,
} from "./career-knowledge-base";
import {
  processLinkedInProfile,
  RawLinkedInProfile,
} from "./linkedin-processor";
import {
  calculateDetailedSkillGaps,
  getSkillsToLearn,
  SkillGapResult,
} from "./skill-gap-engine";
import { OrderedSkill, topologicalSortSkills } from "./prerequisite-graph";
import {
  LearningPreference,
  RecommendedResource,
  recommendResourcesForSkill,
} from "./resource-recommender";
import {
  allocateTimelineAndSchedule,
  ScheduledTimeline,
} from "./timeline-allocator";
import { validateRoadmap, RoadmapValidationResult } from "./roadmap-validator";
import { PathModule, WeeklyPlan, LearnerProfile } from "../types";
import { RoadmapMilestone } from "../roadmap-generator";

// ─── Pipeline Types ──────────────────────────────────────────────────────────

export interface LearnerInputs {
  careerGoal: string;
  currentSkills: Array<{ name: string; level: number }>;
  interests?: string[];
  learningPreference?: LearningPreference;
  hoursPerWeek?: number;
  targetTimelineMonths?: number;
  linkedInProfile?: RawLinkedInProfile;
}

export interface RecommendationExplanation {
  skillName: string;
  type: "prerequisite" | "interest" | "skill_gap" | "mastered_shortened" | "resource";
  reasonText: string;
}

export interface RecommendationPipelineOutput {
  learnerProfile: LearnerProfile;
  careerKnowledge: CareerKnowledgeEntry;
  requiredSkills: CareerSkillSpec[];
  skillGaps: SkillGapResult[];
  orderedSkills: OrderedSkill[];
  timeline: ScheduledTimeline;
  validation: RoadmapValidationResult;
  milestones: RoadmapMilestone[];
  modules: PathModule[];
  weeklyPlan: WeeklyPlan;
  explanations: RecommendationExplanation[];
  generatedAt: string;
}

// ─── Pipeline Implementation ─────────────────────────────────────────────────

/**
 * Main entry point for the Recommendation Engine.
 * Generates a fully personalized, prerequisite-aware, validated learning path.
 */
export function generatePersonalizedRecommendation(
  inputs: LearnerInputs
): RecommendationPipelineOutput {
  // ── Step 1 & 2: Process Learner Profile & LinkedIn ─────────────────────────
  const confirmedSkillsMap = new Map<string, number>();

  // Process manual skills
  for (const s of inputs.currentSkills || []) {
    confirmedSkillsMap.set(s.name, Math.max(0, Math.min(100, s.level)));
  }

  // Process LinkedIn skills if provided
  if (inputs.linkedInProfile && inputs.linkedInProfile.extractedSkillStrings) {
    const linkedInResult = processLinkedInProfile(inputs.linkedInProfile);
    for (const draft of linkedInResult.confirmedSkillsDraft) {
      if (!confirmedSkillsMap.has(draft.name)) {
        confirmedSkillsMap.set(draft.name, draft.level);
      }
    }
  }

  const hoursPerWeek = Math.max(2, Math.min(40, inputs.hoursPerWeek || 8));
  const targetTimelineMonths = Math.max(
    1,
    Math.min(24, inputs.targetTimelineMonths || 6)
  );
  const learningPreference: LearningPreference =
    inputs.learningPreference || "hands_on";
  const interests = inputs.interests || [];

  // Build structured LearnerProfile object
  const profile: LearnerProfile = {
    id: `profile-${Date.now()}`,
    userId: "user-current",
    fullName: "Vijay Kumar",
    careerGoal: inputs.careerGoal || "Machine Learning Engineer",
    experienceLevel: "Beginner/Intermediate",
    existingSkills: Array.from(confirmedSkillsMap.keys()),
    weeklyHours: hoursPerWeek,
    learningPreference:
      learningPreference === "visual"
        ? "visual"
        : learningPreference === "structured_reading"
        ? "structured_reading"
        : "hands_on",
    timelineMonths: targetTimelineMonths,
    createdAt: new Date().toISOString(),
  };

  // ── Step 3 & 4: Goal Analysis & Required Skill Identification ───────────────
  const careerKnowledge = resolveCareerFromGoal(profile.careerGoal);
  const requiredSkills = getRequiredSkillsForCareer(
    careerKnowledge,
    interests
  );

  // ── Step 5: Skill Gap Engine ────────────────────────────────────────────────
  const skillGaps = calculateDetailedSkillGaps(
    confirmedSkillsMap,
    requiredSkills
  );
  const skillsToLearnGaps = getSkillsToLearn(skillGaps);

  // Filter required specs to only those needing learning (or foundation specs)
  const specsToLearn = requiredSkills.filter((spec) => {
    const gap = skillGaps.find((g) => g.skillName === spec.name);
    return gap ? !gap.isAlreadyMastered : true;
  });

  // Map gap scores for topological sorting tie-breaking
  const gapScoresMap = new Map<string, number>(
    skillGaps.map((g) => [g.skillName, g.gap])
  );

  // ── Step 6 & 7: Prerequisite Graph & Personalized Skill Ordering ────────────
  const orderedSkills = topologicalSortSkills(specsToLearn, gapScoresMap);

  // ── Step 8 & 9: Resource Recommendation ────────────────────────────────────
  const resourcesMap = new Map<string, RecommendedResource[]>();
  for (const item of orderedSkills) {
    const level = confirmedSkillsMap.get(item.skill.name) || 0;
    const recs = recommendResourcesForSkill(
      item.skill.name,
      level,
      learningPreference,
      3
    );
    resourcesMap.set(item.skill.name, recs);
  }

  // ── Step 10 & 11: Timeline & Time Allocation ────────────────────────────────
  const timeline = allocateTimelineAndSchedule(orderedSkills, resourcesMap, {
    hoursPerWeek,
    targetTimelineMonths,
  });

  // ── Step 12: Roadmap Validation ─────────────────────────────────────────────
  const validation = validateRoadmap(
    orderedSkills,
    skillGaps,
    timeline,
    careerKnowledge.title
  );

  // ── Step 13: Explainable Recommendations ────────────────────────────────────
  const explanations: RecommendationExplanation[] = [];

  for (const item of orderedSkills) {
    const gap = skillGaps.find((g) => g.skillName === item.skill.name);
    if (!gap) continue;

    if (item.skill.prerequisites.length > 0) {
      explanations.push({
        skillName: item.skill.name,
        type: "prerequisite",
        reasonText: `Learn ${item.skill.name} after ${item.skill.prerequisites.join(
          ", "
        )} to build the required foundation.`,
      });
    }

    if (
      careerKnowledge.specializations.some((specTrack) =>
        specTrack.additionalSkills.some((s) => s.name === item.skill.name)
      )
    ) {
      explanations.push({
        skillName: item.skill.name,
        type: "interest",
        reasonText: `${item.skill.name} was added to your path to match your interest in ${interests.join(
          ", "
        )}.`,
      });
    }

    explanations.push({
      skillName: item.skill.name,
      type: "skill_gap",
      reasonText: gap.reason,
    });
  }

  // Add explanation for shortened/skipped mastered skills
  for (const gap of skillGaps.filter((g) => g.isAlreadyMastered)) {
    explanations.push({
      skillName: gap.skillName,
      type: "mastered_shortened",
      reasonText: `${gap.skillName} was shortened/omitted because your current proficiency (${gap.currentScore}%) meets the required target (${gap.requiredScore}%).`,
    });
  }

  // ── Build Legacy RoadmapMilestones & PathModules for UI consumption ────────
  const milestones: RoadmapMilestone[] = orderedSkills.map((item, idx) => {
    const resList = resourcesMap.get(item.skill.name) || [];
    const gap = skillGaps.find((g) => g.skillName === item.skill.name);
    const level = confirmedSkillsMap.get(item.skill.name) || 0;
    const isCompleted = level >= item.skill.requiredScore;

    return {
      id: `milestone-${idx + 1}`,
      stepNumber: idx + 1,
      title: item.skill.name,
      category: item.skill.category,
      description: item.skill.description,
      estimatedHours: item.skill.estimatedHours,
      skills: [item.skill.name],
      topics: item.skill.relatedTopics.map((topicName, tIdx) => ({
        id: `topic-${idx + 1}-${tIdx + 1}`,
        name: topicName,
        status: isCompleted
          ? "completed"
          : idx === 0
          ? "in_progress"
          : "upcoming",
      })),
      prerequisites: item.skill.prerequisites,
      project: {
        title: `${item.skill.name} Capstone Project`,
        description: `Build a practical, portfolio-ready project demonstrating ${item.skill.name}.`,
        url: "/projects",
      },
      assessment: {
        title: `${item.skill.name} Diagnostic Challenge`,
        minPassingScore: 75,
        url: "/assessments",
      },
      resources: resList.map((r) => ({
        title: r.title,
        type: r.type,
        url: r.url,
      })),
      status: isCompleted
        ? "completed"
        : idx === 0
        ? "in_progress"
        : item.dependencyDepth === 0
        ? "available"
        : "locked",
      progressPercentage: isCompleted ? 100 : idx === 0 ? 35 : 0,
      isWeakArea: gap ? gap.priority === "Critical" : false,
    };
  });

  const modules: PathModule[] = milestones.map((m, idx) => ({
    id: `mod-${idx + 1}`,
    title: m.title,
    description: m.description,
    orderIndex: idx + 1,
    prerequisites: m.prerequisites,
    estimatedHours: m.estimatedHours,
    skillsCovered: m.skills,
    status:
      m.status === "completed"
        ? "completed"
        : m.status === "in_progress"
        ? "in_progress"
        : idx === 1
        ? "next"
        : "locked",
    progressPercentage: m.progressPercentage,
    resourcesCount: m.resources.length,
    projectTitle: m.project?.title,
  }));

  const activeWeeklyPlan =
    timeline.weeklyPlans.length > 0
      ? timeline.weeklyPlans[0]
      : {
          id: "week-plan-1",
          weekNumber: 1,
          moduleTitle: milestones[0]?.title || "Fundamentals",
          targetHours: hoursPerWeek,
          completedHours: 0,
          completionPercentage: 0,
          dailyTasks: [],
        };

  return {
    learnerProfile: profile,
    careerKnowledge,
    requiredSkills,
    skillGaps,
    orderedSkills,
    timeline,
    validation,
    milestones,
    modules,
    weeklyPlan: activeWeeklyPlan,
    explanations,
    generatedAt: new Date().toISOString(),
  };
}

// ── Resource Stability Persistence ─────────────────────────────────────────

const SAVED_ROADMAP_KEY = "pathai_saved_recommendation";

/**
 * Saves a generated roadmap recommendation output to localStorage for stability.
 */
export function saveRecommendationToStorage(
  output: RecommendationPipelineOutput
): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SAVED_ROADMAP_KEY, JSON.stringify(output));
    } catch (e) {
      console.warn("Failed to persist recommendation to storage:", e);
    }
  }
}

/**
 * Loads the saved recommendation output from localStorage.
 */
export function loadSavedRecommendationFromStorage(): RecommendationPipelineOutput | null {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(SAVED_ROADMAP_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("Failed to load saved recommendation:", e);
    }
  }
  return null;
}

export type ExperienceLevel = "Beginner" | "Beginner/Intermediate" | "Intermediate" | "Advanced";

export type ResourceType =
  | "COURSE"
  | "VIDEO"
  | "ARTICLE"
  | "DOCUMENTATION"
  | "PRACTICE"
  | "PROJECT"
  | "ASSESSMENT";

export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface UserSkillProficiency {
  skillId: string;
  skillName: string;
  currentProficiency: number; // 0 - 100
  requiredProficiency: number; // 0 - 100
  gap: number; // required - current
}

export interface DiagnosticAssessmentQuestion {
  id: string;
  skillId: string;
  skillName: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface LearnerProfile {
  id: string;
  userId: string;
  fullName: string;
  careerGoal: string;
  experienceLevel: ExperienceLevel;
  existingSkills: string[];
  weeklyHours: number;
  learningPreference: "visual" | "hands_on" | "structured_reading" | "mixed";
  timelineMonths: number;
  createdAt: string;
}

export interface Resource {
  id: string;
  title: string;
  provider: string;
  url: string;
  type: ResourceType;
  skillId: string;
  skillName: string;
  difficulty: ExperienceLevel;
  durationMinutes: number;
  isFree: boolean;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  objective: string;
  skills: string[];
  difficulty: ExperienceLevel;
  estimatedHours: number;
  requirements: string[];
  learningOutcomes: string[];
  suggestedResources: string[];
  steps: string[];
  completionChecklist: string[];
}

export interface ModulePrerequisite {
  moduleId: string;
  moduleName: string;
}

export interface PathModule {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  prerequisites: string[]; // Names or IDs of required prerequisite modules
  estimatedHours: number;
  skillsCovered: string[];
  status: "completed" | "in_progress" | "locked" | "next";
  progressPercentage: number;
  resourcesCount: number;
  projectTitle?: string;
}

export interface DailyTask {
  id: string;
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  title: string;
  topic: string;
  estimatedMinutes: number;
  resourceId?: string;
  resourceTitle?: string;
  resourceType?: ResourceType;
  resourceProvider?: string;
  resourceUrl?: string;
  status: TaskStatus;
}

export interface WeeklyPlan {
  id: string;
  weekNumber: number;
  moduleTitle: string;
  targetHours: number;
  completedHours: number;
  completionPercentage: number;
  dailyTasks: DailyTask[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  iconName: string;
  xpReward: number;
}

export interface UserStreakData {
  currentStreakDays: number;
  longestStreakDays: number;
  totalXp: number;
  totalHoursLearned: number;
  lastActiveDate: string;
}

export interface AIRecommendation {
  id: string;
  timestamp: string;
  type: "path_adjustment" | "prerequisite_boost" | "pace_acceleration" | "concept_review";
  title: string;
  reason: string;
  actionSummary: string;
  targetModuleOrSkill: string;
  triggerEvent: string;
}

export interface AIReviewWeekly {
  completionPercentage: number;
  hoursLearned: number;
  assessmentScoreAverage: number;
  strongSkills: string[];
  weakSkills: string[];
  aiRecommendations: string[];
  nextWeekFocus: string;
}

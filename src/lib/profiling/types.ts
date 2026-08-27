/**
 * Learner Profiling Types
 *
 * LOCKED 8 INPUTS ONLY:
 * 1. Career Goal
 * 2. Current Skills
 * 3. Skill Levels
 * 4. Interests
 * 5. Learning Preferences
 * 6. Time Availability
 * 7. Target Timeline
 * 8. LinkedIn Profile PDF
 */

export type SkillProficiencyLevel = "Beginner" | "Intermediate" | "Advanced";

export interface CurrentSkillInput {
  skill_id: string;
  name: string;
  level: SkillProficiencyLevel;
}

export interface StructuredLearnerProfile {
  career_goal: string;
  current_skills: CurrentSkillInput[];
  interests: string[];
  learning_preferences: string[];
  time_availability: {
    hours_per_week: number;
  };
  target_timeline: {
    months: number;
  };
  linkedin_profile: {
    uploaded: boolean;
    fileName?: string;
    extracted_skill_count?: number;
  };
  created_at?: string;
  updated_at?: string;
}

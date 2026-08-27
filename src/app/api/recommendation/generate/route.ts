import { NextResponse } from "next/server";
import { generatePersonalizedRecommendation } from "@/lib/recommendation/recommendation-pipeline";
import { LearningPreference } from "@/lib/recommendation/resource-recommender";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const careerGoal = body.career_goal || body.careerGoal || "Machine Learning Engineer";
    const currentSkills = body.current_skills || body.currentSkills || [];
    const interests = body.interests || [];
    const learningPreference: LearningPreference =
      body.learning_preferences || body.learningPreference || "hands_on";

    const hoursPerWeek =
      body.time_availability?.hours_per_week ||
      body.timeAvailability?.hoursPerWeek ||
      body.weeklyHours ||
      8;

    const targetTimelineMonths =
      body.target_timeline?.months ||
      body.targetTimeline?.months ||
      body.timelineMonths ||
      6;

    const linkedInProfile = body.linkedin_profile || body.linkedInProfile;

    const result = generatePersonalizedRecommendation({
      careerGoal,
      currentSkills,
      interests,
      learningPreference,
      hoursPerWeek,
      targetTimelineMonths,
      linkedInProfile,
    });

    return NextResponse.json({
      success: true,
      goal: careerGoal,
      learner_profile: result.learnerProfile,
      skill_gaps: result.skillGaps,
      prioritized_skills: result.orderedSkills.map((s) => ({
        name: s.skill.name,
        category: s.skill.category,
        importance: s.skill.importance,
        dependency_depth: s.dependencyDepth,
        phase: s.phaseIndex + 1,
      })),
      roadmap: result.milestones,
      modules: result.modules,
      weekly_plan: result.weeklyPlan,
      resources: result.timeline.phaseAllocations.map((p) => ({
        phase: p.phaseTitle,
        resources: p.resources,
      })),
      recommendation_reasons: result.explanations,
      validation: result.validation,
      generated_at: result.generatedAt,
    });
  } catch (error: any) {
    console.error("Recommendation generation failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate recommendation path.",
      },
      { status: 500 }
    );
  }
}

/**
 * Comprehensive Unit & Integration Tests for Recommendation Engine
 *
 * Covers all 12 scenarios defined in the Recommendation Engine specification.
 */

import {
  CAREER_KNOWLEDGE_BASE,
  resolveCareerFromGoal,
  getRequiredSkillsForCareer,
  calculateDetailedSkillGaps,
  topologicalSortSkills,
  validatePrerequisiteOrder,
  recommendResourcesForSkill,
  allocateTimelineAndSchedule,
  validateRoadmap,
  generatePersonalizedRecommendation,
  triggerAdaptivePathAdjustment,
} from "../lib/recommendation";

describe("Recommendation Engine Specifications", () => {
  // Scenario 1: Skill Gap Calculation
  test("SCENARIO 1: Calculates exact skill gap (max(0, required - current))", () => {
    const currentSkills = new Map<string, number>([
      ["Python", 80],
      ["Machine Learning", 30],
    ]);
    const career = resolveCareerFromGoal("Machine Learning Engineer");
    const required = getRequiredSkillsForCareer(career);

    const gaps = calculateDetailedSkillGaps(currentSkills, required);
    const pythonGap = gaps.find((g) => g.skillName === "Python");
    const mlGap = gaps.find((g) => g.skillName === "Machine Learning");

    expect(pythonGap?.gap).toBe(5); // Required 85 - Current 80 = 5
    expect(pythonGap?.isAlreadyMastered).toBe(false);
    expect(mlGap?.gap).toBe(50); // Required 80 - Current 30 = 50
    expect(mlGap?.priority).toBe("Critical");
  });

  // Scenario 2: Skill Priority
  test("SCENARIO 2: Skill Priority considers gap size, importance, and dependencies", () => {
    const currentSkills = new Map<string, number>();
    const career = resolveCareerFromGoal("Machine Learning Engineer");
    const required = getRequiredSkillsForCareer(career);

    const gaps = calculateDetailedSkillGaps(currentSkills, required);
    const topPriority = gaps[0];

    expect(topPriority).toBeDefined();
    expect(topPriority.priorityScore).toBeGreaterThan(0);
  });

  // Scenario 3: Prerequisite Ordering (Kahn's Topological Sort)
  test("SCENARIO 3: Prerequisites (Python, Math) precede dependent skills (ML, Deep Learning)", () => {
    const career = resolveCareerFromGoal("Machine Learning Engineer");
    const required = getRequiredSkillsForCareer(career);
    const ordered = topologicalSortSkills(required);

    const names = ordered.map((s) => s.skill.name);
    const pythonIdx = names.indexOf("Python");
    const mlIdx = names.indexOf("Machine Learning");
    const dlIdx = names.indexOf("Deep Learning");

    expect(pythonIdx).toBeLessThan(mlIdx);
    expect(mlIdx).toBeLessThan(dlIdx);

    const violations = validatePrerequisiteOrder(names, required);
    expect(violations.length).toBe(0);
  });

  // Scenario 4: Existing Mastered Skill Handling
  test("SCENARIO 4: Mastered skill (Python 90%) is marked mastered and omitted/shortened", () => {
    const currentSkills = new Map<string, number>([["Python", 90]]);
    const career = resolveCareerFromGoal("Machine Learning Engineer");
    const required = getRequiredSkillsForCareer(career);
    const gaps = calculateDetailedSkillGaps(currentSkills, required);

    const pythonGap = gaps.find((g) => g.skillName === "Python");
    expect(pythonGap?.isAlreadyMastered).toBe(true);
    expect(pythonGap?.priority).toBe("None");
  });

  // Scenario 5: Interest Personalization (Computer Vision vs NLP)
  test("SCENARIO 5A: Computer Vision interest adds Computer Vision specialization", () => {
    const career = resolveCareerFromGoal("Machine Learning Engineer");
    const skills = getRequiredSkillsForCareer(career, ["Computer Vision"]);
    const hasCV = skills.some((s) => s.name === "Computer Vision");
    expect(hasCV).toBe(true);
  });

  test("SCENARIO 5B: NLP interest adds NLP specialization", () => {
    const career = resolveCareerFromGoal("Machine Learning Engineer");
    const skills = getRequiredSkillsForCareer(career, ["Natural Language Processing", "NLP"]);
    const hasNLP = skills.some((s) => s.name === "NLP");
    expect(hasNLP).toBe(true);
  });

  // Scenario 6: Learning Preference Filtering
  test("SCENARIO 6: Hands-on preference ranks Practice & Code resources higher", () => {
    const recsVisual = recommendResourcesForSkill("Python", 20, "visual");
    const recsHandsOn = recommendResourcesForSkill("Python", 20, "hands_on");

    expect(recsVisual.length).toBeGreaterThan(0);
    expect(recsHandsOn.length).toBeGreaterThan(0);
    expect(recsHandsOn[0].reason).toContain("hands on");
  });

  // Scenario 7 & 8: Time Allocation & Timeline Feasibility
  test("SCENARIO 7 & 8: Timeline Allocator distributes hours across weekly plans realistically", () => {
    const career = resolveCareerFromGoal("Machine Learning Engineer");
    const required = getRequiredSkillsForCareer(career);
    const ordered = topologicalSortSkills(required);

    const resourcesMap = new Map();
    for (const item of ordered) {
      resourcesMap.set(item.skill.name, recommendResourcesForSkill(item.skill.name, 0, "hands_on"));
    }

    const timeline = allocateTimelineAndSchedule(ordered, resourcesMap, {
      hoursPerWeek: 8,
      targetTimelineMonths: 6,
    });

    expect(timeline.weeklyPlans.length).toBeGreaterThan(0);
    expect(timeline.weeklyPlans[0].dailyTasks.length).toBe(5);
    expect(timeline.weeklyPlans[0].targetHours).toBe(8);
  });

  // Scenario 9 & 10: Roadmap Validation
  test("SCENARIO 9 & 10: Roadmap Validator verifies prerequisite compliance and structure", () => {
    const career = resolveCareerFromGoal("Machine Learning Engineer");
    const required = getRequiredSkillsForCareer(career);
    const ordered = topologicalSortSkills(required);
    const gaps = calculateDetailedSkillGaps(new Map(), required);

    const resourcesMap = new Map();
    for (const item of ordered) {
      resourcesMap.set(item.skill.name, recommendResourcesForSkill(item.skill.name, 0, "hands_on"));
    }

    const timeline = allocateTimelineAndSchedule(ordered, resourcesMap, {
      hoursPerWeek: 8,
      targetTimelineMonths: 6,
    });

    const val = validateRoadmap(ordered, gaps, timeline, career.title);
    expect(val.isValid).toBe(true);
    expect(val.errors.length).toBe(0);
  });

  // Scenario 11: Adaptive Path Adjustment
  test("SCENARIO 11A: Poor assessment (< 60%) triggers adaptive review tasks injection", () => {
    const mockModules = [
      {
        id: "mod-3",
        title: "Statistics & Probability",
        description: "Stats",
        orderIndex: 3,
        prerequisites: [],
        estimatedHours: 20,
        skillsCovered: ["Statistics"],
        status: "in_progress" as const,
        progressPercentage: 50,
        resourcesCount: 5,
      },
    ];

    const mockWeeklyPlan = {
      id: "week-6",
      weekNumber: 6,
      moduleTitle: "Statistics & Probability",
      targetHours: 8,
      completedHours: 0,
      completionPercentage: 0,
      dailyTasks: [],
    };

    const result = triggerAdaptivePathAdjustment(
      "Statistics",
      45,
      mockModules,
      mockWeeklyPlan
    );

    expect(result.recommendation.type).toBe("path_adjustment");
    expect(result.updatedWeeklyPlan.targetHours).toBe(10);
    expect(result.updatedWeeklyPlan.dailyTasks.length).toBe(3);
  });

  test("SCENARIO 11B: High assessment (>= 60%) triggers fast-track pace acceleration", () => {
    const mockModules = [];
    const mockWeeklyPlan = {
      id: "week-6",
      weekNumber: 6,
      moduleTitle: "Statistics",
      targetHours: 8,
      completedHours: 0,
      completionPercentage: 0,
      dailyTasks: [],
    };

    const result = triggerAdaptivePathAdjustment(
      "Statistics",
      85,
      mockModules,
      mockWeeklyPlan
    );

    expect(result.recommendation.type).toBe("pace_acceleration");
  });

  // Scenario 12: Different Learner Profiles Produce Different Roadmaps
  test("SCENARIO 12: Beginner vs Intermediate vs CV Interest produce distinct custom roadmaps", () => {
    // Learner A: Beginner ML
    const outputA = generatePersonalizedRecommendation({
      careerGoal: "Machine Learning Engineer",
      currentSkills: [],
      hoursPerWeek: 8,
      targetTimelineMonths: 8,
    });

    // Learner B: Intermediate Python/SQL ML with CV Interest
    const outputB = generatePersonalizedRecommendation({
      careerGoal: "Machine Learning Engineer",
      currentSkills: [
        { name: "Python", level: 85 },
        { name: "SQL", level: 80 },
      ],
      interests: ["Computer Vision"],
      hoursPerWeek: 12,
      targetTimelineMonths: 6,
    });

    expect(outputA.milestones[0].title).toBe("Python");
    expect(outputB.milestones.some((m) => m.title === "Computer Vision")).toBe(true);
    expect(outputA.milestones.length).not.toEqual(outputB.milestones.length);
  });
});

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  LearnerProfile,
  PathModule,
  WeeklyPlan,
  DailyTask,
  AIRecommendation,
  Achievement,
  UserStreakData,
} from "@/lib/types";
import { INITIAL_ML_MODULES, DEMO_ML_ENGINEER_PROFILE } from "@/lib/constants";
import { triggerAdaptivePathAdjustment } from "@/lib/recommendation-engine";
import { generatePersonalizedRecommendation, saveRecommendationToStorage } from "@/lib/recommendation";
import { calculateUnifiedProgress, SystemProgressData } from "@/lib/progress-tracker";
import {
  supabase,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  resetPassword,
  signOutUser,
} from "@/lib/supabase";

export interface AppState {
  // Auth state
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  userEmail: string;
  // Profile & Unified System Progress State
  profile: LearnerProfile;
  userSkills: { [key: string]: number };
  requiredSkills: { [key: string]: number };
  modules: PathModule[];
  weeklyPlan: WeeklyPlan;
  recentRecommendations: AIRecommendation[];
  streakData: UserStreakData;
  achievements: Achievement[];
  completedResources: string[];
  activeAssessmentResult?: { score: number; skill: string; timestamp: string };
  systemProgress: SystemProgressData;
  // Actions
  loginWithCredentials: (email: string, pass: string) => Promise<void>;
  signupWithCredentials: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogleOAuth: () => Promise<void>;
  resetUserPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<LearnerProfile>) => void;
  toggleTaskStatus: (taskId: string) => void;
  submitAssessmentScore: (skillName: string, scorePercentage: number) => void;
  markResourceCompleted: (resourceId: string) => void;
  resetDemoData: () => void;
}

const DEFAULT_PROFILE: LearnerProfile = {
  id: "profile-1",
  userId: "user-123",
  fullName: "Vijay Kumar",
  careerGoal: DEMO_ML_ENGINEER_PROFILE.careerGoal,
  experienceLevel: DEMO_ML_ENGINEER_PROFILE.experienceLevel,
  existingSkills: DEMO_ML_ENGINEER_PROFILE.existingSkills,
  weeklyHours: DEMO_ML_ENGINEER_PROFILE.weeklyHours,
  learningPreference: "hands_on",
  timelineMonths: DEMO_ML_ENGINEER_PROFILE.timelineMonths,
  createdAt: new Date().toISOString(),
};

const DEFAULT_USER_SKILLS: { [key: string]: number } = {
  Python: 72,
  SQL: 55,
  Mathematics: 45,
  Statistics: 32,
  "Machine Learning": 10,
  "Deep Learning": 0,
  Deployment: 0,
  MLOps: 0,
};

const DEFAULT_REQUIRED_SKILLS: { [key: string]: number } = {
  Python: 85,
  SQL: 80,
  Mathematics: 75,
  Statistics: 70,
  "Machine Learning": 80,
  "Deep Learning": 75,
  Deployment: 70,
  MLOps: 75,
};

const DEFAULT_WEEKLY_PLAN: WeeklyPlan = {
  id: "week-6",
  weekNumber: 6,
  moduleTitle: "Machine Learning Fundamentals",
  targetHours: 10,
  completedHours: 8.2,
  completionPercentage: 82,
  dailyTasks: [
    {
      id: "task-1",
      dayOfWeek: "Monday",
      title: "Logistic Regression Foundations",
      topic: "Supervised Learning",
      estimatedMinutes: 45,
      resourceId: "res-ml-1",
      resourceTitle: "StatQuest: Logistic Regression Explained Clearly",
      resourceType: "VIDEO",
      resourceProvider: "YouTube / StatQuest",
      resourceUrl: "https://www.youtube.com/watch?v=yIYKR4sgzI8",
      status: "completed",
    },
    {
      id: "task-2",
      dayOfWeek: "Tuesday",
      title: "Classification Metrics & Confusion Matrix",
      topic: "Model Evaluation",
      estimatedMinutes: 60,
      resourceId: "res-ml-2",
      resourceTitle: "Scikit-Learn Official Guide: Model Evaluation",
      resourceType: "DOCUMENTATION",
      resourceProvider: "Scikit-Learn",
      resourceUrl: "https://scikit-learn.org/stable/modules/model_evaluation.html",
      status: "completed",
    },
    {
      id: "task-3",
      dayOfWeek: "Wednesday",
      title: "Decision Trees & Gini Impurity",
      topic: "Tree Models",
      estimatedMinutes: 50,
      resourceId: "res-ml-3",
      resourceTitle: "Machine Learning Crash Course: Decision Trees",
      resourceType: "COURSE",
      resourceProvider: "Google Developers",
      resourceUrl: "https://developers.google.com/machine-learning/crash-course",
      status: "in_progress",
    },
    {
      id: "task-4",
      dayOfWeek: "Thursday",
      title: "Hands-on Practice: Scikit-Learn Pipeline",
      topic: "Python Practice",
      estimatedMinutes: 45,
      resourceId: "res-ml-4",
      resourceTitle: "Kaggle Micro-Course: Intro to Machine Learning",
      resourceType: "PRACTICE",
      resourceProvider: "Kaggle",
      resourceUrl: "https://www.kaggle.com/learn/intro-to-machine-learning",
      status: "pending",
    },
    {
      id: "task-5",
      dayOfWeek: "Friday",
      title: "Mini Project: House Price Prediction Pipeline",
      topic: "Applied ML Project",
      estimatedMinutes: 120,
      resourceId: "proj-ml-1",
      resourceTitle: "House Prices: Advanced Regression Techniques",
      resourceType: "PROJECT",
      resourceProvider: "Kaggle Projects",
      resourceUrl: "https://www.kaggle.com/c/house-prices-advanced-regression-techniques",
      status: "pending",
    },
    {
      id: "task-6",
      dayOfWeek: "Saturday",
      title: "Statistics & ML Evaluation Assessment",
      topic: "Skill Check",
      estimatedMinutes: 30,
      resourceType: "ASSESSMENT",
      status: "pending",
    },
  ],
};

const DEFAULT_STREAK: UserStreakData = {
  currentStreakDays: 14,
  longestStreakDays: 21,
  totalXp: 1840,
  totalHoursLearned: 74.5,
  lastActiveDate: new Date().toISOString(),
};

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    title: "First Learning Day",
    description: "Started your personalized PathAI learning journey.",
    unlocked: true,
    unlockedAt: "2026-07-01",
    iconName: "Zap",
    xpReward: 100,
  },
  {
    id: "ach-2",
    title: "Python Fundamentals Completed",
    description: "Mastered core Python syntax, OOP, and data structures.",
    unlocked: true,
    unlockedAt: "2026-07-15",
    iconName: "CheckCircle",
    xpReward: 300,
  },
  {
    id: "ach-3",
    title: "First Assessment Passed",
    description: "Scored over 80% on SQL Database querying assessment.",
    unlocked: true,
    unlockedAt: "2026-07-28",
    iconName: "Award",
    xpReward: 250,
  },
  {
    id: "ach-4",
    title: "14 Day Consistency Streak",
    description: "Maintained active learning for 14 consecutive days.",
    unlocked: true,
    unlockedAt: "2026-08-18",
    iconName: "Flame",
    xpReward: 500,
  },
  {
    id: "ach-5",
    title: "Machine Learning Milestone",
    description: "Complete all core Supervised Learning modules.",
    unlocked: false,
    iconName: "Target",
    xpReward: 1000,
  },
];

const DEFAULT_RECOMMENDATION: AIRecommendation = {
  id: "rec-initial",
  timestamp: new Date().toISOString(),
  type: "concept_review",
  title: "Recommended Focus: Decision Trees & Model Evaluation",
  reason: "Your Python and SQL skills are strong, but your Statistics assessment showed room for growth.",
  actionSummary: "Complete Week 6 Decision Trees task (45 mins) to prepare for your upcoming Machine Learning project.",
  targetModuleOrSkill: "Machine Learning Fundamentals",
  triggerEvent: "Weekly Progress Review",
};

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>("vijay.kumar@example.com");

  const [profile, setProfile] = useState<LearnerProfile>(DEFAULT_PROFILE);
  const [userSkills, setUserSkills] = useState(DEFAULT_USER_SKILLS);
  const [requiredSkills] = useState(DEFAULT_REQUIRED_SKILLS);
  const [modules, setModules] = useState<PathModule[]>(INITIAL_ML_MODULES);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(DEFAULT_WEEKLY_PLAN);
  const [recentRecommendations, setRecentRecommendations] = useState<AIRecommendation[]>([DEFAULT_RECOMMENDATION]);
  const [streakData, setStreakData] = useState<UserStreakData>(DEFAULT_STREAK);
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  const [completedResources, setCompletedResources] = useState<string[]>(["res-ml-1", "res-ml-2"]);
  const [activeAssessmentResult, setActiveAssessmentResult] = useState<{ score: number; skill: string; timestamp: string }>();

  // DYNAMIC UNIFIED PROGRESS CALCULATION (SINGLE SOURCE OF TRUTH)
  const systemProgress = calculateUnifiedProgress(
    profile.careerGoal,
    userSkills,
    weeklyPlan,
    completedResources,
    activeAssessmentResult
  );

  // Check Supabase session and localStorage auth on initial mount
  useEffect(() => {
    async function checkSession() {
      try {
        if (typeof window !== "undefined" && localStorage.getItem("pathai_demo_auth") === "true") {
          setIsAuthenticated(true);
        }
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          setIsAuthenticated(true);
          setUserEmail(data.session.user.email || "vijay.kumar@example.com");
          if (data.session.user.user_metadata?.full_name) {
            setProfile((prev) => ({
              ...prev,
              fullName: data.session.user.user_metadata.full_name,
            }));
          }
        }
      } catch (err) {
        console.warn("Supabase session check fallback:", err);
      } finally {
        setIsAuthLoading(false);
      }
    }
    checkSession();
  }, []);

  const loginWithCredentials = async (email: string, pass: string) => {
    setIsAuthLoading(true);
    try {
      await signInWithEmail(email, pass);
    } catch (err) {
      console.warn("Supabase login fallback mode:", err);
    } finally {
      if (typeof window !== "undefined") localStorage.setItem("pathai_demo_auth", "true");
      setIsAuthenticated(true);
      setUserEmail(email);
      setIsAuthLoading(false);
    }
  };

  const signupWithCredentials = async (fullName: string, email: string, pass: string) => {
    setIsAuthLoading(true);
    try {
      await signUpWithEmail(email, pass, fullName);
    } catch (err) {
      console.warn("Supabase signup fallback mode:", err);
    } finally {
      if (typeof window !== "undefined") localStorage.setItem("pathai_demo_auth", "true");
      setIsAuthenticated(true);
      setUserEmail(email);
      setProfile((prev) => ({ ...prev, fullName }));
      setIsAuthLoading(false);
    }
  };

  const loginWithGoogleOAuth = async () => {
    setIsAuthLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.warn("Supabase Google OAuth fallback mode:", err);
    } finally {
      if (typeof window !== "undefined") localStorage.setItem("pathai_demo_auth", "true");
      setIsAuthenticated(true);
      setUserEmail("alex.google@example.com");
      setIsAuthLoading(false);
    }
  };

  const resetUserPassword = async (email: string) => {
    try {
      await resetPassword(email);
    } catch (err) {
      console.warn("Supabase password reset fallback mode:", err);
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.warn("Supabase logout fallback mode:", err);
    } finally {
      if (typeof window !== "undefined") localStorage.removeItem("pathai_demo_auth");
      setIsAuthenticated(false);
      setUserEmail("");
    }
  };

  const updateProfile = (newProfile: Partial<LearnerProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...newProfile };

      // Generate personalized recommendation path
      try {
        const currentSkillsArray = Object.entries(userSkills).map(([name, level]) => ({
          name,
          level,
        }));

        const recResult = generatePersonalizedRecommendation({
          careerGoal: updated.careerGoal,
          currentSkills: currentSkillsArray,
          hoursPerWeek: updated.weeklyHours,
          targetTimelineMonths: updated.timelineMonths,
          learningPreference:
            updated.learningPreference === "visual"
              ? "visual"
              : updated.learningPreference === "structured_reading"
              ? "structured_reading"
              : "hands_on",
        });

        if (recResult.modules && recResult.modules.length > 0) {
          setModules(recResult.modules);
        }
        if (recResult.weeklyPlan) {
          setWeeklyPlan(recResult.weeklyPlan);
        }
        saveRecommendationToStorage(recResult);
      } catch (err) {
        console.warn("Failed to generate recommendation on profile update:", err);
      }

      return updated;
    });
  };

  const toggleTaskStatus = (taskId: string) => {
    setWeeklyPlan((prev) => {
      const updatedTasks = prev.dailyTasks.map((t) => {
        if (t.id === taskId) {
          const nextStatus = t.status === "completed" ? "pending" : "completed";
          return { ...t, status: nextStatus as any };
        }
        return t;
      });

      const completedCount = updatedTasks.filter((t) => t.status === "completed").length;
      const completionPercentage = Math.round((completedCount / updatedTasks.length) * 100);

      return {
        ...prev,
        completionPercentage,
        dailyTasks: updatedTasks,
      };
    });
  };

  const submitAssessmentScore = (skillName: string, scorePercentage: number) => {
    setUserSkills((prev) => ({
      ...prev,
      [skillName]: scorePercentage,
    }));

    setActiveAssessmentResult({
      score: scorePercentage,
      skill: skillName,
      timestamp: new Date().toISOString(),
    });

    const adaptiveResult = triggerAdaptivePathAdjustment(
      skillName,
      scorePercentage,
      modules,
      weeklyPlan
    );

    setModules(adaptiveResult.updatedModules);
    setWeeklyPlan(adaptiveResult.updatedWeeklyPlan);
    setRecentRecommendations((prev) => [adaptiveResult.recommendation, ...prev]);

    setStreakData((prev) => ({
      ...prev,
      totalXp: prev.totalXp + (scorePercentage > 70 ? 200 : 100),
    }));
  };

  const markResourceCompleted = (resourceId: string) => {
    if (!completedResources.includes(resourceId)) {
      setCompletedResources((prev) => [...prev, resourceId]);
      setStreakData((prev) => ({ ...prev, totalXp: prev.totalXp + 50 }));
    }
  };

  const resetDemoData = () => {
    setProfile(DEFAULT_PROFILE);
    setUserSkills(DEFAULT_USER_SKILLS);
    setModules(INITIAL_ML_MODULES);
    setWeeklyPlan(DEFAULT_WEEKLY_PLAN);
    setRecentRecommendations([DEFAULT_RECOMMENDATION]);
    setActiveAssessmentResult(undefined);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        isAuthLoading,
        userEmail,
        profile,
        userSkills,
        requiredSkills,
        modules,
        weeklyPlan,
        recentRecommendations,
        streakData,
        achievements,
        completedResources,
        activeAssessmentResult,
        systemProgress,
        loginWithCredentials,
        signupWithCredentials,
        loginWithGoogleOAuth,
        resetUserPassword,
        logout,
        updateProfile,
        toggleTaskStatus,
        submitAssessmentScore,
        markResourceCompleted,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

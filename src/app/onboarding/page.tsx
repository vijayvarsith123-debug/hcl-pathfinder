"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Brain,
  Check,
  Clock,
  Calendar,
  Layers,
  BookOpen,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { parseCareerGoalWithAI } from "@/lib/ai-service";

import { AuthGuard } from "@/components/auth/AuthGuard";

export default function OnboardingPage() {
  const router = useRouter();
  const { updateProfile } = useApp();

  const [step, setStep] = useState(1);
  const [goalText, setGoalText] = useState("I want to become a Machine Learning Engineer within 8 months.");
  const [experienceLevel, setExperienceLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["Python", "SQL", "Basic Mathematics"]);
  const [weeklyHours, setWeeklyHours] = useState(8);
  const [learningPreference, setLearningPreference] = useState("hands_on");
  const [timelineMonths, setTimelineMonths] = useState(8);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [extractedInfo, setExtractedInfo] = useState<any>(null);

  const availableSkillsList = [
    "Python",
    "SQL",
    "Basic Mathematics",
    "Linear Algebra",
    "Statistics",
    "NumPy & Pandas",
    "Scikit-Learn",
    "PyTorch",
    "Java",
    "JavaScript",
    "Linux / Bash",
    "Git & GitHub",
    "HTML & CSS",
    "Docker Basics",
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleNextStep = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      // Final Step -> Trigger AI Analysis Loading State
      runAIAnalysis();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(15);

    // Call AI service to parse career goal
    const parsed = await parseCareerGoalWithAI(goalText);
    setExtractedInfo(parsed);

    // Animate status checks
    setTimeout(() => setAnalysisProgress(40), 600);
    setTimeout(() => setAnalysisProgress(75), 1200);
    setTimeout(() => {
      setAnalysisProgress(100);
      updateProfile({
        careerGoal: parsed.extractedCareer || goalText,
        experienceLevel,
        existingSkills: selectedSkills,
        weeklyHours,
        timelineMonths,
      });
    }, 1800);
  };

  const handleCompleteOnboarding = () => {
    router.push("/assessments");
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-2">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Compass className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Path<span className="text-blue-600">AI</span>
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Personalized Onboarding Engine</p>
        </div>

        {/* ANALYZING STATE */}
        {isAnalyzing ? (
          <Card className="shadow-lg border-slate-200 bg-white">
            <CardContent className="py-12 px-8 text-center space-y-8">
              <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 mx-auto flex items-center justify-center shadow-sm">
                <Brain className="h-8 w-8 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {analysisProgress === 100
                    ? "Your Personalized Learning Path Is Ready!"
                    : "Analyzing Your Learning Profile..."}
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {analysisProgress === 100
                    ? `Mapped ${extractedInfo?.extractedSkills?.length || 8} skill modules for ${extractedInfo?.extractedCareer || "Machine Learning Engineer"}.`
                    : "Evaluating natural language goal, calculating skill gaps, and ordering prerequisite modules."}
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <ProgressBar value={analysisProgress} size="lg" variant="primary" showPercentage />
              </div>

              {/* Status Checklist */}
              <div className="max-w-sm mx-auto space-y-3 text-left pt-2">
                <div className={`flex items-center gap-3 text-xs font-medium ${analysisProgress >= 25 ? "text-emerald-700 font-semibold" : "text-slate-400"}`}>
                  <CheckCircle2 className={`h-4 w-4 ${analysisProgress >= 25 ? "text-emerald-600" : "text-slate-300"}`} />
                  <span>Parsing natural language career goal</span>
                </div>
                <div className={`flex items-center gap-3 text-xs font-medium ${analysisProgress >= 50 ? "text-emerald-700 font-semibold" : "text-slate-400"}`}>
                  <CheckCircle2 className={`h-4 w-4 ${analysisProgress >= 50 ? "text-emerald-600" : "text-slate-300"}`} />
                  <span>Evaluating existing skill proficiencies</span>
                </div>
                <div className={`flex items-center gap-3 text-xs font-medium ${analysisProgress >= 75 ? "text-emerald-700 font-semibold" : "text-slate-400"}`}>
                  <CheckCircle2 className={`h-4 w-4 ${analysisProgress >= 75 ? "text-emerald-600" : "text-slate-300"}`} />
                  <span>Calculating skill gap vector and weekly hours</span>
                </div>
                <div className={`flex items-center gap-3 text-xs font-medium ${analysisProgress >= 100 ? "text-emerald-700 font-semibold" : "text-slate-400"}`}>
                  <CheckCircle2 className={`h-4 w-4 ${analysisProgress >= 100 ? "text-emerald-600" : "text-slate-300"}`} />
                  <span>Generating prerequisite-aware roadmap</span>
                </div>
              </div>

              {analysisProgress === 100 && (
                <div className="pt-4">
                  <Button
                    size="lg"
                    variant="primary"
                    onClick={handleCompleteOnboarding}
                    className="w-full sm:w-auto px-8 shadow-md"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Start Diagnostic Assessment & View Roadmap
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          /* MULTI-STEP CARD */
          <Card className="shadow-lg border-slate-200 bg-white overflow-hidden">
            {/* Step Progress Bar */}
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-100/80 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Step {step} of 6
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  {step === 1 && "Career Goal"}
                  {step === 2 && "Experience Level"}
                  {step === 3 && "Existing Skills"}
                  {step === 4 && "Weekly Hours"}
                  {step === 5 && "Learning Preference"}
                  {step === 6 && "Target Timeline"}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono font-medium">{Math.round((step / 6) * 100)}%</span>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* STEP 1: CAREER GOAL */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">What do you want to achieve?</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Describe your career ambition in natural language. Our AI will parse the exact skills required.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <textarea
                      rows={4}
                      value={goalText}
                      onChange={(e) => setGoalText(e.target.value)}
                      placeholder="e.g. I want to become a Machine Learning Engineer within 8 months."
                      className="w-full rounded-xl border border-slate-300 p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-800 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
                    <span>Demo preset loaded: <strong>Machine Learning Engineer</strong></span>
                  </div>
                </div>
              )}

              {/* STEP 2: EXPERIENCE LEVEL */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">What is your current experience level?</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      This helps PathAI set the baseline depth for recommended resources.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {[
                      {
                        level: "Beginner",
                        desc: "New to programming and computer science foundations.",
                      },
                      {
                        level: "Intermediate",
                        desc: "Familiar with Python programming, basic math, and databases.",
                      },
                      {
                        level: "Advanced",
                        desc: "Experienced developer looking to pivot or master specialized AI skills.",
                      },
                    ].map((item) => (
                      <div
                        key={item.level}
                        onClick={() => setExperienceLevel(item.level as any)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          experienceLevel === item.level
                            ? "bg-blue-50 border-blue-600 ring-1 ring-blue-500 text-slate-900"
                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        <div>
                          <div className="text-sm font-bold text-slate-900">{item.level}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                        </div>
                        {experienceLevel === item.level && (
                          <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: EXISTING SKILLS */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">What skills do you already have?</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Select all skills you are comfortable with to skip redundant intro topics.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {availableSkillsList.map((skill) => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: WEEKLY HOURS */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">How much time can you learn each week?</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      PathAI will structure your weekly learning plans to fit your schedule.
                    </p>
                  </div>

                  <div className="text-center p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="text-4xl font-extrabold text-blue-600">{weeklyHours} <span className="text-lg text-slate-600 font-semibold">hours / week</span></div>
                    <p className="text-xs text-slate-500">
                      (~{Math.round((weeklyHours / 7) * 10) / 10} hours per day)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="range"
                      min={2}
                      max={20}
                      step={1}
                      value={weeklyHours}
                      onChange={(e) => setWeeklyHours(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                      <span>2 hrs/wk (Casual)</span>
                      <span>8 hrs/wk (Recommended)</span>
                      <span>20 hrs/wk (Intensive)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: LEARNING PREFERENCES */}
              {step === 5 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">How do you prefer learning?</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Resource recommendations will prioritize your preferred content format.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "hands_on", label: "Hands-on Practice & Code", icon: Code },
                      { id: "visual", label: "Video Tutorials & Visuals", icon: BookOpen },
                      { id: "structured_reading", label: "Articles & Documentation", icon: Layers },
                      { id: "mixed", label: "Balanced Mix of All Formats", icon: Sparkles },
                    ].map((pref) => {
                      const Icon = pref.icon;
                      const isSelected = learningPreference === pref.id;
                      return (
                        <div
                          key={pref.id}
                          onClick={() => setLearningPreference(pref.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                            isSelected
                              ? "bg-blue-50 border-blue-600 text-blue-900 font-bold"
                              : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-semibold">{pref.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 6: TIMELINE */}
              {step === 6 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">What is your target timeline?</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Choose a target timeframe to achieve your career goal.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { months: 3, label: "3 Months", desc: "Fast-track sprint" },
                      { months: 6, label: "6 Months", desc: "Steady pace" },
                      { months: 8, label: "8 Months", desc: "Recommended for ML" },
                      { months: 12, label: "1 Year", desc: "In-depth mastery" },
                    ].map((item) => (
                      <div
                        key={item.months}
                        onClick={() => setTimelineMonths(item.months)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all text-center ${
                          timelineMonths === item.months
                            ? "bg-blue-50 border-blue-600 text-blue-900 font-bold ring-1 ring-blue-500"
                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        <div className="text-base font-extrabold text-slate-900">{item.label}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handlePrevStep}
                  disabled={step === 1}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  Back
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  onClick={handleNextStep}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  {step === 6 ? "Generate Personalized Path" : "Next Step"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  </AuthGuard>
  );
}

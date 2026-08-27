"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Upload,
  FileText,
  AlertCircle,
  Search,
  Check,
  Clock,
  Calendar,
  Layers,
  BookOpen,
  Code,
  Edit3,
  Bot,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { AuthGuard } from "@/components/auth/AuthGuard";

import {
  StructuredLearnerProfile,
  CurrentSkillInput,
  SkillProficiencyLevel,
} from "@/lib/profiling/types";
import {
  SKILL_TAXONOMY,
  TaxonomySkill,
  searchTaxonomySkills,
  normalizeSkillToTaxonomy,
} from "@/lib/profiling/skill-taxonomy";

export default function OnboardingPage() {
  const router = useRouter();
  const { updateProfile } = useApp();

  // Step state: 1 to 10
  const [step, setStep] = useState<number>(1);

  // ─── 8 LOCKED PROFILE INPUT STATES ──────────────────────────────────────────
  // 1. Career Goal
  const [careerGoal, setCareerGoal] = useState<string>("Machine Learning Engineer");

  // 2. LinkedIn Profile PDF State
  const [isUploadingPdf, setIsUploadingPdf] = useState<boolean>(false);
  const [pdfFileName, setPdfFileName] = useState<string>("");
  const [pdfUploaded, setPdfUploaded] = useState<boolean>(false);
  const [pdfExtractedSkillCount, setPdfExtractedSkillCount] = useState<number>(0);
  const [pdfError, setPdfError] = useState<string>("");

  // 3. Current Skills (Selected Taxonomy Skills)
  const [selectedSkillsMap, setSelectedSkillsMap] = useState<Map<string, TaxonomySkill>>(new Map());
  const [skillSearchQuery, setSkillSearchQuery] = useState<string>("");

  // 4. Skill Levels (Level for every selected skill: Beginner, Intermediate, Advanced)
  const [skillLevelsMap, setSkillLevelsMap] = useState<Map<string, SkillProficiencyLevel>>(new Map());

  // 5. Interests
  const [interests, setInterests] = useState<string[]>(["Computer Vision", "MLOps"]);

  // 6. Learning Preferences
  const [learningPreferences, setLearningPreferences] = useState<string[]>(["Videos", "Hands-on Practice"]);

  // 7. Time Availability
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(8);

  // 8. Target Timeline
  const [timelineMonths, setTimelineMonths] = useState<number>(6);

  // Final Structured Profile output state
  const [finalStructuredProfile, setFinalStructuredProfile] = useState<StructuredLearnerProfile | null>(null);

  // Populate initial default skills
  useEffect(() => {
    const pySkill = SKILL_TAXONOMY.find((s) => s.skill_id === "PY001");
    const sqlSkill = SKILL_TAXONOMY.find((s) => s.skill_id === "SQL001");
    const mlSkill = SKILL_TAXONOMY.find((s) => s.skill_id === "ML001");

    const initialMap = new Map<string, TaxonomySkill>();
    const levelMap = new Map<string, SkillProficiencyLevel>();

    if (pySkill) {
      initialMap.set(pySkill.skill_id, pySkill);
      levelMap.set(pySkill.skill_id, "Intermediate");
    }
    if (sqlSkill) {
      initialMap.set(sqlSkill.skill_id, sqlSkill);
      levelMap.set(sqlSkill.skill_id, "Intermediate");
    }
    if (mlSkill) {
      initialMap.set(mlSkill.skill_id, mlSkill);
      levelMap.set(mlSkill.skill_id, "Beginner");
    }

    setSelectedSkillsMap(initialMap);
    setSkillLevelsMap(levelMap);
  }, []);

  // Handle PDF Upload
  const handlePdfFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfError("");
    setIsUploadingPdf(true);

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setPdfError("Please upload a valid PDF file exported from LinkedIn.");
      setIsUploadingPdf(false);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPdfError("File size exceeds 5MB limit.");
      setIsUploadingPdf(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/profiling/parse-linkedin-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.normalizedSkills) {
        setPdfFileName(data.fileName || file.name);
        setPdfUploaded(true);
        setPdfExtractedSkillCount(data.normalizedSkills.length);

        // Pre-select matching skills for Step 3
        const updatedSkillsMap = new Map(selectedSkillsMap);
        const updatedLevelsMap = new Map(skillLevelsMap);

        for (const skill of data.normalizedSkills) {
          const taxSkill = SKILL_TAXONOMY.find((s) => s.skill_id === skill.skill_id);
          if (taxSkill) {
            updatedSkillsMap.set(taxSkill.skill_id, taxSkill);
            if (!updatedLevelsMap.has(taxSkill.skill_id)) {
              updatedLevelsMap.set(taxSkill.skill_id, "Beginner");
            }
          }
        }

        setSelectedSkillsMap(updatedSkillsMap);
        setSkillLevelsMap(updatedLevelsMap);
      } else {
        setPdfError(data.error || "Unable to extract skills from this PDF. You can select your skills manually.");
      }
    } catch (err: any) {
      setPdfError("Unable to extract skills from this PDF. You can select your skills manually.");
    } finally {
      setIsUploadingPdf(false);
    }
  };

  // Toggle skill selection
  const toggleSkill = (skill: TaxonomySkill) => {
    const nextSkillsMap = new Map(selectedSkillsMap);
    const nextLevelsMap = new Map(skillLevelsMap);

    if (nextSkillsMap.has(skill.skill_id)) {
      nextSkillsMap.delete(skill.skill_id);
      nextLevelsMap.delete(skill.skill_id);
    } else {
      nextSkillsMap.set(skill.skill_id, skill);
      nextLevelsMap.set(skill.skill_id, "Beginner");
    }

    setSelectedSkillsMap(nextSkillsMap);
    setSkillLevelsMap(nextLevelsMap);
  };

  // Set skill level
  const setSkillLevel = (skillId: string, level: SkillProficiencyLevel) => {
    const nextLevelsMap = new Map(skillLevelsMap);
    nextLevelsMap.set(skillId, level);
    setSkillLevelsMap(nextLevelsMap);
  };

  // Toggle Interest
  const toggleInterest = (item: string) => {
    if (interests.includes(item)) {
      setInterests(interests.filter((i) => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  };

  // Toggle Learning Preference
  const togglePreference = (pref: string) => {
    if (learningPreferences.includes(pref)) {
      setLearningPreferences(learningPreferences.filter((p) => p !== pref));
    } else {
      setLearningPreferences([...learningPreferences, pref]);
    }
  };

  // Step Validation Check
  const canProceedFromStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return Boolean(careerGoal.trim());
      case 2:
        return true; // LinkedIn upload is optional
      case 3:
        return selectedSkillsMap.size > 0; // At least 1 skill selected
      case 4:
        // Every selected skill must have a level
        return Array.from(selectedSkillsMap.keys()).every((id) => skillLevelsMap.has(id));
      case 5:
        return interests.length > 0;
      case 6:
        return learningPreferences.length > 0;
      case 7:
        return hoursPerWeek >= 2 && hoursPerWeek <= 40;
      case 8:
        return timelineMonths >= 1 && timelineMonths <= 24;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (!canProceedFromStep(step)) return;

    if (step < 9) {
      setStep(step + 1);
    } else if (step === 9) {
      // Step 9 -> Build Final Structured Profile and Save
      const currentSkillsArray: CurrentSkillInput[] = Array.from(selectedSkillsMap.values()).map((skill) => ({
        skill_id: skill.skill_id,
        name: skill.name,
        level: skillLevelsMap.get(skill.skill_id) || "Beginner",
      }));

      const structuredProfile: StructuredLearnerProfile = {
        career_goal: careerGoal,
        current_skills: currentSkillsArray,
        interests,
        learning_preferences: learningPreferences,
        time_availability: {
          hours_per_week: hoursPerWeek,
        },
        target_timeline: {
          months: timelineMonths,
        },
        linkedin_profile: {
          uploaded: pdfUploaded,
          fileName: pdfFileName || undefined,
          extracted_skill_count: pdfExtractedSkillCount || undefined,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setFinalStructuredProfile(structuredProfile);

      // Save to AppContext & LocalStorage
      updateProfile({
        careerGoal,
        experienceLevel: "Intermediate",
        existingSkills: currentSkillsArray.map((s) => s.name),
        weeklyHours: hoursPerWeek,
        timelineMonths,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("pathai_structured_profile", JSON.stringify(structuredProfile));
      }

      setStep(10);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const jumpToStep = (targetStep: number) => {
    setStep(targetStep);
  };

  const availableInterests = [
    "Computer Vision",
    "Natural Language Processing",
    "Generative AI",
    "Data Science",
    "MLOps",
    "Cloud & DevOps",
    "System Architecture",
    "Robotics",
  ];

  const availablePreferences = [
    "Videos",
    "Articles",
    "Documentation",
    "Hands-on Practice",
  ];

  const selectedSkillsList = Array.from(selectedSkillsMap.values());

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
        <div className="max-w-3xl mx-auto w-full space-y-6">
          {/* Header Branding */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2.5 mb-1">
              <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
                <Compass className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Path<span className="text-blue-600 dark:text-blue-400">AI</span>
              </span>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#CBD5E1]">
              Learner Profiling Module
            </p>
          </div>

          {/* MAIN MULTI-STEP CARD */}
          <Card className="shadow-lg border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033] overflow-hidden rounded-2xl">
            {/* Step Progress Header */}
            <div className="bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#273449] p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-500/30">
                  Step {step} of 10
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-white hidden sm:inline">
                  {step === 1 && "1. Career Goal"}
                  {step === 2 && "2. LinkedIn Profile PDF"}
                  {step === 3 && "3. Current Skills"}
                  {step === 4 && "4. Skill Levels"}
                  {step === 5 && "5. Interests"}
                  {step === 6 && "6. Learning Preferences"}
                  {step === 7 && "7. Time Availability"}
                  {step === 8 && "8. Target Timeline"}
                  {step === 9 && "9. Profile Review"}
                  {step === 10 && "10. Complete Profile"}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-[#CBD5E1] font-mono font-bold">
                {Math.round((step / 10) * 100)}%
              </span>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* STEP 1: CAREER GOAL */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">What is your Target Career Goal?</h2>
                    <p className="text-xs text-slate-600 dark:text-[#CBD5E1] mt-1">
                      Specify the career path you are striving to achieve.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      "Machine Learning Engineer",
                      "Software Developer",
                      "Data Analyst",
                    ].map((target) => (
                      <div
                        key={target}
                        onClick={() => setCareerGoal(target)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          careerGoal === target
                            ? "bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 ring-1 ring-blue-500 text-slate-900 dark:text-white"
                            : "bg-white dark:bg-[#1E293B] border-slate-200 dark:border-[#273449] hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-[#CBD5E1]"
                        }`}
                      >
                        <span className="text-sm font-extrabold">{target}</span>
                        {careerGoal === target && (
                          <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 space-y-1">
                    <label className="block text-xs font-bold text-slate-800 dark:text-[#F8FAFC]">Custom Career Goal</label>
                    <input
                      type="text"
                      value={careerGoal}
                      onChange={(e) => setCareerGoal(e.target.value)}
                      placeholder="e.g. Full-Stack Developer, AI Researcher"
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#1E293B] text-xs text-slate-900 dark:text-[#F8FAFC] placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: LINKEDIN PROFILE PDF */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Upload LinkedIn Profile PDF</h2>
                    <p className="text-xs text-slate-600 dark:text-[#CBD5E1] mt-1">
                      Upload your LinkedIn Profile PDF to automatically extract and pre-select your current skills. (Optional)
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-[#273449] bg-slate-50/50 dark:bg-[#111827] text-center space-y-3">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 mx-auto flex items-center justify-center shadow-xs">
                      {isUploadingPdf ? (
                        <Sparkles className="h-6 w-6 animate-pulse" />
                      ) : pdfUploaded ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                      ) : (
                        <Upload className="h-6 w-6" />
                      )}
                    </div>

                    {isUploadingPdf ? (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Analyzing profile PDF...</p>
                        <p className="text-[11px] text-slate-500">Extracting and normalizing skills against standard taxonomy</p>
                      </div>
                    ) : pdfUploaded ? (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">PDF Uploaded & Extracted Successfully!</p>
                        <p className="text-[11px] text-slate-600 dark:text-[#CBD5E1]">
                          File: <strong>{pdfFileName}</strong> ({pdfExtractedSkillCount} skills detected)
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          Select or drag your LinkedIn Profile PDF file here
                        </p>
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 cursor-pointer shadow-xs">
                          <FileText className="h-4 w-4" />
                          <span>Choose PDF File</span>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handlePdfFileUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-[10px] text-slate-400">Accepts .pdf files only (Max 5MB)</p>
                      </div>
                    )}

                    {pdfError && (
                      <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{pdfError}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>
                      LinkedIn provides skill suggestions. You remain the final authority to confirm or edit skills.
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 3: CURRENT SKILLS */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Confirm Your Current Skills</h2>
                    <p className="text-xs text-slate-600 dark:text-[#CBD5E1] mt-1">
                      Skills detected from LinkedIn are pre-selected below. Add or remove skills from the standard taxonomy.
                    </p>
                  </div>

                  {/* SEARCH BAR */}
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={skillSearchQuery}
                      onChange={(e) => setSkillSearchQuery(e.target.value)}
                      placeholder="Search standard skill taxonomy (e.g. Python, SQL, Docker, ML)..."
                      className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#1E293B] text-xs text-slate-900 dark:text-[#F8FAFC] placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  {/* ACTIVE CONFIRMED SKILLS BADGES */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-[#F8FAFC]">
                      <span>Selected Skills ({selectedSkillsMap.size})</span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">Step 3 of 10</span>
                    </div>
                    <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] min-h-[50px]">
                      {selectedSkillsList.length === 0 ? (
                        <p className="text-xs text-slate-400">No skills selected. Select skills from the catalog below.</p>
                      ) : (
                        selectedSkillsList.map((skill) => (
                          <button
                            key={skill.skill_id}
                            onClick={() => toggleSkill(skill)}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-rose-600 transition-colors"
                            title="Click to remove skill"
                          >
                            <Check className="h-3 w-3" />
                            <span>{skill.name}</span>
                            <span className="text-[10px] text-blue-200 font-mono">✕</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* TAXONOMY CATALOG SELECTOR */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-800 dark:text-[#F8FAFC]">Standard Skill Taxonomy Catalog</p>
                    <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-1">
                      {searchTaxonomySkills(skillSearchQuery).map((skill) => {
                        const isSelected = selectedSkillsMap.has(skill.skill_id);
                        return (
                          <button
                            key={skill.skill_id}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                : "bg-white dark:bg-[#1E293B] text-slate-800 dark:text-[#F8FAFC] border-slate-200 dark:border-[#273449] hover:bg-slate-50 dark:hover:bg-[#273449]"
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                            <span>{skill.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: SKILL LEVELS */}
              {step === 4 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Specify Skill Levels</h2>
                    <p className="text-xs text-slate-600 dark:text-[#CBD5E1] mt-1">
                      Select your current proficiency level for every confirmed skill.
                    </p>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {selectedSkillsList.map((skill) => {
                      const currentLevel = skillLevelsMap.get(skill.skill_id) || "Beginner";
                      return (
                        <div
                          key={skill.skill_id}
                          className="p-4 rounded-xl border border-slate-200 dark:border-[#273449] bg-slate-50/50 dark:bg-[#111827] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <span className="text-sm font-extrabold text-slate-900 dark:text-white">{skill.name}</span>
                            <span className="text-[10px] text-slate-500 ml-2 font-mono">({skill.category})</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {(["Beginner", "Intermediate", "Advanced"] as SkillProficiencyLevel[]).map((lvl) => {
                              const isSelected = currentLevel === lvl;
                              return (
                                <button
                                  key={lvl}
                                  type="button"
                                  onClick={() => setSkillLevel(skill.skill_id, lvl)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                    isSelected
                                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                      : "bg-white dark:bg-[#1E293B] text-slate-700 dark:text-[#CBD5E1] border-slate-200 dark:border-[#273449] hover:bg-slate-100 dark:hover:bg-[#273449]"
                                  }`}
                                >
                                  {lvl}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: INTERESTS */}
              {step === 5 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Select Your Areas of Interest</h2>
                    <p className="text-xs text-slate-600 dark:text-[#CBD5E1] mt-1">
                      Select one or more domain interests.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableInterests.map((item) => {
                      const isSelected = interests.includes(item);
                      return (
                        <div
                          key={item}
                          onClick={() => toggleInterest(item)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 ring-1 ring-blue-500 text-slate-900 dark:text-white font-bold"
                              : "bg-white dark:bg-[#1E293B] border-slate-200 dark:border-[#273449] text-slate-700 dark:text-[#CBD5E1] hover:border-slate-300"
                          }`}
                        >
                          <span className="text-xs font-bold">{item}</span>
                          {isSelected && (
                            <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 6: LEARNING PREFERENCES */}
              {step === 6 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Preferred Learning Formats</h2>
                    <p className="text-xs text-slate-600 dark:text-[#CBD5E1] mt-1">
                      Choose your preferred format for consuming educational material.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availablePreferences.map((pref) => {
                      const isSelected = learningPreferences.includes(pref);
                      return (
                        <div
                          key={pref}
                          onClick={() => togglePreference(pref)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 ring-1 ring-blue-500 text-slate-900 dark:text-white font-bold"
                              : "bg-white dark:bg-[#1E293B] border-slate-200 dark:border-[#273449] text-slate-700 dark:text-[#CBD5E1] hover:border-slate-300"
                          }`}
                        >
                          <span className="text-xs font-bold">{pref}</span>
                          {isSelected && (
                            <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 7: TIME AVAILABILITY */}
              {step === 7 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Time Availability</h2>
                    <p className="text-xs text-slate-600 dark:text-[#CBD5E1] mt-1">
                      How many hours per week can you dedicate to learning?
                    </p>
                  </div>

                  <div className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] space-y-2">
                    <div className="text-4xl font-black text-blue-600 dark:text-blue-400">
                      {hoursPerWeek} <span className="text-base text-slate-600 dark:text-[#CBD5E1] font-bold">hours / week</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      (~{Math.round((hoursPerWeek / 7) * 10) / 10} hours daily commitment)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="range"
                      min={2}
                      max={30}
                      step={1}
                      value={hoursPerWeek}
                      onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-[#273449] rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 font-bold">
                      <span>2 hrs/wk (Casual)</span>
                      <span>8 hrs/wk (Recommended)</span>
                      <span>30 hrs/wk (Intensive)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 8: TARGET TIMELINE */}
              {step === 8 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Target Timeline</h2>
                    <p className="text-xs text-slate-600 dark:text-[#CBD5E1] mt-1">
                      Target duration in months to reach your career goal.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { months: 3, label: "3 Months", desc: "Sprint" },
                      { months: 6, label: "6 Months", desc: "Standard" },
                      { months: 8, label: "8 Months", desc: "Recommended" },
                      { months: 12, label: "12 Months", desc: "Deep Dive" },
                    ].map((item) => (
                      <div
                        key={item.months}
                        onClick={() => setTimelineMonths(item.months)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all text-center ${
                          timelineMonths === item.months
                            ? "bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-slate-900 dark:text-white font-bold ring-1 ring-blue-500"
                            : "bg-white dark:bg-[#1E293B] border-slate-200 dark:border-[#273449] text-slate-700 dark:text-[#CBD5E1]"
                        }`}
                      >
                        <div className="text-base font-extrabold text-slate-900 dark:text-white">{item.label}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 9: PROFILE REVIEW */}
              {step === 9 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Profile Review</h2>
                    <p className="text-xs text-slate-600 dark:text-[#CBD5E1] mt-1">
                      Review all 8 locked profile inputs before saving your structured profile.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* 1. Career Goal */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500">1. Career Goal</span>
                        <div className="text-sm font-extrabold text-slate-900 dark:text-white">{careerGoal}</div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => jumpToStep(1)} className="h-8 text-xs text-blue-600">
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </Button>
                    </div>

                    {/* 2. LinkedIn Profile */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500">2. LinkedIn Profile PDF</span>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {pdfUploaded ? `Uploaded (${pdfFileName})` : "Not Uploaded (Manual Skills)"}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => jumpToStep(2)} className="h-8 text-xs text-blue-600">
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </Button>
                    </div>

                    {/* 3 & 4. Current Skills & Levels */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500">3 & 4. Current Skills & Skill Levels</span>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {selectedSkillsList.map((skill) => (
                            <span key={skill.skill_id} className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 text-xs font-bold text-blue-700 dark:text-blue-300">
                              {skill.name} — <em className="font-semibold text-slate-600 dark:text-slate-400">{skillLevelsMap.get(skill.skill_id) || "Beginner"}</em>
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => jumpToStep(3)} className="h-8 text-xs text-blue-600">
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </Button>
                    </div>

                    {/* 5. Interests */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500">5. Interests</span>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{interests.join(", ")}</div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => jumpToStep(5)} className="h-8 text-xs text-blue-600">
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </Button>
                    </div>

                    {/* 6. Learning Preferences */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500">6. Learning Preferences</span>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{learningPreferences.join(", ")}</div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => jumpToStep(6)} className="h-8 text-xs text-blue-600">
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </Button>
                    </div>

                    {/* 7. Time Availability */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500">7. Time Availability</span>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{hoursPerWeek} hours/week</div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => jumpToStep(7)} className="h-8 text-xs text-blue-600">
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </Button>
                    </div>

                    {/* 8. Target Timeline */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500">8. Target Timeline</span>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{timelineMonths} months</div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => jumpToStep(8)} className="h-8 text-xs text-blue-600">
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 10: COMPLETE PROFILE */}
              {step === 10 && finalStructuredProfile && (
                <div className="space-y-6 text-center py-4">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 mx-auto flex items-center justify-center shadow-xs">
                    <UserCheck className="h-8 w-8" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Learner Profile Successfully Created!
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-[#CBD5E1] max-w-md mx-auto">
                      Your 8 locked inputs have been validated, normalized, and saved into a structured learner profile.
                    </p>
                  </div>

                  {/* STRUCTURED JSON OUTPUT PREVIEW */}
                  <div className="text-left bg-slate-900 text-slate-100 p-4 rounded-2xl border border-slate-800 text-xs font-mono max-h-60 overflow-y-auto shadow-inner">
                    <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-2">
                      Structured Learner Profile Output JSON:
                    </div>
                    <pre>{JSON.stringify(finalStructuredProfile, null, 2)}</pre>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => router.push("/dashboard")}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs h-11 px-8"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Proceed to Dashboard
                    </Button>
                  </div>
                </div>
              )}

              {/* Navigation Actions Footer */}
              {step < 10 && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-[#273449]">
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
                    disabled={!canProceedFromStep(step)}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 px-6 shadow-xs"
                  >
                    {step === 9 ? "Confirm & Save Profile" : "Next Step"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Alert } from "@/components/ui/alert";
import { useApp } from "@/context/AppContext";
import {
  CheckSquare,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Award,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  BookOpen,
  ExternalLink,
  Target,
  BarChart3,
  Layers,
} from "lucide-react";
import { calculateSkillGaps } from "@/lib/recommendation-engine";
import { processAdaptiveAssessmentAnalysis, lastAnalysisLLMFailed } from "@/lib/adaptive/adaptive-engine";
import { generateAdaptedAssessment } from "@/lib/adaptive/assessment-adapter";
import { AdaptiveAssessmentResult, QuestionAttempt } from "@/lib/adaptive/types";

interface AssessmentQuestion {
  id: string;
  topic: string;
  subtopic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  isTargetedAddition?: boolean;
}

const REGULAR_DEMO_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "q1",
    topic: "Statistics & Probability",
    subtopic: "Hypothesis Testing & P-Values",
    question: "What does a P-value of 0.03 indicate when testing a null hypothesis at a significance level of alpha = 0.05?",
    options: [
      "The null hypothesis should be accepted.",
      "The null hypothesis should be rejected as the result is statistically significant.",
      "There is a 3% probability that the alternative hypothesis is false.",
      "The sample size is too small to draw a conclusion.",
    ],
    correctIndex: 1,
    explanation: "Since P-value (0.03) <= alpha (0.05), we reject the null hypothesis in favor of the alternative hypothesis.",
  },
  {
    id: "q2",
    topic: "Pandas",
    subtopic: "Filtering & Boolean Indexing",
    question: "In Pandas, how do you filter a DataFrame `df` for rows where column 'age' is greater than 20?",
    options: [
      "df.filter('age > 20')",
      "df[df['age'] > 20]",
      "df.where('age > 20')",
      "df.select(age > 20)",
    ],
    correctIndex: 1,
    explanation: "Boolean indexing in Pandas requires evaluating a boolean condition inside brackets: `df[df['age'] > 20]`.",
  },
  {
    topic: "Pandas",
    subtopic: "GroupBy & Aggregations",
    id: "q3",
    question: "What method in Pandas splits data into groups based on some criteria and applies an aggregation function?",
    options: ["pivot_table()", "groupby()", "melt()", "concat()"],
    correctIndex: 1,
    explanation: "`.groupby()` performs split-apply-combine operations on DataFrames.",
  },
  {
    id: "q4",
    topic: "Machine Learning",
    subtopic: "Decision Trees & Gini Impurity",
    question: "In Decision Trees, what metric measures the frequency at which a randomly chosen element from the set would be incorrectly labeled?",
    options: ["Mean Squared Error", "Gini Impurity", "R-Squared", "Cosine Similarity"],
    correctIndex: 1,
    explanation: "Gini Impurity measures how often a randomly chosen element would be incorrectly labeled according to the distribution of labels in the subset.",
  },
  {
    id: "q5",
    topic: "Python",
    subtopic: "Data Structures & Dictionaries",
    question: "What is the time complexity of looking up a key in a standard Python dictionary (hash map)?",
    options: ["O(1) average case", "O(N) average case", "O(log N)", "O(N^2)"],
    correctIndex: 0,
    explanation: "Python dictionary lookups use a hash table offering average time complexity of O(1).",
  },
];

export default function AssessmentsPage() {
  const { userSkills, requiredSkills, submitAssessmentScore, activeAssessmentResult, recentRecommendations } = useApp();

  // Active Assessment composition state
  const [assessmentQuestions, setAssessmentQuestions] = useState<AssessmentQuestion[]>(REGULAR_DEMO_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  // Adaptive Engine Analysis State
  const [adaptiveResult, setAdaptiveResult] = useState<AdaptiveAssessmentResult | null>(null);
  const [isAdaptiveAnalysisLoading, setIsAdaptiveAnalysisLoading] = useState(false);

  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const skillGaps = calculateSkillGaps(userSkills, requiredSkills);

  const handleSelectOption = (index: number) => {
    if (!isSubmitted) {
      setSelectedOption(index);
    }
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;
    setUserAnswers([...userAnswers, selectedOption]);
    setIsSubmitted(true);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Calculate overall assessment score & attempts
      const allAnswers = [...userAnswers, selectedOption!];

      const attempts: QuestionAttempt[] = assessmentQuestions.map((q, idx) => ({
        questionId: q.id,
        topicName: q.topic,
        subtopicName: q.subtopic,
        questionText: q.question,
        userAnswer: q.options[allAnswers[idx]],
        correctAnswer: q.options[q.correctIndex],
        isCorrect: allAnswers[idx] === q.correctIndex,
      }));

      setIsAdaptiveAnalysisLoading(true);
      setTestCompleted(true);

      // Run Adaptive Intelligence Engine
      const result = await processAdaptiveAssessmentAnalysis(attempts);
      setAdaptiveResult(result);
      setIsAdaptiveAnalysisLoading(false);

      // Update skill score in system
      submitAssessmentScore("Statistics", result.overallScore);
    }
  };

  const handleStartAdaptedAssessment = () => {
    // Generate next assessment adapted with weak subtopics
    const currentMastery = adaptiveResult?.subtopicMasteryList || [];
    const adaptedComposition = generateAdaptedAssessment(REGULAR_DEMO_QUESTIONS, currentMastery);

    setAssessmentQuestions(adaptedComposition.questions);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setUserAnswers([]);
    setTestCompleted(false);
  };

  return (
    <AppLayout>
      <div className="space-y-8 pb-12 font-sans transition-colors">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#273449] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary" className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30">
                Adaptive Assessment Engine
              </Badge>
              <span className="text-xs text-slate-500 dark:text-[#CBD5E1] font-medium">• Subtopic Mastery & Misconception Analysis</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Skill Assessments & Adaptive Intelligence</h1>
            <p className="text-xs text-slate-600 dark:text-[#CBD5E1] mt-1">
              Evaluates subtopic mastery, detects weak areas, identifies misconceptions, and adapts future assessment composition.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartAdaptedAssessment}
              leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
              className="border-slate-200 dark:border-[#273449]"
            >
              Generate Next Adapted Assessment
            </Button>
          </div>
        </div>

        {/* SKILL GAP & MASTERY OVERVIEW */}
        <Card className="shadow-xs border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Current Skill Profile & Benchmark Gap Analysis</CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-[#CBD5E1]">
                  Target Role: Machine Learning Engineer (Benchmark: 80% per core skill)
                </CardDescription>
              </div>
              <Badge variant="neutral" className="text-xs font-bold">
                Updated Real-Time
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {skillGaps.map((item) => (
                <div
                  key={item.skillName}
                  className={`p-4 rounded-xl border transition-all ${
                    item.priority === "High"
                      ? "bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-500/30"
                      : "bg-slate-50 dark:bg-[#111827] border-slate-200 dark:border-[#273449]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{item.skillName}</span>
                    <Badge
                      variant={item.priority === "High" ? "warning" : item.priority === "Medium" ? "primary" : "secondary"}
                      size="sm"
                    >
                      {item.gap}% Gap ({item.priority})
                    </Badge>
                  </div>

                  <div className="flex items-baseline justify-between text-xs mb-2">
                    <span className="text-slate-500 dark:text-[#CBD5E1]">Current: <strong className="text-slate-900 dark:text-white font-bold">{item.currentScore}%</strong></span>
                    <span className="text-slate-500 dark:text-[#CBD5E1]">Target: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{item.requiredScore}%</strong></span>
                  </div>

                  <ProgressBar
                    value={item.currentScore}
                    max={item.requiredScore}
                    size="sm"
                    variant={item.priority === "High" ? "warning" : "primary"}
                    showPercentage={false}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ASSESSMENT INTERFACE */}
        <Card className="shadow-md border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033]">
          <CardHeader className="border-b border-slate-100 dark:border-[#273449]/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center font-bold">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    Statistics & Machine Learning Diagnostic Assessment
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-[#CBD5E1]">
                    {assessmentQuestions.length} Questions • Subtopic Mastery Evaluation
                  </CardDescription>
                </div>
              </div>

              {!testCompleted && (
                <div className="text-xs font-bold text-slate-600 dark:text-[#CBD5E1]">
                  Question <span className="font-extrabold text-blue-600 dark:text-blue-400">{currentQuestionIndex + 1}</span> of {assessmentQuestions.length}
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {testCompleted ? (
              /* ADAPTIVE TEST RESULT VIEW */
              <div className="space-y-6">
                {/* 1. OVERALL SCORE SUMMARY */}
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-center space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 text-xs font-bold text-blue-700 dark:text-blue-300">
                    <Award className="h-4 w-4" />
                    <span>Assessment Completed</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                    Overall Score: {adaptiveResult?.overallScore || 0}%
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-[#CBD5E1] max-w-lg mx-auto">
                    Subtopic mastery updated. Weak subtopics are flagged below and will receive additional targeted questions in your next assessment.
                  </p>
                </div>

                {/* 2. SUBTOPIC MASTERY BREAKDOWN */}
                <div className="space-y-3">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Subtopic Performance & Mastery Status</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {adaptiveResult?.subtopicMasteryList.map((sub) => {
                      const isWeak = sub.status === "Weak";
                      const isMastered = sub.status === "Mastered";

                      return (
                        <div
                          key={sub.subtopicId}
                          className={`p-3.5 rounded-xl border transition-all ${
                            isWeak
                              ? "bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-500/30"
                              : isMastered
                              ? "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-500/30"
                              : "bg-slate-50 dark:bg-[#111827] border-slate-200 dark:border-[#273449]"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{sub.subtopicName}</span>
                            <Badge
                              variant={isWeak ? "danger" : isMastered ? "success" : "warning"}
                              className="text-[10px] py-0.5 px-2 font-bold uppercase"
                            >
                              {sub.status}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between text-xs font-mono mt-2">
                            <span className="text-slate-500 dark:text-[#CBD5E1]">Mastery: <strong className="text-slate-900 dark:text-white">{sub.masteryScore}%</strong></span>
                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-sans font-bold">Trend: {sub.trend}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. AI MISCONCEPTION INSIGHTS */}
                {adaptiveResult?.misconceptions && adaptiveResult.misconceptions.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 space-y-2 text-xs">
                    <div className="font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <span>AI Misconception Analysis & Insight</span>
                    </div>
                    {adaptiveResult.misconceptions.map((m, idx) => (
                      <div key={idx} className="space-y-0.5 text-slate-800 dark:text-[#CBD5E1]">
                        <p className="font-bold text-slate-900 dark:text-white">• {m.subtopicName}: {m.misconception}</p>
                        <p className="text-[11px] text-slate-600 dark:text-[#CBD5E1] pl-3">{m.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* GRACEFUL LLM FAILURE MESSAGE */}
                {lastAnalysisLLMFailed && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-xs text-slate-600 dark:text-[#CBD5E1] flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>AI insight is temporarily unavailable. Your assessment performance has still been recorded and mastery updated.</span>
                  </div>
                )}

                {/* 4. OPTIONAL SUPPORT RESOURCES (CLEARLY MARKED OPTIONAL) */}
                {adaptiveResult?.optionalSupportResources && adaptiveResult.optionalSupportResources.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span>Optional Support (Recommended for Improvement)</span>
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">100% Optional</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {adaptiveResult.optionalSupportResources.map((res) => (
                        <a
                          key={res.id}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3.5 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] hover:border-blue-500 transition-all group block space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">{res.title}</span>
                            <ExternalLink className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-[#CBD5E1] line-clamp-1">{res.description}</p>
                          <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 font-mono">{res.provider} · Optional Support</div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. FUTURE ASSESSMENT ADAPTATION NOTICE */}
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="font-bold">
                      These weak subtopics will receive additional targeted questions in your next assessment.
                    </span>
                  </div>
                  <Button variant="primary" size="sm" onClick={handleStartAdaptedAssessment} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0">
                    Take Adapted Assessment →
                  </Button>
                </div>
              </div>
            ) : (
              /* ACTIVE QUESTION VIEW */
              <div className="space-y-6">
                <ProgressBar
                  value={((currentQuestionIndex + 1) / assessmentQuestions.length) * 100}
                  size="sm"
                  showPercentage={false}
                />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" size="sm">
                      {currentQuestion.topic}
                    </Badge>
                    <span className="text-xs font-bold text-slate-600 dark:text-[#CBD5E1] font-mono">
                      Subtopic: {currentQuestion.subtopic}
                    </span>
                    {currentQuestion.isTargetedAddition && (
                      <Badge variant="warning" size="sm" className="text-[9px] py-0">
                        Targeted Practice Addition
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                    {currentQuestionIndex + 1}. {currentQuestion.question}
                  </h3>
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = isSubmitted && idx === currentQuestion.correctIndex;
                    const isWrong = isSubmitted && isSelected && idx !== currentQuestion.correctIndex;

                    return (
                      <div
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        className={`p-4 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                          isCorrect
                            ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200"
                            : isWrong
                            ? "bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200"
                            : isSelected
                            ? "bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-blue-900 dark:text-white ring-1 ring-blue-500"
                            : "bg-white dark:bg-[#1E293B] border-slate-200 dark:border-[#273449] hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-[#F8FAFC]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="h-6 w-6 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center font-bold text-[11px] shrink-0 bg-white dark:bg-[#172033]">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                      </div>
                    );
                  })}
                </div>

                {/* Question Explanation if submitted */}
                {isSubmitted && (
                  <Alert variant={selectedOption === currentQuestion.correctIndex ? "success" : "warning"}>
                    <p className="font-bold text-xs mb-1">
                      {selectedOption === currentQuestion.correctIndex ? "Correct Answer!" : "Incorrect"}
                    </p>
                    <p className="text-xs leading-relaxed">{currentQuestion.explanation}</p>
                  </Alert>
                )}

                {/* Footer Controls */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-[#273449]">
                  {!isSubmitted ? (
                    <Button
                      variant="primary"
                      onClick={handleConfirmAnswer}
                      disabled={selectedOption === null}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 px-6 shadow-xs"
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleNextQuestion}
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 px-6 shadow-xs"
                    >
                      {currentQuestionIndex === assessmentQuestions.length - 1 ? "Finish Assessment" : "Next Question"}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

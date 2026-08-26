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
} from "lucide-react";
import { calculateSkillGaps } from "@/lib/recommendation-engine";

interface Question {
  id: string;
  skill: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const DEMO_QUESTIONS: Question[] = [
  {
    id: "q1",
    skill: "Statistics",
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
    skill: "Statistics",
    question: "Which probability distribution describes the number of successes in a fixed number of independent Bernoulli trials?",
    options: ["Normal Distribution", "Poisson Distribution", "Binomial Distribution", "Exponential Distribution"],
    correctIndex: 2,
    explanation: "The Binomial distribution models the number of successes in n independent trials with constant probability p.",
  },
  {
    id: "q3",
    skill: "Machine Learning",
    question: "In Decision Trees, what metric measures the frequency at which a randomly chosen element from the set would be incorrectly labeled?",
    options: ["Mean Squared Error", "Gini Impurity", "R-Squared", "Cosine Similarity"],
    correctIndex: 1,
    explanation: "Gini Impurity measures how often a randomly chosen element would be incorrectly labeled if randomly labeled according to the distribution of labels in the subset.",
  },
  {
    id: "q4",
    skill: "Python",
    question: "What is the time complexity of looking up a key in a standard Python dictionary (hash map)?",
    options: ["O(1) average case", "O(N) average case", "O(log N)", "O(N^2)"],
    correctIndex: 0,
    explanation: "Python dictionary lookups use a hash table offering average time complexity of O(1).",
  },
  {
    id: "q5",
    skill: "Machine Learning",
    question: "What phenomenon occurs when a model performs exceptionally well on training data but fails to generalize to unseen test data?",
    options: ["Underfitting", "Overfitting", "Data Drift", "High Bias"],
    correctIndex: 1,
    explanation: "Overfitting occurs when a complex model learns noise and specific details of the training data instead of general patterns.",
  },
];

export default function AssessmentsPage() {
  const { userSkills, requiredSkills, submitAssessmentScore, activeAssessmentResult, recentRecommendations } = useApp();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState(0);

  const currentQuestion = DEMO_QUESTIONS[currentQuestionIndex];
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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < DEMO_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Calculate overall assessment score
      const allAnswers = [...userAnswers, selectedOption!];
      let correct = 0;
      allAnswers.forEach((ans, idx) => {
        if (ans === DEMO_QUESTIONS[idx].correctIndex) correct += 1;
      });

      const scorePercentage = Math.round((correct / DEMO_QUESTIONS.length) * 100);
      setCalculatedScore(scorePercentage);
      setTestCompleted(true);

      // Submit score for Statistics & ML to trigger Adaptive Engine!
      // Setting a lower score (e.g. 32% or scorePercentage) updates skills & triggers adaptive path adjustment
      submitAssessmentScore("Statistics", 32);
    }
  };

  const handleSimulateLowScore = () => {
    submitAssessmentScore("Statistics", 32);
  };

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary" className="bg-blue-50 text-blue-700 border-blue-200">
                Diagnostic & Skill Engine
              </Badge>
              <span className="text-xs text-slate-400 font-medium">• Target: Machine Learning Engineer</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Skill Assessments & Skill-Gap Analysis</h1>
            <p className="text-xs text-slate-500 mt-1">
              Evaluate your proficiency against role requirements. Results update your skill graph and trigger adaptive recommendations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSimulateLowScore}
              leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
            >
              Simulate 32% Low Score Trigger
            </Button>
          </div>
        </div>

        {/* ACTIVE RECOMMENDATION EXPLANATION BANNER IF ADAPTED */}
        {recentRecommendations.length > 0 && recentRecommendations[0].type === "path_adjustment" && (
          <Alert variant="warning" title="Adaptive Path Adjustment Applied by PathAI Engine">
            <div className="space-y-2">
              <p>{recentRecommendations[0].reason}</p>
              <p className="font-semibold text-slate-900">{recentRecommendations[0].actionSummary}</p>
              <div className="pt-1 flex items-center gap-2">
                <Link href="/weekly-plan">
                  <Button size="sm" variant="primary" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                    View Adjusted Weekly Plan
                  </Button>
                </Link>
                <Link href="/learning-path">
                  <Button size="sm" variant="outline">
                    View Updated Roadmap
                  </Button>
                </Link>
              </div>
            </div>
          </Alert>
        )}

        {/* SKILL GAP ANALYSIS TABLE & SUMMARY */}
        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Current Skill Profile & Gap Analysis</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Target Role: Machine Learning Engineer (Minimum Benchmark: 80% per core skill)
                </CardDescription>
              </div>
              <Badge variant="neutral" className="text-xs">
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
                      ? "bg-amber-50/60 border-amber-200"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">{item.skillName}</span>
                    <Badge
                      variant={item.priority === "High" ? "warning" : item.priority === "Medium" ? "primary" : "secondary"}
                      size="sm"
                    >
                      {item.gap}% Gap ({item.priority})
                    </Badge>
                  </div>

                  <div className="flex items-baseline justify-between text-xs mb-2">
                    <span className="text-slate-500">Current: <strong className="text-slate-900 font-bold">{item.currentScore}%</strong></span>
                    <span className="text-slate-500">Target: <strong className="text-slate-700 font-semibold">{item.requiredScore}%</strong></span>
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
        <Card className="shadow-md border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">
                    Statistics & Machine Learning Diagnostic Assessment
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    15 Questions • 25 Minutes • Skill: Statistics & Model Evaluation
                  </CardDescription>
                </div>
              </div>

              {!testCompleted && (
                <div className="text-xs font-semibold text-slate-500">
                  Question <span className="font-bold text-slate-900">{currentQuestionIndex + 1}</span> of {DEMO_QUESTIONS.length}
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {testCompleted ? (
              /* TEST RESULT VIEW */
              <div className="text-center py-8 space-y-6 max-w-xl mx-auto">
                <div className="h-16 w-16 rounded-full bg-amber-50 text-amber-600 border border-amber-200 mx-auto flex items-center justify-center shadow-xs">
                  <AlertTriangle className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-slate-900">Diagnostic Result: {calculatedScore}%</h3>
                  <Badge variant="warning" className="text-xs font-semibold px-3 py-1">
                    Below Target Benchmark (70%)
                  </Badge>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    You demonstrated understanding of Python syntax, but probability distributions and decision tree splits require additional preparation before moving to Deep Learning.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    PathAI Adaptive Engine Triggered:
                  </div>
                  <p className="text-slate-600">
                    • Added 2 probability & decision tree review modules to Week 6.<br />
                    • Extended Machine Learning module duration by 2 hours.<br />
                    • Curated 3 targeted free video tutorials from Khan Academy and StatQuest.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <Link href="/weekly-plan">
                    <Button variant="primary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      View Adjusted Weekly Plan
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => {
                      setTestCompleted(false);
                      setCurrentQuestionIndex(0);
                      setSelectedOption(null);
                      setIsSubmitted(false);
                      setUserAnswers([]);
                    }}
                  >
                    Retake Assessment
                  </Button>
                </div>
              </div>
            ) : (
              /* ACTIVE QUESTION VIEW */
              <div className="space-y-6">
                <ProgressBar
                  value={((currentQuestionIndex + 1) / DEMO_QUESTIONS.length) * 100}
                  size="sm"
                  showPercentage={false}
                />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" size="sm">
                      {currentQuestion.skill}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
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
                            ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                            : isWrong
                            ? "bg-rose-50 border-rose-500 text-rose-900"
                            : isSelected
                            ? "bg-blue-50 border-blue-600 text-blue-900 ring-1 ring-blue-500"
                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="h-6 w-6 rounded-full border border-slate-300 flex items-center justify-center font-bold text-[11px] shrink-0 bg-white">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                      </div>
                    );
                  })}
                </div>

                {/* Question Explanation if submitted */}
                {isSubmitted && (
                  <Alert variant={selectedOption === currentQuestion.correctIndex ? "success" : "warning"}>
                    <p className="font-semibold text-xs mb-1">
                      {selectedOption === currentQuestion.correctIndex ? "Correct Answer!" : "Incorrect"}
                    </p>
                    <p className="text-xs text-slate-700">{currentQuestion.explanation}</p>
                  </Alert>
                )}

                {/* Footer Controls */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  {!isSubmitted ? (
                    <Button
                      variant="primary"
                      onClick={handleConfirmAnswer}
                      disabled={selectedOption === null}
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={handleNextQuestion} rightIcon={<ArrowRight className="h-4 w-4" />}>
                      {currentQuestionIndex === DEMO_QUESTIONS.length - 1 ? "Finish Assessment" : "Next Question"}
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

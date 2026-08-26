"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useApp } from "@/context/AppContext";
import {
  FolderGit2,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Clock,
  Code,
  Layers,
  CheckSquare,
} from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: number;
  skills: string[];
  objective: string;
  requirements: string[];
  learningOutcomes: string[];
  suggestedResources: string[];
  steps: string[];
  checklist: string[];
}

const DEMO_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    title: "House Price Prediction Pipeline",
    difficulty: "Intermediate",
    estimatedHours: 5,
    skills: ["Python", "Pandas", "Scikit-Learn", "Regression", "Data Visualization"],
    objective: "Build an end-to-end supervised machine learning regression model to predict residential house prices from tabular real estate features.",
    requirements: [
      "Clean missing values and remove outliers using Pandas IQR method.",
      "Encode categorical variables with One-Hot & Target Encoding.",
      "Fit Linear Regression, Decision Tree, and Random Forest models.",
      "Evaluate performance using RMSE, MAE, and R-squared metrics.",
    ],
    learningOutcomes: [
      "Master Scikit-Learn Pipeline and ColumnTransformer API.",
      "Understand feature importance and multi-collinearity checks.",
      "Deploy model artifacts using Joblib serialization.",
    ],
    suggestedResources: [
      "Kaggle: House Prices Advanced Regression Competition",
      "Scikit-Learn Docs: Pipeline and Feature Processing",
    ],
    steps: [
      "1. Load and inspect the dataset schema with Pandas.",
      "2. Conduct Exploratory Data Analysis (EDA) & correlation heatmaps.",
      "3. Preprocess missing data and scale numerical features with StandardScaler.",
      "4. Train baseline Linear Regression vs Decision Tree Regressor.",
      "5. Tune hyperparameters using GridSearchCV.",
    ],
    checklist: [
      "Data cleaned with zero missing values",
      "EDA plots generated for top 5 correlated features",
      "Cross-validation score R2 > 0.82 achieved",
      "Model saved as house_price_model.pkl",
    ],
  },
  {
    id: "proj-2",
    title: "CLI Data Analytics Tool in Python",
    difficulty: "Beginner",
    estimatedHours: 3,
    skills: ["Python", "OOP", "File I/O", "CLI Tools"],
    objective: "Develop a command-line utility that parses CSV financial transactions and generates statistical summary tables.",
    requirements: [
      "Accept command line arguments using argparse.",
      "Parse raw CSV files without external dependencies.",
      "Export summary stats as formatted Markdown tables.",
    ],
    learningOutcomes: [
      "Master Python object-oriented architecture and error handling.",
      "Understand standard library file operations.",
    ],
    suggestedResources: [
      "Python Docs: argparse & csv module guides",
    ],
    steps: [
      "1. Set up argparse interface for filename input.",
      "2. Read CSV and calculate mean, median, standard deviation.",
      "3. Format and print terminal tabular output.",
    ],
    checklist: [
      "CLI accepts --file parameter cleanly",
      "Handles missing CSV errors gracefully",
      "Output verified against pandas summary",
    ],
  },
  {
    id: "proj-3",
    title: "Image Classification Microservice with PyTorch & FastAPI",
    difficulty: "Advanced",
    estimatedHours: 8,
    skills: ["PyTorch", "FastAPI", "Docker", "REST API", "Computer Vision"],
    objective: "Fine-tune a ResNet-18 Convolutional Neural Network on custom image classes and expose a REST API endpoint serving predictions.",
    requirements: [
      "Load pretrained ResNet-18 model and replace final linear layer.",
      "Train model using PyTorch DataLoader and Adam optimizer.",
      "Build FastAPI POST endpoint receiving base64 image bytes.",
      "Containerize the application with Docker.",
    ],
    learningOutcomes: [
      "Understand transfer learning and PyTorch image transformations.",
      "Deploy ML model inference API inside Docker containers.",
    ],
    suggestedResources: [
      "PyTorch Docs: Transfer Learning Tutorial",
      "FastAPI Official Deployment Guide",
    ],
    steps: [
      "1. Prepare dataset folders for train and test splits.",
      "2. Train model for 5 epochs using PyTorch GPU acceleration.",
      "3. Create main.py FastAPI app with /predict endpoint.",
      "4. Write Dockerfile and build container image.",
    ],
    checklist: [
      "Validation accuracy > 90% achieved",
      "API responds in under 120ms per inference request",
      "Docker container passes local curl test",
    ],
  },
];

export default function ProjectsPage() {
  const { streakData } = useApp();
  const [completedItems, setCompletedItems] = useState<{ [key: string]: boolean }>({});

  const toggleCheck = (id: string) => {
    setCompletedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary" className="bg-blue-50 text-blue-700 border-blue-200">
                Applied Portfolio Projects
              </Badge>
              <span className="text-xs text-slate-500 font-medium">Skill-Aligned Capstones</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hands-On Projects
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Solidify your Machine Learning skills by completing real-world portfolio projects with step-by-step specifications.
            </p>
          </div>
        </div>

        {/* PROJECTS LIST */}
        <div className="space-y-8">
          {DEMO_PROJECTS.map((proj) => (
            <Card key={proj.id} className="shadow-sm border-slate-200 bg-white">
              <CardHeader className="border-b border-slate-100 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                        <FolderGit2 className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg font-bold text-slate-900">{proj.title}</CardTitle>
                      <Badge variant={proj.difficulty === "Beginner" ? "success" : proj.difficulty === "Intermediate" ? "primary" : "warning"}>
                        {proj.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs text-slate-600 leading-relaxed pt-1">
                      {proj.objective}
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 shrink-0">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span>Est. {proj.estimatedHours} Hours</span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {proj.skills.map((skill) => (
                    <Badge key={skill} variant="outline" size="sm" className="bg-slate-50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Requirements & Learning Outcomes */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Project Requirements</h4>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {proj.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Learning Outcomes</h4>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {proj.learningOutcomes.map((out, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span>{out}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Completion Checklist */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">Completion Checklist</h4>
                      <span className="text-[11px] font-semibold text-blue-600">Track Progress</span>
                    </div>

                    <div className="space-y-2">
                      {proj.checklist.map((item, idx) => {
                        const itemKey = `${proj.id}-${idx}`;
                        const isChecked = !!completedItems[itemKey];

                        return (
                          <div
                            key={idx}
                            onClick={() => toggleCheck(itemKey)}
                            className={`p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all flex items-center gap-2.5 ${
                              isChecked
                                ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                            }`}
                          >
                            <div className={`h-4 w-4 rounded border flex items-center justify-center ${isChecked ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"}`}>
                              {isChecked && <CheckCircle2 className="h-3 w-3" />}
                            </div>
                            <span className={isChecked ? "line-through text-slate-400" : ""}>{item}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

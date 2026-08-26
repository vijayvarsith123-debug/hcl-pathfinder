export interface GoalParseResult {
  extractedCareer: string;
  recommendedHours: number;
  recommendedTimelineMonths: number;
  extractedSkills: string[];
  careerDescription: string;
}

export async function parseCareerGoalWithAI(goalText: string): Promise<GoalParseResult> {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "parse_goal", goalText }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn("AI API fallback mode:", err);
  }

  // Robust deterministic fallback for Hackathon demo
  const isML = goalText.toLowerCase().includes("machine learning") || goalText.toLowerCase().includes("ml") || goalText.toLowerCase().includes("ai");
  
  return {
    extractedCareer: isML ? "Machine Learning Engineer" : "Data Scientist & ML Specialist",
    recommendedHours: 8,
    recommendedTimelineMonths: 8,
    extractedSkills: ["Python", "SQL", "Statistics", "NumPy", "Pandas", "Scikit-Learn", "PyTorch", "MLOps"],
    careerDescription: "Builds production AI models, data pipelines, feature engineering systems, and scalable MLOps infrastructure.",
  };
}

export async function askAITutor(
  prompt: string,
  context: {
    careerGoal: string;
    currentModule: string;
    skillLevels: { [key: string]: number };
    weakSkills: string[];
  }
): Promise<string> {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ai_tutor", prompt, context }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.answer;
    }
  } catch (err) {
    console.warn("AI Tutor fallback mode:", err);
  }

  // Contextual fallback response
  if (prompt.toLowerCase().includes("statistics") || prompt.toLowerCase().includes("probability")) {
    return `In Machine Learning, Statistics provides the mathematical foundation for model evaluation and decision boundaries. For instance, Probability Distributions (like Normal/Gaussian distributions) tell us how data points are scattered, which directly influences linear regression assumptions and cost functions like MSE.`;
  }
  if (prompt.toLowerCase().includes("decision tree") || prompt.toLowerCase().includes("classification")) {
    return `Decision Trees split your data recursively based on feature values that maximize Information Gain (or minimize Gini Impurity). For example, if predicting house prices, a split might be 'Is Square Footage > 1500 sq ft?'. If yes, go right; if no, go left.`;
  }
  return `Great question! As you prepare for your ${context.careerGoal} role, focusing on ${context.currentModule} will give you the practical skills needed. In production systems, mastering ${context.weakSkills[0] || "Python & Math"} ensures your code is robust, performant, and scalable.`;
}

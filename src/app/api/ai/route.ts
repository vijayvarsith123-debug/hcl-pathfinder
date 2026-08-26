import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, goalText, prompt, context } = body;

    if (action === "parse_goal") {
      const isML =
        goalText?.toLowerCase().includes("machine learning") ||
        goalText?.toLowerCase().includes("ml") ||
        goalText?.toLowerCase().includes("ai");

      return NextResponse.json({
        extractedCareer: isML ? "Machine Learning Engineer" : "Data Scientist & AI Specialist",
        recommendedHours: 8,
        recommendedTimelineMonths: 8,
        extractedSkills: [
          "Python",
          "SQL",
          "Basic Mathematics",
          "Statistics",
          "NumPy & Pandas",
          "Scikit-Learn",
          "PyTorch",
          "MLOps",
        ],
        careerDescription:
          "Develops scalable machine learning algorithms, data pipelines, model deployment microservices, and automated MLOps infrastructure.",
      });
    }

    if (action === "ai_tutor") {
      let answer = `Great question regarding ${context?.currentModule || "Machine Learning"}!`;

      if (prompt?.toLowerCase().includes("gini") || prompt?.toLowerCase().includes("decision tree")) {
        answer = `In Decision Trees, Gini Impurity measures the probability of incorrectly classifying a randomly chosen element if it were randomly labeled according to the class distribution. Gini = 0 means the node is perfectly pure (all samples belong to 1 class).`;
      } else if (prompt?.toLowerCase().includes("code") || prompt?.toLowerCase().includes("example")) {
        answer = `Here is a clean Python example using Scikit-Learn:\n\nfrom sklearn.tree import DecisionTreeClassifier\n\n# Initialize and fit\nclf = DecisionTreeClassifier(max_depth=4, criterion='gini')\nclf.fit(X_train, y_train)\nprint("Accuracy:", clf.score(X_test, y_test))`;
      } else if (prompt?.toLowerCase().includes("test")) {
        answer = `Here is a practice question for you:\n\n**Question:** Which metric should you optimize when evaluating a fraud detection model where missing a fraudulent transaction (False Negative) is extremely costly?\n\nA) Precision\nB) Recall\nC) R-Squared\nD) Mean Absolute Error\n\n*Hint: Recall = True Positives / (True Positives + False Negatives).*`;
      }

      return NextResponse.json({ answer });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * Career Knowledge Base
 *
 * Structured, deterministic career-skill catalog with prerequisite chains,
 * importance weights, required proficiency targets, and specialization tracks.
 *
 * This is the SOURCE OF TRUTH for what skills a career requires.
 * An LLM is NEVER used to invent required skills.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type SkillImportance = "very_high" | "high" | "medium" | "low";

export interface CareerSkillSpec {
  name: string;
  category: string;
  requiredScore: number; // 0-100 target proficiency
  importance: SkillImportance;
  prerequisites: string[]; // names of skills that must come before
  relatedTopics: string[];
  estimatedHours: number; // rough hours to reach target from zero
  description: string;
}

export interface SpecializationTrack {
  id: string;
  name: string;
  triggerInterests: string[]; // interest keywords that activate this track
  additionalSkills: CareerSkillSpec[];
}

export interface CareerKnowledgeEntry {
  id: string;
  title: string;
  description: string;
  foundation: CareerSkillSpec[]; // core required skills (everyone gets these)
  specializations: SpecializationTrack[];
  averageSalary: string;
  marketDemand: string;
}

// ─── Importance → numeric weight ─────────────────────────────────────────────

export function importanceWeight(imp: SkillImportance): number {
  switch (imp) {
    case "very_high":
      return 5;
    case "high":
      return 4;
    case "medium":
      return 3;
    case "low":
      return 2;
  }
}

// ─── Knowledge Base ──────────────────────────────────────────────────────────

export const CAREER_KNOWLEDGE_BASE: CareerKnowledgeEntry[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. MACHINE LEARNING ENGINEER
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "ml_engineer",
    title: "Machine Learning Engineer",
    description:
      "Design, build, and deploy machine learning models and systems at scale.",
    averageSalary: "$135,000",
    marketDemand: "Very High",
    foundation: [
      {
        name: "Python",
        category: "Programming",
        requiredScore: 85,
        importance: "very_high",
        prerequisites: [],
        relatedTopics: [
          "Variables & Data Types",
          "Control Flow",
          "Functions & Closures",
          "OOP",
          "List Comprehensions",
          "Error Handling",
          "File I/O",
          "Virtual Environments",
        ],
        estimatedHours: 20,
        description:
          "Core Python programming including OOP, data structures, and Pythonic patterns.",
      },
      {
        name: "Statistics & Probability",
        category: "Mathematics",
        requiredScore: 75,
        importance: "high",
        prerequisites: [],
        relatedTopics: [
          "Descriptive Statistics",
          "Probability Distributions",
          "Hypothesis Testing",
          "Confidence Intervals",
          "Bayesian Thinking",
          "Correlation",
        ],
        estimatedHours: 22,
        description:
          "Statistical foundations for data analysis and ML model evaluation.",
      },
      {
        name: "NumPy & Pandas",
        category: "Data Handling",
        requiredScore: 80,
        importance: "high",
        prerequisites: ["Python"],
        relatedTopics: [
          "Array Operations",
          "Broadcasting",
          "DataFrame Manipulation",
          "Data Cleaning",
          "GroupBy & Aggregation",
          "Merge & Join",
        ],
        estimatedHours: 25,
        description:
          "Numerical computing with NumPy and tabular data analysis with Pandas.",
      },
      {
        name: "SQL",
        category: "Databases",
        requiredScore: 75,
        importance: "medium",
        prerequisites: [],
        relatedTopics: [
          "SELECT & Filtering",
          "JOINs",
          "Aggregations",
          "Subqueries",
          "Window Functions",
          "Database Design",
        ],
        estimatedHours: 18,
        description:
          "Relational database querying and data retrieval for ML pipelines.",
      },
      {
        name: "Data Visualization",
        category: "Data Handling",
        requiredScore: 65,
        importance: "medium",
        prerequisites: ["Python", "NumPy & Pandas"],
        relatedTopics: [
          "Matplotlib",
          "Seaborn",
          "Plotly",
          "Distribution Plots",
          "Heatmaps",
          "Scatter Plots",
        ],
        estimatedHours: 12,
        description:
          "Visualizing data distributions, relationships, and model performance.",
      },
      {
        name: "Machine Learning",
        category: "Core ML",
        requiredScore: 80,
        importance: "very_high",
        prerequisites: ["Python", "NumPy & Pandas", "Statistics & Probability"],
        relatedTopics: [
          "Supervised Learning",
          "Unsupervised Learning",
          "Decision Trees",
          "Random Forest",
          "SVM",
          "k-NN",
          "Feature Engineering",
          "Cross-Validation",
          "Scikit-Learn",
        ],
        estimatedHours: 35,
        description:
          "Core ML algorithms, model selection, training, and evaluation.",
      },
      {
        name: "Model Evaluation",
        category: "Core ML",
        requiredScore: 75,
        importance: "high",
        prerequisites: ["Machine Learning"],
        relatedTopics: [
          "Confusion Matrix",
          "Precision & Recall",
          "ROC-AUC",
          "Bias-Variance Tradeoff",
          "Overfitting",
          "Hyperparameter Tuning",
        ],
        estimatedHours: 15,
        description:
          "Evaluating model performance, diagnosing errors, and tuning hyperparameters.",
      },
      {
        name: "Deep Learning",
        category: "Advanced ML",
        requiredScore: 75,
        importance: "high",
        prerequisites: ["Machine Learning", "Statistics & Probability"],
        relatedTopics: [
          "Neural Networks",
          "Backpropagation",
          "CNNs",
          "RNNs",
          "Optimizers",
          "Regularization",
          "PyTorch",
          "Loss Functions",
        ],
        estimatedHours: 40,
        description:
          "Neural network architectures, training deep models with PyTorch.",
      },
      {
        name: "Deployment",
        category: "MLOps",
        requiredScore: 70,
        importance: "high",
        prerequisites: ["Python", "Machine Learning"],
        relatedTopics: [
          "REST APIs",
          "FastAPI",
          "Docker",
          "Model Serialization",
          "Cloud Deployment",
          "Monitoring",
        ],
        estimatedHours: 20,
        description:
          "Serving ML models as APIs using FastAPI, Docker, and cloud platforms.",
      },
      {
        name: "MLOps",
        category: "MLOps",
        requiredScore: 70,
        importance: "medium",
        prerequisites: ["Deployment", "Machine Learning"],
        relatedTopics: [
          "MLflow",
          "Experiment Tracking",
          "CI/CD for ML",
          "Data Drift",
          "Pipeline Automation",
          "Retraining",
        ],
        estimatedHours: 30,
        description:
          "End-to-end ML pipeline automation, experiment tracking, and monitoring.",
      },
    ],
    specializations: [
      {
        id: "cv",
        name: "Computer Vision",
        triggerInterests: [
          "computer vision",
          "image",
          "object detection",
          "image recognition",
          "visual",
          "cv",
        ],
        additionalSkills: [
          {
            name: "Computer Vision",
            category: "Specialization",
            requiredScore: 70,
            importance: "high",
            prerequisites: ["Deep Learning"],
            relatedTopics: [
              "CNNs",
              "Image Classification",
              "Object Detection",
              "YOLO",
              "Transfer Learning",
              "Image Segmentation",
            ],
            estimatedHours: 30,
            description:
              "Image processing, classification, and object detection with deep learning.",
          },
        ],
      },
      {
        id: "nlp",
        name: "Natural Language Processing",
        triggerInterests: [
          "nlp",
          "natural language",
          "text",
          "language model",
          "transformers",
          "chatbot",
          "llm",
        ],
        additionalSkills: [
          {
            name: "NLP",
            category: "Specialization",
            requiredScore: 70,
            importance: "high",
            prerequisites: ["Deep Learning"],
            relatedTopics: [
              "Tokenization",
              "Embeddings",
              "Transformers",
              "Attention Mechanism",
              "Hugging Face",
              "Sentiment Analysis",
              "Text Classification",
            ],
            estimatedHours: 30,
            description:
              "Text processing, embeddings, transformer models, and NLP applications.",
          },
        ],
      },
      {
        id: "rec_sys",
        name: "Recommendation Systems",
        triggerInterests: [
          "recommendation",
          "recommender",
          "collaborative filtering",
          "personalization",
        ],
        additionalSkills: [
          {
            name: "Recommendation Systems",
            category: "Specialization",
            requiredScore: 65,
            importance: "medium",
            prerequisites: ["Machine Learning"],
            relatedTopics: [
              "Collaborative Filtering",
              "Content-Based Filtering",
              "Matrix Factorization",
              "Hybrid Systems",
            ],
            estimatedHours: 20,
            description:
              "Building recommendation engines using collaborative and content-based methods.",
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. SOFTWARE DEVELOPER
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "software_developer",
    title: "Software Developer",
    description:
      "Build reliable, maintainable software applications and systems.",
    averageSalary: "$115,000",
    marketDemand: "Very High",
    foundation: [
      {
        name: "Python",
        category: "Programming",
        requiredScore: 85,
        importance: "very_high",
        prerequisites: [],
        relatedTopics: [
          "Syntax",
          "Data Types",
          "Control Flow",
          "Functions",
          "Modules",
          "Error Handling",
        ],
        estimatedHours: 20,
        description: "Core programming language proficiency.",
      },
      {
        name: "Data Structures & Algorithms",
        category: "Computer Science",
        requiredScore: 85,
        importance: "very_high",
        prerequisites: ["Python"],
        relatedTopics: [
          "Arrays",
          "Linked Lists",
          "Trees",
          "Graphs",
          "Sorting",
          "Searching",
          "Dynamic Programming",
          "Big-O",
        ],
        estimatedHours: 40,
        description: "Foundational CS algorithms and data structure mastery.",
      },
      {
        name: "Object-Oriented Programming",
        category: "Software Design",
        requiredScore: 80,
        importance: "very_high",
        prerequisites: ["Python"],
        relatedTopics: [
          "Classes",
          "Inheritance",
          "Polymorphism",
          "Encapsulation",
          "SOLID Principles",
          "Design Patterns",
        ],
        estimatedHours: 25,
        description: "OOP principles, design patterns, and SOLID architecture.",
      },
      {
        name: "Git & Version Control",
        category: "Tools",
        requiredScore: 85,
        importance: "high",
        prerequisites: [],
        relatedTopics: [
          "Branching",
          "Merging",
          "Rebasing",
          "Pull Requests",
          "Git Flow",
          "Conflict Resolution",
        ],
        estimatedHours: 10,
        description: "Version control workflows with Git and GitHub.",
      },
      {
        name: "SQL",
        category: "Databases",
        requiredScore: 80,
        importance: "high",
        prerequisites: [],
        relatedTopics: [
          "CRUD",
          "JOINs",
          "Normalization",
          "Indexes",
          "Transactions",
          "PostgreSQL",
        ],
        estimatedHours: 18,
        description: "Relational database design and querying.",
      },
      {
        name: "REST APIs",
        category: "Backend",
        requiredScore: 85,
        importance: "high",
        prerequisites: ["Python", "SQL"],
        relatedTopics: [
          "HTTP Methods",
          "Endpoints",
          "Authentication",
          "JSON",
          "FastAPI/Flask",
          "Status Codes",
        ],
        estimatedHours: 20,
        description: "Designing and building RESTful API services.",
      },
      {
        name: "System Design",
        category: "Architecture",
        requiredScore: 75,
        importance: "high",
        prerequisites: ["REST APIs", "SQL"],
        relatedTopics: [
          "Scaling",
          "Load Balancing",
          "Caching",
          "Microservices",
          "Database Sharding",
          "Message Queues",
        ],
        estimatedHours: 25,
        description: "Designing scalable, reliable software systems.",
      },
      {
        name: "Testing",
        category: "Quality",
        requiredScore: 70,
        importance: "medium",
        prerequisites: ["Python"],
        relatedTopics: [
          "Unit Testing",
          "Integration Testing",
          "TDD",
          "pytest",
          "Mocking",
          "Code Coverage",
        ],
        estimatedHours: 15,
        description:
          "Automated testing strategies and test-driven development.",
      },
    ],
    specializations: [],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. DATA ANALYST
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "data_analyst",
    title: "Data Analyst",
    description:
      "Extract insights from data to drive business decisions using SQL, Python, and visualization.",
    averageSalary: "$90,000",
    marketDemand: "High",
    foundation: [
      {
        name: "SQL",
        category: "Databases",
        requiredScore: 90,
        importance: "very_high",
        prerequisites: [],
        relatedTopics: [
          "Advanced Queries",
          "JOINs",
          "CTEs",
          "Window Functions",
          "Subqueries",
          "Performance",
        ],
        estimatedHours: 25,
        description: "Advanced SQL for complex analytical queries.",
      },
      {
        name: "Python",
        category: "Programming",
        requiredScore: 80,
        importance: "very_high",
        prerequisites: [],
        relatedTopics: [
          "Scripting",
          "Data Types",
          "Functions",
          "Libraries",
          "File Processing",
        ],
        estimatedHours: 20,
        description: "Python for data analysis scripting.",
      },
      {
        name: "Statistics & Probability",
        category: "Mathematics",
        requiredScore: 75,
        importance: "high",
        prerequisites: [],
        relatedTopics: [
          "Descriptive Stats",
          "Distributions",
          "Hypothesis Testing",
          "Correlation",
          "Regression",
        ],
        estimatedHours: 22,
        description: "Statistical methods for data analysis.",
      },
      {
        name: "NumPy & Pandas",
        category: "Data Handling",
        requiredScore: 85,
        importance: "very_high",
        prerequisites: ["Python"],
        relatedTopics: [
          "Data Cleaning",
          "Transformation",
          "Aggregation",
          "Pivot Tables",
          "Time Series",
        ],
        estimatedHours: 25,
        description: "Data manipulation and cleaning with Pandas.",
      },
      {
        name: "Data Visualization",
        category: "Presentation",
        requiredScore: 85,
        importance: "high",
        prerequisites: ["Python", "NumPy & Pandas"],
        relatedTopics: [
          "Matplotlib",
          "Seaborn",
          "Plotly",
          "Dashboard Design",
          "Storytelling with Data",
        ],
        estimatedHours: 20,
        description: "Creating clear, impactful data visualizations.",
      },
      {
        name: "EDA",
        category: "Analysis",
        requiredScore: 80,
        importance: "high",
        prerequisites: [
          "NumPy & Pandas",
          "Data Visualization",
          "Statistics & Probability",
        ],
        relatedTopics: [
          "Outlier Detection",
          "Feature Distributions",
          "Missing Data",
          "Correlation Analysis",
          "Report Writing",
        ],
        estimatedHours: 20,
        description: "Systematic exploratory data analysis workflow.",
      },
    ],
    specializations: [],
  },
];

// ─── Lookup helpers ──────────────────────────────────────────────────────────

/**
 * Find a career entry by id or by fuzzy title match.
 */
export function findCareer(
  goalOrId: string
): CareerKnowledgeEntry | undefined {
  const lower = goalOrId.toLowerCase().trim();
  return CAREER_KNOWLEDGE_BASE.find(
    (c) =>
      c.id === lower ||
      c.title.toLowerCase() === lower ||
      lower.includes(c.id.replace(/_/g, " ")) ||
      lower.includes(c.title.toLowerCase())
  );
}

/**
 * Resolve a career from a free-text goal string.
 * Falls back to ML Engineer if unrecognized.
 */
export function resolveCareerFromGoal(goalText: string): CareerKnowledgeEntry {
  const found = findCareer(goalText);
  if (found) return found;

  // keyword fallback matching
  const lower = goalText.toLowerCase();
  const keywords: [string[], string][] = [
    [["machine learning", "ml engineer", "ml ", "ai engineer"], "ml_engineer"],
    [["software dev", "backend", "software eng"], "software_developer"],
    [["data analyst", "analytics", "business analyst"], "data_analyst"],
  ];

  for (const [kws, id] of keywords) {
    if (kws.some((kw) => lower.includes(kw))) {
      const match = CAREER_KNOWLEDGE_BASE.find((c) => c.id === id);
      if (match) return match;
    }
  }

  // Default fallback
  return CAREER_KNOWLEDGE_BASE[0]; // ML Engineer
}

/**
 * Get all required skills for a career, including interest-matched specializations.
 */
export function getRequiredSkillsForCareer(
  career: CareerKnowledgeEntry,
  interests: string[] = []
): CareerSkillSpec[] {
  const skills = [...career.foundation];

  // Add specialization skills based on matching interests
  const lowerInterests = interests.map((i) => i.toLowerCase().trim());
  for (const spec of career.specializations) {
    const matched = spec.triggerInterests.some((trigger) =>
      lowerInterests.some(
        (interest) =>
          interest.includes(trigger) || trigger.includes(interest)
      )
    );
    if (matched) {
      skills.push(...spec.additionalSkills);
    }
  }

  return skills;
}

export interface RoadmapTopic {
  id: string;
  name: string;
  status: "completed" | "in_progress" | "upcoming";
}

export interface RoadmapResource {
  title: string;
  type: string; // Video, Documentation, Practice
  url: string;
}

export interface RoadmapProject {
  title: string;
  description: string;
  url: string;
}

export interface RoadmapAssessment {
  title: string;
  minPassingScore: number;
  currentScore?: number;
  url: string;
}

export interface RoadmapMilestone {
  id: string;
  stepNumber: number;
  title: string;
  category: string;
  description: string;
  estimatedHours: number;
  skills: string[];
  topics: RoadmapTopic[];
  prerequisites: string[];
  project?: RoadmapProject;
  assessment?: RoadmapAssessment;
  resources: RoadmapResource[];
  status: "completed" | "in_progress" | "available" | "locked";
  progressPercentage: number;
  isWeakArea?: boolean;
}

export interface GeneratedRoadmapData {
  careerId: string;
  careerTitle: string;
  totalMilestones: number;
  completedMilestonesCount: number;
  overallProgressPercentage: number;
  activeMilestoneId: string;
  milestones: RoadmapMilestone[];
  stats: {
    totalHours: number;
    completedHours: number;
    resourcesCompleted: number;
    totalResources: number;
    avgAssessmentScore: number;
    projectsCompleted: number;
    totalProjects: number;
  };
}

// CAREER MILESTONE DEFINITIONS
const CAREER_MILESTONE_TEMPLATES: { [careerId: string]: Omit<RoadmapMilestone, "status" | "progressPercentage" | "isWeakArea">[] } = {
  ml_engineer: [
    {
      id: "m-ml-1",
      stepNumber: 1,
      title: "Programming & Python Fundamentals",
      category: "Software Engineering",
      description: "Master core Python syntax, control flow, functions, OOP principles, and Git version control.",
      estimatedHours: 20,
      skills: ["Python", "Control Flow", "OOP", "Git"],
      topics: [
        { id: "t-1", name: "Variables & Data Types", status: "completed" },
        { id: "t-2", name: "Loops & Functions", status: "completed" },
        { id: "t-3", name: "Object-Oriented Programming", status: "completed" },
        { id: "t-4", name: "Git Branching & GitHub", status: "completed" },
      ],
      prerequisites: [],
      resources: [
        { title: "Core Python Programming (freeCodeCamp)", type: "Video Course", url: "https://www.youtube.com/playlist?list=PL-osiE80TeTskrapNbzXhwoFUiLCjGgsm" },
        { title: "Python Official User Guide", type: "Documentation", url: "https://docs.python.org/3/" },
      ],
      project: { title: "CLI Expense & Task Tracker", description: "Build an object-oriented Python CLI app with persistent storage.", url: "/projects" },
      assessment: { title: "Python Proficiency Challenge", minPassingScore: 70, currentScore: 88, url: "/assessments" },
    },
    {
      id: "m-ml-2",
      stepNumber: 2,
      title: "Mathematics & Statistics",
      category: "Mathematics & Stats",
      description: "Understand Linear Algebra matrices, Multivariable Calculus gradients, and Probability distributions for ML.",
      estimatedHours: 28,
      skills: ["Linear Algebra", "Calculus", "Probability", "Statistics"],
      topics: [
        { id: "t-5", name: "Matrix Operations & Vectors", status: "completed" },
        { id: "t-6", name: "Derivatives & Gradient Descent", status: "completed" },
        { id: "t-7", name: "Probability Distributions", status: "in_progress" },
        { id: "t-8", name: "Hypothesis Testing & Confidence", status: "upcoming" },
      ],
      prerequisites: ["Python"],
      resources: [
        { title: "3Blue1Brown Linear Algebra", type: "Video Course", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" },
        { title: "StatQuest Statistics Fundamentals", type: "Video Series", url: "https://www.youtube.com/playlist?list=PL49CF4A321528652D" },
      ],
      project: { title: "Statistical Hypothesis Tester", description: "Implement statistical t-tests and probability calculations in Python.", url: "/projects" },
      assessment: { title: "Statistics Prerequisite Diagnostic", minPassingScore: 65, currentScore: 52, url: "/assessments" },
    },
    {
      id: "m-ml-3",
      stepNumber: 3,
      title: "NumPy & Pandas Data Manipulation",
      category: "Data Engineering",
      description: "Efficient vectorized tensor operations in NumPy and structured DataFrame cleaning in Pandas.",
      estimatedHours: 22,
      skills: ["NumPy", "Pandas", "Data Cleaning", "EDA"],
      topics: [
        { id: "t-9", name: "NumPy Array Vectorization", status: "completed" },
        { id: "t-10", name: "Pandas DataFrame Indexing", status: "completed" },
        { id: "t-11", name: "Data Imputation & Encoding", status: "completed" },
        { id: "t-12", name: "Exploratory Data Analysis", status: "completed" },
      ],
      prerequisites: ["Python"],
      resources: [
        { title: "Pandas Data Wrangling Guide", type: "Documentation", url: "https://pandas.pydata.org/docs/" },
        { title: "Kaggle Data Cleaning Micro-Course", type: "Practice", url: "https://www.kaggle.com/learn/data-cleaning" },
      ],
      project: { title: "E-Commerce Dataset Cleaning & Pipeline", description: "Process 50,000 raw sales records into analytics tables.", url: "/projects" },
      assessment: { title: "Pandas Data Manipulation Test", minPassingScore: 75, currentScore: 82, url: "/assessments" },
    },
    {
      id: "m-ml-4",
      stepNumber: 4,
      title: "Data Visualization & Analytics",
      category: "Data Visualization",
      description: "Create informative statistical graphics using Matplotlib, Seaborn, and interactive Plotly charts.",
      estimatedHours: 16,
      skills: ["Matplotlib", "Seaborn", "Plotly", "Storytelling"],
      topics: [
        { id: "t-13", name: "Distribution & Scatter Plots", status: "completed" },
        { id: "t-14", name: "Correlation Heatmaps", status: "completed" },
        { id: "t-15", name: "Interactive Plotly Dashboards", status: "in_progress" },
      ],
      prerequisites: ["Pandas"],
      resources: [
        { title: "Seaborn Statistical Visualization", type: "Documentation", url: "https://seaborn.pydata.org/" },
      ],
      project: { title: "Customer Segment Exploratory Dashboard", description: "Build interactive visual reports of user demographics.", url: "/projects" },
      assessment: { title: "Visualization & EDA Quiz", minPassingScore: 70, currentScore: 78, url: "/assessments" },
    },
    {
      id: "m-ml-5",
      stepNumber: 5,
      title: "Machine Learning Fundamentals",
      category: "Machine Learning",
      description: "Understand core supervised & unsupervised algorithms, feature engineering, and cross-validation.",
      estimatedHours: 35,
      skills: ["Supervised Learning", "Scikit-Learn", "Feature Engineering", "Cross-Validation"],
      topics: [
        { id: "t-16", name: "Linear & Logistic Regression", status: "completed" },
        { id: "t-17", name: "Decision Trees & Random Forests", status: "in_progress" },
        { id: "t-18", name: "XGBoost & Gradient Boosting", status: "upcoming" },
        { id: "t-19", name: "Feature Scaling & Selection", status: "upcoming" },
      ],
      prerequisites: ["Mathematics & Statistics", "NumPy & Pandas"],
      resources: [
        { title: "Scikit-Learn Machine Learning Course", type: "Video Series", url: "https://www.youtube.com/playlist?list=PL-osiE80TeTvipOqomVEeZ1HRrcEvtZB_" },
        { title: "Hands-on Machine Learning Guide", type: "Documentation", url: "https://scikit-learn.org/stable/" },
      ],
      project: { title: "Customer Churn Prediction Model", description: "Train a gradient boosted tree model to predict churn with 88% accuracy.", url: "/projects" },
      assessment: { title: "Model Selection Challenge", minPassingScore: 75, url: "/assessments" },
    },
    {
      id: "m-ml-6",
      stepNumber: 6,
      title: "Supervised Learning Deep-Dive",
      category: "Machine Learning",
      description: "Advanced classification algorithms, SVMs, Naive Bayes, hyperparameter optimization, and ROC-AUC curves.",
      estimatedHours: 24,
      skills: ["Support Vector Machines", "Naive Bayes", "Hyperparameter Tuning", "ROC Curves"],
      topics: [
        { id: "t-20", name: "SVM Kernels & Margin Tuning", status: "upcoming" },
        { id: "t-21", name: "GridSearch & RandomSearch", status: "upcoming" },
        { id: "t-22", name: "Precision-Recall Optimization", status: "upcoming" },
      ],
      prerequisites: ["Machine Learning Fundamentals"],
      resources: [
        { title: "Advanced Scikit-Learn Model Tuning", type: "Documentation", url: "https://scikit-learn.org/stable/modules/grid_search.html" },
      ],
      project: { title: "Loan Default Risk Classifier", description: "Optimize classification precision to minimize financial risk.", url: "/projects" },
      assessment: { title: "Classification & Hyperparameters Quiz", minPassingScore: 75, url: "/assessments" },
    },
    {
      id: "m-ml-7",
      stepNumber: 7,
      title: "Unsupervised Learning & Clustering",
      category: "Machine Learning",
      description: "K-Means, Hierarchical Clustering, DBSCAN, and Principal Component Analysis (PCA) dimensionality reduction.",
      estimatedHours: 20,
      skills: ["K-Means", "DBSCAN", "PCA", "Dimensionality Reduction"],
      topics: [
        { id: "t-23", name: "K-Means & Elbow Method", status: "upcoming" },
        { id: "t-24", name: "PCA Variance Explained", status: "upcoming" },
        { id: "t-25", name: "Anomaly Detection", status: "upcoming" },
      ],
      prerequisites: ["Supervised Learning Deep-Dive"],
      resources: [
        { title: "StatQuest PCA & Clustering", type: "Video Series", url: "https://www.youtube.com/playlist?list=PL49CF4A321528652D" },
      ],
      project: { title: "User Persona Customer Segmentation", description: "Cluster 100k user profiles into distinct behavioral cohorts.", url: "/projects" },
      assessment: { title: "Unsupervised Learning Assessment", minPassingScore: 70, url: "/assessments" },
    },
    {
      id: "m-ml-8",
      stepNumber: 8,
      title: "Deep Learning & PyTorch",
      category: "AI & Neural Networks",
      description: "Build deep neural networks, CNNs for computer vision, and Transformers/RNNs using PyTorch.",
      estimatedHours: 42,
      skills: ["Neural Networks", "PyTorch", "CNNs", "Transformers"],
      topics: [
        { id: "t-26", name: "Perceptrons & Backpropagation", status: "upcoming" },
        { id: "t-27", name: "PyTorch Tensors & Autograd", status: "upcoming" },
        { id: "t-28", name: "Convolutional Neural Networks", status: "upcoming" },
        { id: "t-29", name: "Transformers & Attention", status: "upcoming" },
      ],
      prerequisites: ["Machine Learning Fundamentals"],
      resources: [
        { title: "Deep Learning with PyTorch (Official)", type: "Documentation", url: "https://pytorch.org/tutorials/" },
        { title: "Fast.ai Practical Deep Learning", type: "Course", url: "https://course.fast.ai/" },
      ],
      project: { title: "Medical X-Ray Image Classifier", description: "Train a ResNet CNN in PyTorch for lung opacity detection.", url: "/projects" },
      assessment: { title: "PyTorch Deep Learning Challenge", minPassingScore: 75, url: "/assessments" },
    },
    {
      id: "m-ml-9",
      stepNumber: 9,
      title: "Model Deployment & REST APIs",
      category: "MLOps",
      description: "Package trained PyTorch/Sklearn models into FastAPI microservices containerized with Docker.",
      estimatedHours: 30,
      skills: ["FastAPI", "Docker", "REST APIs", "Model Serving"],
      topics: [
        { id: "t-30", name: "FastAPI Async Routes", status: "upcoming" },
        { id: "t-31", name: "Docker Containerization", status: "upcoming" },
        { id: "t-32", name: "Cloud Inference Deployment", status: "upcoming" },
      ],
      prerequisites: ["Deep Learning & PyTorch"],
      resources: [
        { title: "Docker & Containerization Course", type: "Video Course", url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9hxjeEtdHFNYMtRnJ5VwV5" },
        { title: "FastAPI Official Documentation", type: "Documentation", url: "https://fastapi.tiangolo.com/" },
      ],
      project: { title: "Real-time AI Sentiment Prediction Service", description: "Deploy a containerized API serving 100 req/sec on AWS.", url: "/projects" },
      assessment: { title: "Model Deployment & Docker Quiz", minPassingScore: 75, url: "/assessments" },
    },
    {
      id: "m-ml-10",
      stepNumber: 10,
      title: "MLOps & Portfolio Capstone",
      category: "Career Ready",
      description: "CI/CD pipelines, MLflow experiment tracking, model drift monitoring, and portfolio project finalization.",
      estimatedHours: 35,
      skills: ["MLflow", "CI/CD", "Model Drift", "Portfolio"],
      topics: [
        { id: "t-33", name: "MLflow Experiment Tracking", status: "upcoming" },
        { id: "t-34", name: "GitHub Actions Automation", status: "upcoming" },
        { id: "t-35", name: "Portfolio Presentation & Demo", status: "upcoming" },
      ],
      prerequisites: ["Model Deployment & REST APIs"],
      resources: [
        { title: "MLOps Specialization & Best Practices", type: "Documentation", url: "https://mlops.org/" },
      ],
      project: { title: "End-to-End MLOps Production Pipeline", description: "Complete production ML pipeline with automated retraining.", url: "/projects" },
      assessment: { title: "MLOps Production Readiness Exam", minPassingScore: 80, url: "/assessments" },
    },
  ],
  software_developer: [
    {
      id: "m-sd-1",
      stepNumber: 1,
      title: "Programming & Logic Fundamentals",
      category: "Software Development",
      description: "Master variables, data structures, loops, functions, and Git source control.",
      estimatedHours: 25,
      skills: ["Python", "Logic", "Git"],
      topics: [
        { id: "sd-t1", name: "Data Types & Expressions", status: "completed" },
        { id: "sd-t2", name: "Functions & Modularization", status: "completed" },
        { id: "sd-t3", name: "Git Source Control", status: "completed" },
      ],
      prerequisites: [],
      resources: [{ title: "Python Basics Course", type: "Video", url: "https://www.youtube.com/" }],
      project: { title: "Task Manager CLI App", description: "Command-line task tracker in Python.", url: "/projects" },
      assessment: { title: "Programming Basics Quiz", minPassingScore: 70, currentScore: 85, url: "/assessments" },
    },
    {
      id: "m-sd-2",
      stepNumber: 2,
      title: "Data Structures & Algorithms",
      category: "Computer Science",
      description: "Arrays, Linked Lists, Stacks, Queues, Binary Trees, Searching, and Sorting algorithms.",
      estimatedHours: 35,
      skills: ["Data Structures", "Algorithms", "Big-O Notation"],
      topics: [
        { id: "sd-t4", name: "Big-O Time Complexity", status: "completed" },
        { id: "sd-t5", name: "Arrays & Hash Tables", status: "completed" },
        { id: "sd-t6", name: "Trees & Graph Traversal", status: "in_progress" },
      ],
      prerequisites: ["Programming & Logic Fundamentals"],
      resources: [{ title: "DSA Fundamentals (MIT 6.006)", type: "Video", url: "https://www.youtube.com/" }],
      project: { title: "Custom Search & Sorting Suite", description: "Implement data structures from scratch.", url: "/projects" },
      assessment: { title: "DSA Problem Solving Test", minPassingScore: 75, currentScore: 68, url: "/assessments" },
    },
    {
      id: "m-sd-3",
      stepNumber: 3,
      title: "Object-Oriented Design & Clean Code",
      category: "Software Engineering",
      description: "Classes, Inheritance, Polymorphism, Encapsulation, SOLID principles, and Design Patterns.",
      estimatedHours: 24,
      skills: ["OOP", "SOLID Principles", "Design Patterns"],
      topics: [
        { id: "sd-t7", name: "Inheritance & Polymorphism", status: "completed" },
        { id: "sd-t8", name: "SOLID Design Principles", status: "in_progress" },
      ],
      prerequisites: ["Data Structures & Algorithms"],
      resources: [{ title: "Refactoring & Design Patterns", type: "Doc", url: "https://refactoring.guru/" }],
      project: { title: "Banking System OOP Simulator", description: "Build scalable OOP bank account service.", url: "/projects" },
      assessment: { title: "OOP Principles Exam", minPassingScore: 75, url: "/assessments" },
    },
    {
      id: "m-sd-4",
      stepNumber: 4,
      title: "Databases & SQL Engineering",
      category: "Backend",
      description: "Relational database modeling, complex JOIN queries, indexing, and PostgreSQL optimization.",
      estimatedHours: 26,
      skills: ["SQL", "PostgreSQL", "Database Schema"],
      topics: [
        { id: "sd-t9", name: "Relational Schema Design", status: "upcoming" },
        { id: "sd-t10", name: "Complex SQL JOINs & Subqueries", status: "upcoming" },
      ],
      prerequisites: ["Object-Oriented Design"],
      resources: [{ title: "SQL Tutorial for Beginners", type: "Video", url: "https://www.youtube.com/" }],
      project: { title: "Inventory Database Schema", description: "Design 10-table normalized relational DB.", url: "/projects" },
      assessment: { title: "SQL Database Challenge", minPassingScore: 75, url: "/assessments" },
    },
    {
      id: "m-sd-5",
      stepNumber: 5,
      title: "Backend APIs & Microservices",
      category: "Backend",
      description: "RESTful API routes, authentication, JWT tokens, Node.js/Express, and error handling.",
      estimatedHours: 32,
      skills: ["REST APIs", "Node.js", "Express", "JWT"],
      topics: [
        { id: "sd-t11", name: "REST API Endpoint Design", status: "upcoming" },
        { id: "sd-t12", name: "JWT Auth & Middleware", status: "upcoming" },
      ],
      prerequisites: ["Databases & SQL Engineering"],
      resources: [{ title: "Express.js Official Docs", type: "Doc", url: "https://expressjs.com/" }],
      project: { title: "RESTful User Auth Microservice", description: "Build secure authentication API.", url: "/projects" },
      assessment: { title: "Backend API Exam", minPassingScore: 75, url: "/assessments" },
    },
    {
      id: "m-sd-6",
      stepNumber: 6,
      title: "System Design & Architecture",
      category: "System Design",
      description: "Scalability, load balancing, caching, database sharding, and message queues.",
      estimatedHours: 30,
      skills: ["System Design", "Caching", "Load Balancing"],
      topics: [
        { id: "sd-t13", name: "Monolith vs Microservices", status: "upcoming" },
        { id: "sd-t14", name: "Redis Caching Strategies", status: "upcoming" },
      ],
      prerequisites: ["Backend APIs"],
      resources: [{ title: "System Design Primer", type: "Doc", url: "https://github.com/donnemartin/system-design-primer" }],
      project: { title: "Scalable URL Shortener Architecture", description: "Design a system capable of 1M requests/day.", url: "/projects" },
      assessment: { title: "System Design Architecture Quiz", minPassingScore: 80, url: "/assessments" },
    },
    {
      id: "m-sd-7",
      stepNumber: 7,
      title: "Testing & CI/CD Pipelines",
      category: "DevOps",
      description: "Unit testing with Jest/PyTest, integration testing, and automated GitHub Actions pipelines.",
      estimatedHours: 20,
      skills: ["Testing", "Jest", "CI/CD", "GitHub Actions"],
      topics: [
        { id: "sd-t15", name: "Unit & Integration Testing", status: "upcoming" },
        { id: "sd-t16", name: "Automated Deployment Workflows", status: "upcoming" },
      ],
      prerequisites: ["System Design"],
      resources: [{ title: "CI/CD Automation Guide", type: "Video", url: "https://www.youtube.com/" }],
      project: { title: "Automated Testing Pipeline", description: "Set up 100% automated CI test runner.", url: "/projects" },
      assessment: { title: "Software Testing & CI Quiz", minPassingScore: 75, url: "/assessments" },
    },
    {
      id: "m-sd-8",
      stepNumber: 8,
      title: "Containerization & Cloud Deployment",
      category: "Cloud",
      description: "Dockerizing backend services, environment isolation, and deploying on AWS/Vercel.",
      estimatedHours: 24,
      skills: ["Docker", "AWS", "Deployment"],
      topics: [
        { id: "sd-t17", name: "Dockerizing Applications", status: "upcoming" },
        { id: "sd-t18", name: "Cloud Deployment on AWS", status: "upcoming" },
      ],
      prerequisites: ["Testing & CI/CD Pipelines"],
      resources: [{ title: "Docker Containerization Handbook", type: "Doc", url: "https://docs.docker.com/" }],
      project: { title: "Cloud Containerized Application", description: "Deploy multi-container app on cloud server.", url: "/projects" },
      assessment: { title: "Docker & Cloud Exam", minPassingScore: 75, url: "/assessments" },
    },
    {
      id: "m-sd-9",
      stepNumber: 9,
      title: "Full Capstone & Interview Preparation",
      category: "Career Ready",
      description: "Build a production-grade capstone project, solve LeetCode algorithms, and refine resume.",
      estimatedHours: 35,
      skills: ["Full Stack Capstone", "LeetCode", "Interview Prep"],
      topics: [
        { id: "sd-t19", name: "Full-Stack Capstone Project", status: "upcoming" },
        { id: "sd-t20", name: "Mock Technical Interviews", status: "upcoming" },
      ],
      prerequisites: ["Containerization & Cloud Deployment"],
      resources: [{ title: "Tech Interview Handbook", type: "Doc", url: "https://www.techinterviewhandbook.org/" }],
      project: { title: "Production SaaS Capstone Platform", description: "Full-stack SaaS application deployed live.", url: "/projects" },
      assessment: { title: "Software Engineer Final Exit Exam", minPassingScore: 80, url: "/assessments" },
    },
  ],
};

/**
 * Generates an interactive, data-driven Roadmap based on user career goal and skill gaps.
 */
export function generateInteractiveRoadmap(
  careerGoal: string = "Machine Learning Engineer",
  userSkills: { [skill: string]: number } = { Python: 72, SQL: 55, Mathematics: 45, Statistics: 32 }
): GeneratedRoadmapData {
  const careerKey =
    careerGoal.toLowerCase().includes("software") || careerGoal.toLowerCase().includes("developer")
      ? "software_developer"
      : "ml_engineer";

  const templates = CAREER_MILESTONE_TEMPLATES[careerKey] || CAREER_MILESTONE_TEMPLATES.ml_engineer;

  // Evaluate milestones dynamically based on user progress and skill gaps
  let completedCount = 0;
  let totalHours = 0;
  let completedHours = 0;

  const milestones: RoadmapMilestone[] = templates.map((tmpl, idx) => {
    totalHours += tmpl.estimatedHours;

    // Check if user has weak skills in this milestone
    const isWeakArea = tmpl.skills.some((skill) => (userSkills[skill] ?? 70) < 60);

    // Calculate topics completion
    let completedTopics = 0;
    const evaluatedTopics = tmpl.topics.map((top) => {
      // Default initial progress state logic
      if (top.status === "completed") {
        completedTopics++;
      }
      return top;
    });

    const topicPct = Math.round((completedTopics / Math.max(1, evaluatedTopics.length)) * 100);

    // Determine status
    let status: RoadmapMilestone["status"] = "locked";

    if (topicPct === 100) {
      status = "completed";
      completedCount++;
      completedHours += tmpl.estimatedHours;
    } else if (idx === 0 || (idx > 0 && templates[idx - 1].topics.some((t) => t.status === "completed"))) {
      if (topicPct > 0 || isWeakArea) {
        status = "in_progress";
      } else {
        status = "available";
      }
    }

    return {
      ...tmpl,
      topics: evaluatedTopics,
      status,
      progressPercentage: status === "completed" ? 100 : topicPct,
      isWeakArea,
    };
  });

  // Ensure active milestone is properly tagged
  const activeMilestone = milestones.find((m) => m.status === "in_progress") || milestones.find((m) => m.status === "available") || milestones[0];

  const overallProgressPercentage = Math.round((completedCount / milestones.length) * 100);

  return {
    careerId: careerKey,
    careerTitle: careerKey === "software_developer" ? "Software Developer" : "Machine Learning Engineer",
    totalMilestones: milestones.length,
    completedMilestonesCount: completedCount,
    overallProgressPercentage,
    activeMilestoneId: activeMilestone.id,
    milestones,
    stats: {
      totalHours,
      completedHours,
      resourcesCompleted: 18,
      totalResources: 24,
      avgAssessmentScore: 82,
      projectsCompleted: 2,
      totalProjects: milestones.filter((m) => m.project).length,
    },
  };
}

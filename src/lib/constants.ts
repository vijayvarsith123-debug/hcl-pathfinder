import {
  LayoutDashboard,
  Route,
  Calendar,
  BookOpen,
  FolderGit2,
  CheckSquare,
  BarChart3,
  Bot,
  Award,
  Settings,
} from "lucide-react";

export const APP_NAME = "PathAI";
export const APP_TAGLINE = "Your Goals. Your Skills. Your Learning Path.";

export const APP_THEME = {
  colors: {
    background: "#FFFFFF",
    surface: "#F8FAFC", // slate-50
    surfaceMuted: "#F1F5F9", // slate-100
    border: "#E2E8F0", // slate-200
    borderHover: "#CBD5E1", // slate-300
    textPrimary: "#0F172A", // slate-900 (Dark navy)
    textSecondary: "#334155", // slate-700
    textMuted: "#64748B", // slate-500
    primary: "#2563EB", // blue-600 (Professional Blue)
    primaryHover: "#1D4ED8", // blue-700
    primaryLight: "#EFF6FF", // blue-50
    primaryBorder: "#BFDBFE", // blue-200
    success: "#16A34A", // green-600
    successLight: "#F0FDF4", // green-50
    successBorder: "#BBF7D0", // green-200
    warning: "#D97706", // amber-600
    warningLight: "#FFFBEB", // amber-50
    warningBorder: "#FDE68A", // amber-200
    danger: "#DC2626", // red-600
    dangerLight: "#FEF2F2", // red-50
  },
};

export const NAVIGATION_ITEMS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Learning Path",
    href: "/learning-path",
    icon: Route,
  },
  {
    name: "Weekly Plan",
    href: "/weekly-plan",
    icon: Calendar,
  },
  {
    name: "Resources",
    href: "/resources",
    icon: BookOpen,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderGit2,
  },
  {
    name: "Assessments",
    href: "/assessments",
    icon: CheckSquare,
  },
  {
    name: "Progress",
    href: "/progress",
    icon: BarChart3,
  },
  {
    name: "Buddy AI",
    href: "/ai-tutor",
    icon: Bot,
    badge: "Buddy",
  },
  {
    name: "Achievements",
    href: "/achievements",
    icon: Award,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export const DEMO_ML_ENGINEER_PROFILE = {
  careerGoal: "I want to become a Machine Learning Engineer.",
  targetCareer: "Machine Learning Engineer",
  experienceLevel: "Beginner/Intermediate" as const,
  existingSkills: ["Python", "SQL", "Basic Mathematics"],
  weeklyHours: 8,
  timelineMonths: 8,
};

export const INITIAL_ML_MODULES = [
  {
    id: "mod-1",
    title: "Python Fundamentals",
    description: "Core syntax, data structures, OOP, and Pythonic patterns for data science.",
    orderIndex: 1,
    prerequisites: [],
    estimatedHours: 20,
    skillsCovered: ["Python", "Control Flow", "Functions", "OOP"],
    status: "completed" as const,
    progressPercentage: 100,
    resourcesCount: 6,
    projectTitle: "CLI Data Analytics Tool",
  },
  {
    id: "mod-2",
    title: "NumPy & Pandas",
    description: "Data manipulation, matrix math, array indexing, and tabular data analysis.",
    orderIndex: 2,
    prerequisites: ["Python Fundamentals"],
    estimatedHours: 25,
    skillsCovered: ["NumPy", "Pandas", "Data Cleaning", "Data Wranging"],
    status: "completed" as const,
    progressPercentage: 100,
    resourcesCount: 8,
    projectTitle: "Exploratory Data Analysis Report",
  },
  {
    id: "mod-3",
    title: "Statistics & Probability",
    description: "Descriptive statistics, inferential stats, probability distributions, and hypothesis testing.",
    orderIndex: 3,
    prerequisites: ["Python Fundamentals"],
    estimatedHours: 22,
    skillsCovered: ["Descriptive Stats", "Probability", "Hypothesis Testing", "Linear Algebra Basics"],
    status: "in_progress" as const,
    progressPercentage: 65,
    resourcesCount: 7,
    projectTitle: "A/B Testing & Statistical Inference Project",
  },
  {
    id: "mod-4",
    title: "SQL & Relational Databases",
    description: "Database querying, JOINs, window functions, and database schema design.",
    orderIndex: 4,
    prerequisites: [],
    estimatedHours: 18,
    skillsCovered: ["SQL", "PostgreSQL", "Database Design", "Aggregations"],
    status: "completed" as const,
    progressPercentage: 100,
    resourcesCount: 5,
    projectTitle: "Analytics Database Query Suite",
  },
  {
    id: "mod-5",
    title: "Machine Learning Fundamentals",
    description: "Supervised and unsupervised algorithms, decision trees, scikit-learn, regression & classification.",
    orderIndex: 5,
    prerequisites: ["Python Fundamentals", "NumPy & Pandas", "Statistics & Probability"],
    estimatedHours: 35,
    skillsCovered: ["Scikit-Learn", "Regression", "Decision Trees", "Model Evaluation"],
    status: "next" as const,
    progressPercentage: 15,
    resourcesCount: 10,
    projectTitle: "House Price Prediction Pipeline",
  },
  {
    id: "mod-6",
    title: "Deep Learning & Neural Networks",
    description: "Artificial Neural Networks, CNNs, Transformers, PyTorch, and optimization.",
    orderIndex: 6,
    prerequisites: ["Python Fundamentals", "Machine Learning Fundamentals", "Mathematics"],
    estimatedHours: 40,
    skillsCovered: ["PyTorch", "Neural Networks", "Computer Vision", "Loss Functions"],
    status: "locked" as const,
    progressPercentage: 0,
    resourcesCount: 9,
    projectTitle: "Image Classification with PyTorch",
  },
  {
    id: "mod-7",
    title: "Model Deployment & APIs",
    description: "REST APIs with FastAPI, Docker containers, model serialization, and cloud serving.",
    orderIndex: 7,
    prerequisites: ["Machine Learning Fundamentals", "Python Fundamentals"],
    estimatedHours: 20,
    skillsCovered: ["FastAPI", "Docker", "REST API", "Model Serialization"],
    status: "locked" as const,
    progressPercentage: 0,
    resourcesCount: 6,
    projectTitle: "ML Model Prediction Microservice",
  },
  {
    id: "mod-8",
    title: "MLOps & Pipeline Automation",
    description: "CI/CD for ML, experiment tracking with MLflow, data drift monitoring, and automated retraining.",
    orderIndex: 8,
    prerequisites: ["Machine Learning Fundamentals", "Model Deployment & APIs"],
    estimatedHours: 30,
    skillsCovered: ["MLflow", "CI/CD", "Data Drift", "Pipeline Automation"],
    status: "locked" as const,
    progressPercentage: 0,
    resourcesCount: 8,
    projectTitle: "End-to-End MLOps Pipeline",
  },
  {
    id: "mod-9",
    title: "Capstone Project",
    description: "Comprehensive end-to-end Machine Learning system implementation from raw data to deployed API.",
    orderIndex: 9,
    prerequisites: ["Machine Learning Fundamentals", "Deep Learning & Neural Networks", "MLOps & Pipeline Automation"],
    estimatedHours: 45,
    skillsCovered: ["System Design", "End-to-End ML", "Production Deployment", "Monitoring"],
    status: "locked" as const,
    progressPercentage: 0,
    resourcesCount: 5,
    projectTitle: "Production Ready ML System",
  },
];

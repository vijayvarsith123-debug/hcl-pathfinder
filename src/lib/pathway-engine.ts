export interface PathwayStep {
  id: string;
  stepNumber: number;
  title: string;
  category: string;
  skills: string[];
  estimatedHours: number;
  prerequisites: string[];
  status: "completed" | "active" | "upcoming";
}

export interface CareerPathwayData {
  careerTitle: string;
  totalSteps: number;
  completedStepsCount: number;
  overallProgressPercentage: number;
  currentStep: PathwayStep;
  nextStep?: PathwayStep;
  remainingSteps: PathwayStep[];
  allSteps: PathwayStep[];
}

export const MASTER_CAREER_PATHWAYS: { [careerId: string]: PathwayStep[] } = {
  ml_engineer: [
    {
      id: "ml-1",
      stepNumber: 1,
      title: "Programming Fundamentals & Control Flow",
      category: "Software Development",
      skills: ["Python", "Control Structures", "Functions", "Git"],
      estimatedHours: 20,
      prerequisites: [],
      status: "completed",
    },
    {
      id: "ml-2",
      stepNumber: 2,
      title: "Data Manipulation & Scientific Computing",
      category: "Data Engineering",
      skills: ["NumPy", "Pandas", "SQL Basics", "Data Cleaning"],
      estimatedHours: 25,
      prerequisites: ["Python"],
      status: "completed",
    },
    {
      id: "ml-3",
      stepNumber: 3,
      title: "Mathematical Foundations & Statistics",
      category: "Mathematics & Stats",
      skills: ["Linear Algebra", "Calculus", "Probability", "Statistics"],
      estimatedHours: 30,
      prerequisites: ["Math"],
      status: "active",
    },
    {
      id: "ml-4",
      stepNumber: 4,
      title: "Machine Learning Fundamentals",
      category: "Machine Learning",
      skills: ["Supervised Learning", "Unsupervised Learning", "Scikit-Learn", "Model Evaluation"],
      estimatedHours: 40,
      prerequisites: ["Python", "Statistics"],
      status: "upcoming",
    },
    {
      id: "ml-5",
      stepNumber: 5,
      title: "Deep Learning & Neural Networks",
      category: "AI & Deep Learning",
      skills: ["Neural Networks", "PyTorch", "Computer Vision", "NLP"],
      estimatedHours: 45,
      prerequisites: ["Machine Learning"],
      status: "upcoming",
    },
    {
      id: "ml-6",
      stepNumber: 6,
      title: "Model Deployment & MLOps Infrastructure",
      category: "MLOps",
      skills: ["Docker", "FastAPI", "Model Serving", "CI/CD", "Monitoring"],
      estimatedHours: 35,
      prerequisites: ["PyTorch", "Deployment"],
      status: "upcoming",
    },
  ],
  software_developer: [
    {
      id: "sd-1",
      stepNumber: 1,
      title: "Programming Fundamentals & Logic",
      category: "Core Programming",
      skills: ["Python", "JavaScript", "Variables", "Control Flow"],
      estimatedHours: 25,
      prerequisites: [],
      status: "completed",
    },
    {
      id: "sd-2",
      stepNumber: 2,
      title: "Data Structures & Algorithms",
      category: "Computer Science",
      skills: ["Arrays", "Linked Lists", "Trees", "Sorting", "Big-O Notation"],
      estimatedHours: 35,
      prerequisites: ["Programming"],
      status: "active",
    },
    {
      id: "sd-3",
      stepNumber: 3,
      title: "Databases & SQL Engineering",
      category: "Backend",
      skills: ["Relational Databases", "SQL Queries", "Schema Design", "PostgreSQL"],
      estimatedHours: 25,
      prerequisites: [],
      status: "upcoming",
    },
    {
      id: "sd-4",
      stepNumber: 4,
      title: "Version Control & Software Collaboration",
      category: "Dev Tools",
      skills: ["Git", "GitHub", "Branching", "Code Reviews"],
      estimatedHours: 15,
      prerequisites: [],
      status: "upcoming",
    },
    {
      id: "sd-5",
      stepNumber: 5,
      title: "Backend Architecture & RESTful APIs",
      category: "System Design",
      skills: ["REST APIs", "Express.js", "Authentication", "System Design"],
      estimatedHours: 40,
      prerequisites: ["Data Structures", "SQL"],
      status: "upcoming",
    },
    {
      id: "sd-6",
      stepNumber: 6,
      title: "Capstone Project & Interview Prep",
      category: "Career Preparation",
      skills: ["Full System Design", "Portfolio Project", "Mock Technical Interviews"],
      estimatedHours: 30,
      prerequisites: ["REST APIs"],
      status: "upcoming",
    },
  ],
};

/**
 * Deterministic Pathway Engine
 * Computes current step, missing skills, remaining roadmap steps, and next recommended action.
 */
export function getCareerPathwayData(
  careerId: string = "ml_engineer",
  userSkills: { [skill: string]: number } = { Python: 72, SQL: 55, Mathematics: 45, Statistics: 32 }
): CareerPathwayData {
  const steps = MASTER_CAREER_PATHWAYS[careerId] || MASTER_CAREER_PATHWAYS.ml_engineer;
  
  // Calculate completed steps based on user skill scores (>= 60% is considered completed/developing)
  const evaluatedSteps = steps.map((step) => {
    const isStepCompleted = step.skills.every((s) => (userSkills[s] || 0) >= 60);
    return {
      ...step,
      status: (isStepCompleted ? "completed" : "upcoming") as "completed" | "active" | "upcoming",
    };
  });

  const firstUncompletedIndex = evaluatedSteps.findIndex((s) => s.status !== "completed");
  const activeIndex = firstUncompletedIndex !== -1 ? firstUncompletedIndex : evaluatedSteps.length - 1;

  evaluatedSteps[activeIndex].status = "active";

  const completedCount = evaluatedSteps.filter((s) => s.status === "completed").length;
  const progressPct = Math.round((completedCount / evaluatedSteps.length) * 100);

  return {
    careerTitle: careerId === "software_developer" ? "Software Developer" : "Machine Learning Engineer",
    totalSteps: evaluatedSteps.length,
    completedStepsCount: completedCount,
    overallProgressPercentage: progressPct,
    currentStep: evaluatedSteps[activeIndex],
    nextStep: evaluatedSteps[activeIndex + 1],
    remainingSteps: evaluatedSteps.slice(activeIndex + 1),
    allSteps: evaluatedSteps,
  };
}

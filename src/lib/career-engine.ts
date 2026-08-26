export interface CareerRequirement {
  id: string;
  title: string;
  category: string;
  description: string;
  requiredSkills: { [skill: string]: number }; // Skill name to target percentage (0-100)
  preferredInterests: string[];
  keyTopics: string[];
  averageSalary: string;
  marketDemand: string;
}

export interface CareerMatchResult {
  careerId: string;
  title: string;
  matchPercentage: number;
  breakdown: {
    skillMatch: number;
    interestMatch: number;
    goalMatch: number;
    assessmentMatch: number;
  };
  missingSkills: string[];
  topMatchingSkills: string[];
  description: string;
}

export const CAREER_CATALOG: CareerRequirement[] = [
  {
    id: "ml_engineer",
    title: "Machine Learning Engineer",
    category: "AI & Data",
    description: "Develops scalable machine learning algorithms, data pipelines, model deployment microservices, and automated MLOps infrastructure.",
    requiredSkills: {
      Python: 85,
      SQL: 80,
      Mathematics: 75,
      Statistics: 70,
      "Machine Learning": 80,
      "Deep Learning": 75,
      Deployment: 70,
      MLOps: 75,
    },
    preferredInterests: ["AI", "Machine Learning", "Python", "Data Science", "Algorithms", "Automation"],
    keyTopics: ["Supervised Learning", "Neural Networks", "PyTorch", "Model Evaluation", "Docker", "MLOps"],
    averageSalary: "$135,000 / yr",
    marketDemand: "Very High",
  },
  {
    id: "software_developer",
    title: "Software Developer",
    category: "Software Engineering",
    description: "Designs, builds, tests, and maintains scalable software applications, backend services, and robust APIs.",
    requiredSkills: {
      Programming: 85,
      "Data Structures & Algorithms": 80,
      "Object-Oriented Programming": 80,
      Git: 85,
      Databases: 75,
      SQL: 75,
      "System Design": 70,
      Testing: 70,
    },
    preferredInterests: ["Software", "Programming", "Problem Solving", "Web Development", "Backend", "APIs"],
    keyTopics: ["OOP", "REST APIs", "SQL", "Git Workflow", "Clean Code", "Design Patterns"],
    averageSalary: "$115,000 / yr",
    marketDemand: "High",
  },
  {
    id: "fullstack_developer",
    title: "Full-Stack Developer",
    category: "Full-Stack Development",
    description: "Builds complete web applications covering responsive frontend UI, backend servers, databases, and authentication.",
    requiredSkills: {
      HTML: 90,
      CSS: 85,
      JavaScript: 90,
      TypeScript: 80,
      React: 85,
      "Next.js": 80,
      Databases: 75,
      SQL: 75,
      APIs: 85,
    },
    preferredInterests: ["Web", "Frontend", "Backend", "React", "JavaScript", "User Interface"],
    keyTopics: ["React", "Next.js", "Node.js", "PostgreSQL", "REST APIs", "Tailwind CSS"],
    averageSalary: "$120,000 / yr",
    marketDemand: "Very High",
  },
  {
    id: "cybersecurity_analyst",
    title: "Cybersecurity Specialist",
    category: "Cybersecurity",
    description: "Protects systems, networks, and applications from cyber threats, vulnerabilities, unauthorized access, and security breaches.",
    requiredSkills: {
      Networking: 85,
      Linux: 80,
      Windows: 75,
      Python: 70,
      Cryptography: 75,
      "Web Security": 80,
      "Penetration Testing": 75,
      "Incident Response": 70,
    },
    preferredInterests: ["Security", "Networking", "Ethical Hacking", "Cybersecurity", "Linux", "OWASP"],
    keyTopics: ["Network Security", "OWASP Top 10", "Ethical Hacking", "Wireshark", "SOC Operations"],
    averageSalary: "$110,000 / yr",
    marketDemand: "High",
  },
  {
    id: "devops_engineer",
    title: "Cloud & DevOps Engineer",
    category: "Cloud & DevOps",
    description: "Automates CI/CD pipelines, manages cloud infrastructure, containerizes services with Docker, and orchestrates Kubernetes clusters.",
    requiredSkills: {
      Linux: 85,
      Networking: 80,
      Git: 85,
      Bash: 80,
      Docker: 85,
      Kubernetes: 80,
      "CI/CD": 85,
      Terraform: 75,
    },
    preferredInterests: ["Cloud", "DevOps", "Infrastructure", "Automation", "Docker", "Linux"],
    keyTopics: ["Docker", "Kubernetes", "GitHub Actions", "Terraform", "AWS/Azure", "Prometheus"],
    averageSalary: "$130,000 / yr",
    marketDemand: "Very High",
  },
  {
    id: "data_analyst",
    title: "Data Analyst",
    category: "AI & Data",
    description: "Transforms raw business data into actionable insights, dashboards, and quantitative reports using SQL, Python, and statistics.",
    requiredSkills: {
      SQL: 85,
      Python: 75,
      Pandas: 80,
      NumPy: 75,
      Statistics: 75,
      "Data Cleaning": 80,
      "Exploratory Data Analysis": 85,
    },
    preferredInterests: ["Data", "Analytics", "Statistics", "SQL", "Visualization", "Business Intelligence"],
    keyTopics: ["Complex SQL", "Pandas DataFrames", "Data Visualization", "Hypothesis Testing", "Dashboards"],
    averageSalary: "$90,000 / yr",
    marketDemand: "High",
  },
];

/**
 * Deterministic Career Matching Engine
 * Computes career match percentage without LLM calls based on skills, goals, interests, and assessment scores.
 */
export function calculateCareerMatches(userProfile: {
  careerGoal?: string;
  existingSkills?: string[];
  userSkills?: { [skill: string]: number };
  assessmentScores?: { [skill: string]: number };
  interests?: string[];
}): CareerMatchResult[] {
  const {
    careerGoal = "Machine Learning Engineer",
    userSkills = { Python: 72, SQL: 55, Mathematics: 45, Statistics: 32, "Machine Learning": 10 },
    assessmentScores = { Python: 75, SQL: 60, Mathematics: 50 },
    interests = ["AI", "Machine Learning", "Python", "Problem Solving"],
  } = userProfile;

  const results: CareerMatchResult[] = CAREER_CATALOG.map((career) => {
    // 1. Goal Match (15%)
    const isExactGoal = career.title.toLowerCase() === careerGoal.toLowerCase() || careerGoal.toLowerCase().includes(career.title.toLowerCase());
    const goalScore = isExactGoal ? 100 : career.category.toLowerCase().includes(careerGoal.toLowerCase()) ? 70 : 30;

    // 2. Interest Match (20%)
    let interestHits = 0;
    career.preferredInterests.forEach((interest) => {
      if (interests.some((i) => i.toLowerCase().includes(interest.toLowerCase()) || interest.toLowerCase().includes(i.toLowerCase()))) {
        interestHits++;
      }
    });
    const interestScore = Math.min(100, Math.round((interestHits / Math.max(1, career.preferredInterests.length)) * 100));

    // 3. Skill Match (40%)
    const requiredSkillsList = Object.entries(career.requiredSkills);
    let totalSkillWeight = 0;
    let acquiredSkillWeight = 0;
    const missingSkills: string[] = [];
    const topMatchingSkills: string[] = [];

    requiredSkillsList.forEach(([skillName, targetPct]) => {
      totalSkillWeight += targetPct;
      const currentProficiency = userSkills[skillName] ?? assessmentScores[skillName] ?? 0;

      if (currentProficiency >= targetPct * 0.7) {
        topMatchingSkills.push(skillName);
      } else {
        missingSkills.push(skillName);
      }

      acquiredSkillWeight += Math.min(targetPct, currentProficiency);
    });

    const skillScore = Math.round((acquiredSkillWeight / Math.max(1, totalSkillWeight)) * 100);

    // 4. Assessment Match (25%)
    let assessmentSum = 0;
    let assessmentCount = 0;
    Object.keys(career.requiredSkills).forEach((skill) => {
      if (assessmentScores[skill] !== undefined) {
        assessmentSum += assessmentScores[skill];
        assessmentCount++;
      }
    });
    const assessmentScore = assessmentCount > 0 ? Math.round(assessmentSum / assessmentCount) : skillScore;

    // Total Match Weighting Formula: Skill (40%) + Assessment (25%) + Interest (20%) + Goal (15%)
    const matchPercentage = Math.min(
      98,
      Math.max(
        35,
        Math.round(skillScore * 0.4 + assessmentScore * 0.25 + interestScore * 0.2 + goalScore * 0.15)
      )
    );

    return {
      careerId: career.id,
      title: career.title,
      matchPercentage,
      breakdown: {
        skillMatch: skillScore,
        interestMatch: interestScore,
        goalMatch: goalScore,
        assessmentMatch: assessmentScore,
      },
      missingSkills,
      topMatchingSkills,
      description: career.description,
    };
  });

  // Sort descending by match percentage
  results.sort((a, b) => b.matchPercentage - a.matchPercentage);
  return results;
}

/**
 * Standard Skill Taxonomy
 *
 * Centralized registry of standard skills, stable identifiers (skill_id),
 * categories, and normalized alias mapping.
 */

export interface TaxonomySkill {
  skill_id: string;
  name: string;
  category: string;
  aliases: string[];
}

export const SKILL_TAXONOMY: TaxonomySkill[] = [
  {
    skill_id: "PY001",
    name: "Python",
    category: "Programming",
    aliases: ["python", "py", "python3", "python programming"],
  },
  {
    skill_id: "SQL001",
    name: "SQL",
    category: "Databases",
    aliases: ["sql", "postgresql", "mysql", "t-sql", "relational database", "sqlite"],
  },
  {
    skill_id: "NUM001",
    name: "NumPy & Pandas",
    category: "Data Handling",
    aliases: ["numpy", "pandas", "data wrangling", "data manipulation", "tabular data"],
  },
  {
    skill_id: "STAT001",
    name: "Statistics & Probability",
    category: "Mathematics",
    aliases: ["stats", "statistics", "probability", "statistical modeling", "hypothesis testing"],
  },
  {
    skill_id: "ML001",
    name: "Machine Learning",
    category: "Core ML",
    aliases: ["ml", "machine learning", "scikit-learn", "sklearn", "supervised learning", "unsupervised learning"],
  },
  {
    skill_id: "EVAL001",
    name: "Model Evaluation",
    category: "Core ML",
    aliases: ["model evaluation", "cross validation", "confusion matrix", "precision recall", "roc-auc"],
  },
  {
    skill_id: "DL001",
    name: "Deep Learning",
    category: "Advanced ML",
    aliases: ["dl", "deep learning", "pytorch", "tensorflow", "keras", "neural networks", "cnn", "rnn"],
  },
  {
    skill_id: "DEP001",
    name: "Deployment",
    category: "MLOps",
    aliases: ["deployment", "fastapi", "docker", "rest api", "cloud deployment", "flask"],
  },
  {
    skill_id: "MLOPS001",
    name: "MLOps",
    category: "MLOps",
    aliases: ["mlops", "mlflow", "experiment tracking", "model monitoring", "ci/cd for ml"],
  },
  {
    skill_id: "DS001",
    name: "Data Structures & Algorithms",
    category: "Computer Science",
    aliases: ["dsa", "data structures", "algorithms", "sorting", "trees", "graphs", "dynamic programming"],
  },
  {
    skill_id: "OOP001",
    name: "Object-Oriented Programming",
    category: "Software Design",
    aliases: ["oop", "object-oriented", "classes", "inheritance", "polymorphism", "solid principles"],
  },
  {
    skill_id: "GIT001",
    name: "Git & Version Control",
    category: "Tools",
    aliases: ["git", "github", "version control", "rebase", "pull requests"],
  },
  {
    skill_id: "VIS001",
    name: "Data Visualization",
    category: "Data Handling",
    aliases: ["data visualization", "matplotlib", "seaborn", "plotly", "tableau", "charts"],
  },
  {
    skill_id: "EDA001",
    name: "EDA",
    category: "Analysis",
    aliases: ["eda", "exploratory data analysis", "data exploration", "outlier detection"],
  },
  {
    skill_id: "CV001",
    name: "Computer Vision",
    category: "Specialization",
    aliases: ["cv", "computer vision", "opencv", "image classification", "object detection", "yolo"],
  },
  {
    skill_id: "NLP001",
    name: "Natural Language Processing",
    category: "Specialization",
    aliases: ["nlp", "natural language processing", "text analysis", "transformers", "hugging face", "llm", "embeddings"],
  },
  {
    skill_id: "SYS001",
    name: "System Design",
    category: "Architecture",
    aliases: ["system design", "distributed systems", "microservices", "load balancing", "caching"],
  },
  {
    skill_id: "TEST001",
    name: "Testing",
    category: "Quality",
    aliases: ["testing", "unit testing", "pytest", "integration testing", "tdd"],
  },
];

/**
 * Normalizes an arbitrary skill string to a standard TaxonomySkill if a match exists.
 */
export function normalizeSkillToTaxonomy(input: string): TaxonomySkill | null {
  const cleaned = input.toLowerCase().trim();
  if (!cleaned) return null;

  // 1. Direct match by ID
  const idMatch = SKILL_TAXONOMY.find((s) => s.skill_id.toLowerCase() === cleaned);
  if (idMatch) return idMatch;

  // 2. Direct match by Name
  const nameMatch = SKILL_TAXONOMY.find((s) => s.name.toLowerCase() === cleaned);
  if (nameMatch) return nameMatch;

  // 3. Match by Aliases
  const aliasMatch = SKILL_TAXONOMY.find((s) =>
    s.aliases.some((alias) => alias.toLowerCase() === cleaned)
  );
  if (aliasMatch) return aliasMatch;

  // 4. Substring match
  const substringMatch = SKILL_TAXONOMY.find((s) =>
    s.aliases.some((alias) => cleaned.includes(alias.toLowerCase()) || alias.toLowerCase().includes(cleaned))
  );
  if (substringMatch) return substringMatch;

  return null;
}

/**
 * Searches taxonomy skills matching a query string.
 */
export function searchTaxonomySkills(query: string): TaxonomySkill[] {
  const cleaned = query.toLowerCase().trim();
  if (!cleaned) return SKILL_TAXONOMY;

  return SKILL_TAXONOMY.filter(
    (s) =>
      s.name.toLowerCase().includes(cleaned) ||
      s.category.toLowerCase().includes(cleaned) ||
      s.aliases.some((a) => a.toLowerCase().includes(cleaned))
  );
}

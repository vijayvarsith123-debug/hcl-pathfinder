/**
 * LinkedIn Skill Processor
 *
 * Interface boundary and skill normalization service for processing LinkedIn profiles.
 * Extracts, normalizes, and matches LinkedIn skill strings against known career catalog skills.
 *
 * CRITICAL RULE:
 * LinkedIn NEVER automatically becomes the final source of truth.
 * Extracted skills are returned for learner review, and only confirmed skills become current_skills.
 */

import { CAREER_KNOWLEDGE_BASE } from "./career-knowledge-base";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RawLinkedInProfile {
  profileUrl?: string;
  headline?: string;
  extractedSkillStrings: string[];
}

export interface NormalizedSkillMatch {
  rawString: string;
  matchedSkillName: string | null;
  confidence: number; // 0.0 - 1.0
  suggestedLevel: number; // default estimated initial level e.g. 60%
}

export interface LinkedInSkillProcessingResult {
  rawCount: number;
  matchedSkills: NormalizedSkillMatch[];
  confirmedSkillsDraft: Array<{ name: string; level: number }>;
}

// ─── Skill Normalization Map ─────────────────────────────────────────────────

const ALIAS_MAP: Record<string, string> = {
  python: "Python",
  py: "Python",
  python3: "Python",
  sql: "SQL",
  postgresql: "SQL",
  mysql: "SQL",
  t_sql: "SQL",
  stats: "Statistics & Probability",
  statistics: "Statistics & Probability",
  probability: "Statistics & Probability",
  numpy: "NumPy & Pandas",
  pandas: "NumPy & Pandas",
  "data wrangling": "NumPy & Pandas",
  "data manipulation": "NumPy & Pandas",
  ml: "Machine Learning",
  "machine learning": "Machine Learning",
  scikit: "Machine Learning",
  "scikit-learn": "Machine Learning",
  sklearn: "Machine Learning",
  dl: "Deep Learning",
  "deep learning": "Deep Learning",
  pytorch: "Deep Learning",
  tensorflow: "Deep Learning",
  keras: "Deep Learning",
  neural: "Deep Learning",
  fastapi: "Deployment",
  docker: "Deployment",
  deployment: "Deployment",
  rest: "Deployment",
  mlops: "MLOps",
  mlflow: "MLOps",
  dsa: "Data Structures & Algorithms",
  algorithms: "Data Structures & Algorithms",
  "data structures": "Data Structures & Algorithms",
  oop: "Object-Oriented Programming",
  "object-oriented": "Object-Oriented Programming",
  git: "Git & Version Control",
  github: "Git & Version Control",
  eda: "EDA",
  "exploratory data analysis": "EDA",
  cv: "Computer Vision",
  "computer vision": "Computer Vision",
  nlp: "NLP",
  "natural language processing": "NLP",
};

// Get list of all known standard skill names across all careers
function getAllKnownSkills(): string[] {
  const skillsSet = new Set<string>();
  for (const career of CAREER_KNOWLEDGE_BASE) {
    for (const spec of career.foundation) {
      skillsSet.add(spec.name);
    }
    for (const specTrack of career.specializations) {
      for (const spec of specTrack.additionalSkills) {
        skillsSet.add(spec.name);
      }
    }
  }
  return Array.from(skillsSet);
}

// ─── Processor Functions ─────────────────────────────────────────────────────

/**
 * Normalizes a raw skill string extracted from LinkedIn to a known system skill.
 */
export function normalizeSkillString(rawInput: string): NormalizedSkillMatch {
  const cleaned = rawInput.toLowerCase().trim();

  // 1. Direct alias lookup
  if (ALIAS_MAP[cleaned]) {
    return {
      rawString: rawInput,
      matchedSkillName: ALIAS_MAP[cleaned],
      confidence: 1.0,
      suggestedLevel: 60, // Default baseline for skills imported from LinkedIn
    };
  }

  // 2. Exact match against known skills (case-insensitive)
  const knownSkills = getAllKnownSkills();
  const exactMatch = knownSkills.find((k) => k.toLowerCase() === cleaned);
  if (exactMatch) {
    return {
      rawString: rawInput,
      matchedSkillName: exactMatch,
      confidence: 0.95,
      suggestedLevel: 60,
    };
  }

  // 3. Partial substring match
  const partialMatch = knownSkills.find(
    (k) => k.toLowerCase().includes(cleaned) || cleaned.includes(k.toLowerCase())
  );
  if (partialMatch) {
    return {
      rawString: rawInput,
      matchedSkillName: partialMatch,
      confidence: 0.75,
      suggestedLevel: 50,
    };
  }

  // Unmatched
  return {
    rawString: rawInput,
    matchedSkillName: null,
    confidence: 0.0,
    suggestedLevel: 0,
  };
}

/**
 * Process a raw LinkedIn profile and produce a normalized draft of pre-selected skills for user review.
 */
export function processLinkedInProfile(
  profile: RawLinkedInProfile
): LinkedInSkillProcessingResult {
  const matchedSkills: NormalizedSkillMatch[] = [];
  const confirmedDraftMap = new Map<string, number>();

  for (const rawSkill of profile.extractedSkillStrings) {
    const match = normalizeSkillString(rawSkill);
    matchedSkills.push(match);

    if (match.matchedSkillName && match.confidence >= 0.7) {
      // Retain max level if duplicate match occurs
      const existing = confirmedDraftMap.get(match.matchedSkillName) || 0;
      confirmedDraftMap.set(
        match.matchedSkillName,
        Math.max(existing, match.suggestedLevel)
      );
    }
  }

  const confirmedSkillsDraft = Array.from(confirmedDraftMap.entries()).map(
    ([name, level]) => ({ name, level })
  );

  return {
    rawCount: profile.extractedSkillStrings.length,
    matchedSkills,
    confirmedSkillsDraft,
  };
}

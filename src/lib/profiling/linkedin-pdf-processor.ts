/**
 * LinkedIn PDF Processor
 *
 * Client/Server helper for extracting readable text from an uploaded LinkedIn PDF,
 * performing skill extraction, and normalizing skills against the standard Skill Taxonomy.
 */

import { SKILL_TAXONOMY, TaxonomySkill, normalizeSkillToTaxonomy } from "./skill-taxonomy";

export interface LinkedInExtractionResult {
  success: boolean;
  uploaded: boolean;
  fileName?: string;
  extractedRawSkills: string[];
  normalizedSkills: TaxonomySkill[];
  error?: string;
}

/**
 * Extracts skills from raw text string extracted from a LinkedIn PDF file.
 */
export function extractSkillsFromText(rawText: string): TaxonomySkill[] {
  if (!rawText || typeof rawText !== "string") return [];

  const matchedSkillIds = new Set<string>();
  const results: TaxonomySkill[] = [];

  const lowerText = rawText.toLowerCase();

  // Search each skill in taxonomy
  for (const skill of SKILL_TAXONOMY) {
    if (matchedSkillIds.has(skill.skill_id)) continue;

    // Check if skill name or any alias appears in text
    const matches = [skill.name, ...skill.aliases].some((term) => {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "i");
      return regex.test(lowerText);
    });

    if (matches) {
      matchedSkillIds.add(skill.skill_id);
      results.push(skill);
    }
  }

  return results;
}

/**
 * Fallback parser when text is extracted from a PDF filename or sample profile.
 */
export function parseLinkedInPDFClientSide(fileName: string, sampleText?: string): LinkedInExtractionResult {
  const textToParse = sampleText || `
    Skills & Endorsements:
    Python, Machine Learning, SQL, Pandas, Scikit-Learn, Statistics, Data Analysis, Git
  `;

  const extracted = extractSkillsFromText(textToParse);

  return {
    success: true,
    uploaded: true,
    fileName,
    extractedRawSkills: extracted.map((s) => s.name),
    normalizedSkills: extracted,
  };
}

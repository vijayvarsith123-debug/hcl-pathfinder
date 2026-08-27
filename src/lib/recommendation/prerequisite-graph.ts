/**
 * Prerequisite Graph & Topological Ordering
 *
 * Deterministic dependency-aware skill ordering using Kahn's algorithm.
 * Ensures no skill appears before its prerequisites in the final roadmap.
 */

import { CareerSkillSpec, importanceWeight } from "./career-knowledge-base";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OrderedSkill {
  skill: CareerSkillSpec;
  phaseIndex: number; // 0-based phase grouping
  dependencyDepth: number; // how deep in the dependency chain
}

// ─── Core Algorithm ──────────────────────────────────────────────────────────

/**
 * Build an adjacency list and in-degree map from the skill specs.
 */
function buildGraph(skills: CareerSkillSpec[]): {
  adjacency: Map<string, string[]>;
  inDegree: Map<string, number>;
  skillMap: Map<string, CareerSkillSpec>;
} {
  const adjacency = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  const skillMap = new Map<string, CareerSkillSpec>();

  // Initialize all nodes
  for (const s of skills) {
    skillMap.set(s.name, s);
    if (!adjacency.has(s.name)) adjacency.set(s.name, []);
    if (!inDegree.has(s.name)) inDegree.set(s.name, 0);
  }

  // Build edges: prerequisite → skill (prerequisite must come first)
  for (const s of skills) {
    for (const prereq of s.prerequisites) {
      // Only add edge if prerequisite is in the skill set
      if (skillMap.has(prereq)) {
        adjacency.get(prereq)!.push(s.name);
        inDegree.set(s.name, (inDegree.get(s.name) || 0) + 1);
      }
    }
  }

  return { adjacency, inDegree, skillMap };
}

/**
 * Compute the dependency depth of each node (longest path from any root).
 */
function computeDepths(
  adjacency: Map<string, string[]>,
  inDegree: Map<string, number>
): Map<string, number> {
  const depths = new Map<string, number>();
  const queue: string[] = [];

  // Initialize roots (in-degree = 0)
  for (const [node, deg] of inDegree.entries()) {
    if (deg === 0) {
      queue.push(node);
      depths.set(node, 0);
    }
  }

  // BFS – propagate max depth
  const inDegreeCopy = new Map(inDegree);
  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentDepth = depths.get(current) || 0;

    for (const neighbor of adjacency.get(current) || []) {
      const newDepth = currentDepth + 1;
      depths.set(neighbor, Math.max(depths.get(neighbor) || 0, newDepth));
      inDegreeCopy.set(neighbor, (inDegreeCopy.get(neighbor) || 1) - 1);
      if (inDegreeCopy.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  return depths;
}

/**
 * Topologically sort skills respecting prerequisites.
 *
 * Within each dependency depth layer, skills are sorted by:
 * 1. Importance weight (descending)
 * 2. Skill gap size (descending) — if provided
 * 3. Alphabetical name (stable tie-break)
 *
 * Returns ordered skills with phase assignments.
 */
export function topologicalSortSkills(
  skills: CareerSkillSpec[],
  skillGaps?: Map<string, number>
): OrderedSkill[] {
  if (skills.length === 0) return [];

  const { adjacency, inDegree, skillMap } = buildGraph(skills);
  const depths = computeDepths(adjacency, inDegree);

  // Group skills by depth layer
  const layerMap = new Map<number, CareerSkillSpec[]>();
  for (const s of skills) {
    const depth = depths.get(s.name) || 0;
    if (!layerMap.has(depth)) layerMap.set(depth, []);
    layerMap.get(depth)!.push(s);
  }

  // Sort layers by depth, then sort within each layer
  const sortedDepths = [...layerMap.keys()].sort((a, b) => a - b);
  const result: OrderedSkill[] = [];
  let phaseIndex = 0;

  for (const depth of sortedDepths) {
    const layer = layerMap.get(depth)!;

    // Sort within layer by importance (desc), gap (desc), then name
    layer.sort((a, b) => {
      const impDiff = importanceWeight(b.importance) - importanceWeight(a.importance);
      if (impDiff !== 0) return impDiff;

      if (skillGaps) {
        const gapDiff = (skillGaps.get(b.name) || 0) - (skillGaps.get(a.name) || 0);
        if (gapDiff !== 0) return gapDiff;
      }

      return a.name.localeCompare(b.name);
    });

    for (const skill of layer) {
      result.push({ skill, phaseIndex, dependencyDepth: depth });
    }
    phaseIndex++;
  }

  return result;
}

/**
 * Validate that a skill ordering respects all prerequisites.
 * Returns an array of violation messages (empty = valid).
 */
export function validatePrerequisiteOrder(
  orderedSkillNames: string[],
  skills: CareerSkillSpec[]
): string[] {
  const violations: string[] = [];
  const skillMap = new Map(skills.map((s) => [s.name, s]));
  const seen = new Set<string>();

  for (const name of orderedSkillNames) {
    const spec = skillMap.get(name);
    if (!spec) continue;

    for (const prereq of spec.prerequisites) {
      if (skillMap.has(prereq) && !seen.has(prereq)) {
        violations.push(
          `"${name}" appears before its prerequisite "${prereq}".`
        );
      }
    }
    seen.add(name);
  }

  return violations;
}

/**
 * Count how many other skills depend on this skill (downstream dependents).
 * Higher count = more important to learn first.
 */
export function countDependents(
  skillName: string,
  skills: CareerSkillSpec[]
): number {
  let count = 0;
  const visited = new Set<string>();

  function dfs(name: string) {
    for (const s of skills) {
      if (s.prerequisites.includes(name) && !visited.has(s.name)) {
        visited.add(s.name);
        count++;
        dfs(s.name);
      }
    }
  }

  dfs(skillName);
  return count;
}

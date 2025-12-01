import Fuse, { type IFuseOptions, type FuseResultMatch } from 'fuse.js';
import type { Project } from '@/types';

export interface SearchResult {
  item: Project;
  score: number;
  matches?: readonly FuseResultMatch[];
}

const searchOptions: IFuseOptions<Project> = {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'description', weight: 0.3 },
    { name: 'tags', weight: 0.1 },
    { name: 'techStack', weight: 0.1 },
  ],
  threshold: 0.4,
  includeMatches: true,
};

export function createProjectSearchIndex(projects: Project[]) {
  return new Fuse(projects, searchOptions);
}

export function searchProjects(
  projects: Project[],
  query: string
): SearchResult[] {
  if (!query.trim()) {
    return projects.map((item) => ({ item, score: 0 }));
  }

  const fuse = createProjectSearchIndex(projects);
  const results = fuse.search(query);
  
  return results.map((result) => ({
    item: result.item,
    score: result.score || 0,
    matches: result.matches,
  }));
}

export function filterProjects(
  projects: Project[],
  filters: {
    tags?: string[];
    techStack?: string[];
  }
): Project[] {
  let filtered = projects;

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((project) =>
      filters.tags!.some((tag) => project.tags.includes(tag))
    );
  }

  if (filters.techStack && filters.techStack.length > 0) {
    filtered = filtered.filter((project) =>
      filters.techStack!.some((tech) => project.techStack.includes(tech))
    );
  }

  return filtered;
}

export function getAllTags(projects: Project[]): string[] {
  const tagSet = new Set<string>();
  projects.forEach((project) => {
    project.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

export function getAllTechStack(projects: Project[]): string[] {
  const techSet = new Set<string>();
  projects.forEach((project) => {
    project.techStack.forEach((tech) => techSet.add(tech));
  });
  return Array.from(techSet).sort();
}


import 'server-only';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { TacticMeta, TacticContent, TacticCategory, TacticCategoryInfo, TacticSubcategoryInfo } from '@/types/tactics';

const tacticsDirectory = path.join(process.cwd(), 'content/tactics');

const CATEGORY_INFO: Record<TacticCategory, Omit<TacticCategoryInfo, 'count'>> = {
  pentesting: {
    id: 'pentesting',
    label: 'Pentesting',
    description: 'Offensive security techniques, exploitation methods, and service enumeration across web vulnerabilities and network protocols.',
    icon: 'crosshair',
    href: '/tactics/pentesting',
  },
  hardening: {
    id: 'hardening',
    label: 'Hardening',
    description: 'System hardening guides and defense strategies to secure services, servers, and network infrastructure.',
    icon: 'shield',
    href: '/tactics/hardening',
  },
  tools: {
    id: 'tools',
    label: 'Tools',
    description: 'Essential security tools — purpose, core features, common commands, and practical usage examples.',
    icon: 'terminal',
    href: '/tactics/tools',
  },
};

function readTacticFiles(category: TacticCategory, subcategory?: string): TacticMeta[] {
  try {
    const categoryDir = path.join(tacticsDirectory, category);
    if (!fs.existsSync(categoryDir)) return [];

    if (subcategory) {
      const subDir = path.join(categoryDir, subcategory);
      if (!fs.existsSync(subDir)) return [];
      return readMdxFiles(subDir, category, subcategory);
    }

    const items: TacticMeta[] = [];

    const entries = fs.readdirSync(categoryDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.mdx')) {
        const slug = entry.name.replace(/\.mdx$/, '');
        const fullPath = path.join(categoryDir, entry.name);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);
        items.push({
          slug,
          title: data.title || slug,
          category,
          description: data.description || '',
          tags: data.tags || [],
        });
      } else if (entry.isDirectory() && !entry.name.startsWith('_')) {
        const subItems = readMdxFiles(path.join(categoryDir, entry.name), category, entry.name);
        items.push(...subItems);
      }
    }

    return items.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error(`Error reading tactics for ${category}:`, error);
    return [];
  }
}

function readMdxFiles(dir: string, category: TacticCategory, subcategory: string): TacticMeta[] {
  try {
    const fileNames = fs.readdirSync(dir);
    return fileNames
      .filter((f) => f.endsWith('.mdx'))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, '');
        const fullPath = path.join(dir, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);
        return {
          slug,
          title: data.title || slug,
          category,
          subcategory,
          description: data.description || '',
          tags: data.tags || [],
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  } catch {
    return [];
  }
}

export function getAllTactics(): TacticMeta[] {
  const categories: TacticCategory[] = ['pentesting', 'hardening', 'tools'];
  return categories.flatMap((cat) => readTacticFiles(cat));
}

export function getTacticsByCategory(category: TacticCategory): TacticMeta[] {
  return readTacticFiles(category);
}

export function getSubcategories(category: TacticCategory): TacticSubcategoryInfo[] {
  try {
    const categoryDir = path.join(tacticsDirectory, category);
    if (!fs.existsSync(categoryDir)) return [];

    const entries = fs.readdirSync(categoryDir, { withFileTypes: true });
    const subcategories: TacticSubcategoryInfo[] = [];
    const rootItems: TacticMeta[] = [];

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('_')) {
        const items = readMdxFiles(path.join(categoryDir, entry.name), category, entry.name);
        if (items.length > 0) {
          const subLabelMap: Record<string, string> = {
            web: 'Web Vulnerabilities',
            services: 'Services & Protocols'
          };
          const label = subLabelMap[entry.name] || entry.name
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
          subcategories.push({ id: entry.name, label, items });
        }
      } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
        const slug = entry.name.replace(/\.mdx$/, '');
        const fullPath = path.join(categoryDir, entry.name);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);
        rootItems.push({
          slug,
          title: data.title || slug,
          category,
          description: data.description || '',
          tags: data.tags || [],
        });
      }
    }

    if (rootItems.length > 0) {
      subcategories.unshift({
        id: 'general',
        label: CATEGORY_INFO[category].label,
        items: rootItems.sort((a, b) => a.title.localeCompare(b.title)),
      });
    }

    return subcategories;
  } catch {
    return [];
  }
}

export function getTacticBySlug(category: TacticCategory, slug: string): TacticContent | null {
  try {
    const categoryDir = path.join(tacticsDirectory, category);

    // Check root-level file first
    const rootPath = path.join(categoryDir, `${slug}.mdx`);
    if (fs.existsSync(rootPath)) {
      const fileContents = fs.readFileSync(rootPath, 'utf8');
      const { data, content } = matter(fileContents);
      return {
        slug,
        category,
        frontmatter: {
          slug,
          title: data.title || slug,
          category,
          description: data.description || '',
          tags: data.tags || [],
        },
        content,
      };
    }

    // Check subdirectories
    const entries = fs.readdirSync(categoryDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subPath = path.join(categoryDir, entry.name, `${slug}.mdx`);
        if (fs.existsSync(subPath)) {
          const fileContents = fs.readFileSync(subPath, 'utf8');
          const { data, content } = matter(fileContents);
          return {
            slug,
            category,
            subcategory: entry.name,
            frontmatter: {
              slug,
              title: data.title || slug,
              category,
              subcategory: entry.name,
              description: data.description || '',
              tags: data.tags || [],
            },
            content,
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error(`Error reading tactic ${category}/${slug}:`, error);
    return null;
  }
}

export function getAllTacticSlugs(): Array<{ category: TacticCategory; slug: string }> {
  const all = getAllTactics();
  return all.map((t) => ({ category: t.category, slug: t.slug }));
}

export function getCategoryInfo(): TacticCategoryInfo[] {
  const categories: TacticCategory[] = ['pentesting', 'hardening', 'tools'];
  return categories.map((cat) => ({
    ...CATEGORY_INFO[cat],
    count: readTacticFiles(cat).length,
  }));
}

export function getAdjacentTactics(
  category: TacticCategory,
  slug: string
): { prev: TacticMeta | null; next: TacticMeta | null } {
  const all = getTacticsByCategory(category);
  const idx = all.findIndex((t) => t.slug === slug);
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

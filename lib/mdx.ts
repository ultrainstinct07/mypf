import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Project } from '@/types';

const projectsDirectory = path.join(process.cwd(), 'content/projects');

export function getAllProjects(): Project[] {
  try {
    const fileNames = fs.readdirSync(projectsDirectory);
    const allProjectsData = fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, '');
        const fullPath = path.join(projectsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        return {
          slug,
          title: data.title,
          description: data.description,
          tags: data.tags || [],
          image: data.image || '/images/projects/placeholder.jpg',
          repoUrl: data.repoUrl,
          liveUrl: data.liveUrl,
          techStack: data.techStack || [],
          featured: data.featured || false,
        } as Project;
      });

    return allProjectsData.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  } catch (error) {
    console.error('Error reading projects:', error);
    return [];
  }
}

export function getProjectBySlug(slug: string) {
  try {
    const fullPath = path.join(projectsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      frontmatter: data,
      content,
    };
  } catch (error) {
    console.error(`Error reading project ${slug}:`, error);
    return null;
  }
}

export function getAllProjectSlugs() {
  try {
    const fileNames = fs.readdirSync(projectsDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => fileName.replace(/\.mdx$/, ''));
  } catch (error) {
    console.error('Error reading project slugs:', error);
    return [];
  }
}



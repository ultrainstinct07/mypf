import { Metadata } from 'next';
import { getAllProjects } from '@/lib/mdx';
import ProjectsClient from './ProjectsClient';

export const metadata: Metadata = {
  title: 'Projects | Kshitiz Kumar',
  description: 'Open-source security tools and research, plus 50+ professional engagements delivered under client NDAs.',
};

// Enable ISR
export const revalidate = 3600; // Revalidate every hour

export default function ProjectsPage() {
  const projects = getAllProjects();

  return <ProjectsClient projects={projects} />;
}



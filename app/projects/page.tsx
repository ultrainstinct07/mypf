import { Metadata } from 'next';
import { getAllProjects } from '@/lib/mdx';
import ProjectsClient from './ProjectsClient';

export const metadata: Metadata = {
  title: 'Projects | Kshitiz Kumar',
  description: 'Explore my cybersecurity projects including Ark Surveillance, Collegia, phishing detection systems, and more.',
};

// Enable ISR
export const revalidate = 3600; // Revalidate every hour

export default function ProjectsPage() {
  const projects = getAllProjects();

  return <ProjectsClient projects={projects} />;
}



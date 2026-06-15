'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProjectCard from './ProjectCard';
import type { Project } from '@/types';

interface ProjectRecommendationsProps {
  currentProject: Project;
  allProjects: Project[];
  limit?: number;
}

export default function ProjectRecommendations({
  currentProject,
  allProjects,
  limit = 3,
}: ProjectRecommendationsProps) {
  // Find similar projects based on shared tags and tech stack
  const recommendations = allProjects
    .filter((p) => p.slug !== currentProject.slug)
    .map((project) => {
      const sharedTags = project.tags.filter((tag) =>
        currentProject.tags.includes(tag)
      ).length;
      const sharedTech = project.techStack.filter((tech) =>
        currentProject.techStack.includes(tech)
      ).length;
      const similarity = sharedTags * 2 + sharedTech; // Tags weighted more
      return { project, similarity };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map((item) => item.project);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-black border-t-2 border-black dark:border-white/10">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase text-black dark:text-white">
              Similar <span className="text-crimson">Projects</span>
            </h2>
            <Link
              href="/projects"
              className="text-crimson hover:text-crimson-secondary flex items-center gap-2 font-bold uppercase tracking-wider text-sm transition-colors min-h-[44px] touch-manipulation"
            >
              View All
              <ArrowRight size={16} />
            </Link>
          </div>
          <p className="text-slate-600 dark:text-gray-400 font-medium">
            Explore related projects that share similar technologies or concepts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}


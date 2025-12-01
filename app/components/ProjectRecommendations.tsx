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
    <section className="section-padding bg-dark border-t border-white/5">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Similar <span className="text-gradient-cyan">Projects</span>
            </h2>
            <Link
              href="/projects"
              className="text-cyan hover:text-cyan-secondary flex items-center gap-2 transition-colors"
            >
              View All
              <ArrowRight size={18} />
            </Link>
          </div>
          <p className="text-gray-400">
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


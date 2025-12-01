'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ExternalLink, Github } from 'lucide-react';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/projects/${project.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group relative"
    >
      <div
        onClick={handleCardClick}
        className="relative bg-dark-card rounded-2xl overflow-hidden border border-white/5 hover:border-cyan/30 transition-all duration-300 hover:-translate-y-2 hover:glow-cyan cursor-pointer"
      >
          {/* Project image */}
          <div className="relative aspect-video overflow-hidden bg-dark-lighter">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent opacity-60" />
            
            {/* Tags overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {project.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-cyan/20 backdrop-blur-sm text-cyan text-xs font-semibold rounded-full border border-cyan/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-xl font-bold group-hover:text-cyan transition-colors mb-2">
                {project.title}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-2">
              {project.techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-dark-lighter text-gray-300 text-xs rounded border border-white/5"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span className="px-2 py-1 text-cyan text-xs">
                  +{project.techStack.length - 3} more
                </span>
              )}
            </div>

            {/* Links */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan transition-colors"
                >
                  <Github size={16} />
                  <span>Code</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan transition-colors"
                >
                  <ExternalLink size={16} />
                  <span>Live</span>
                </a>
              )}
              <span className="ml-auto text-cyan text-sm font-medium group-hover:translate-x-2 transition-transform">
                View Details →
              </span>
            </div>
          </div>

          {/* Hover glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute top-0 left-0 w-32 h-32 bg-cyan/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-secondary/10 rounded-full blur-2xl" />
          </div>
        </div>
    </motion.div>
  );
}



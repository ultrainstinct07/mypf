'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ExternalLink, Github } from 'lucide-react';
import type { Project } from '@/types';
import { blurPlaceholders } from '@/lib/image-utils';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const router = useRouter();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

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
        className="relative bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 hover:border-cyan-600/30 dark:hover:border-cyan/30 transition-all duration-300 hover:-translate-y-2 hover:glow-cyan cursor-pointer shadow-md dark:shadow-none"
      >
          {/* Project image with blur placeholder */}
          <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-dark-lighter">
            {/* Loading shimmer */}
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-dark-lighter dark:via-dark-card dark:to-dark-lighter animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-[shimmer_2s_infinite] -translate-x-full" />
              </div>
            )}
            <Image
              src={project.image}
              alt={project.title}
              fill
              className={`object-cover group-hover:scale-110 transition-all duration-500 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL={blurPlaceholders.card}
              onLoad={() => setIsImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-dark-card via-transparent to-transparent opacity-60" />
            
            {/* Tags overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {project.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-cyan-600/20 dark:bg-cyan/20 backdrop-blur-sm text-cyan-600 dark:text-cyan text-xs font-semibold rounded-full border border-cyan-600/30 dark:border-cyan/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan transition-colors mb-2">
                {project.title}
              </h3>
              <p className="text-slate-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-2">
              {project.techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-slate-100 dark:bg-dark-lighter text-slate-600 dark:text-gray-300 text-xs rounded border border-slate-200 dark:border-white/5"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span className="px-2 py-1 text-cyan-600 dark:text-cyan text-xs">
                  +{project.techStack.length - 3} more
                </span>
              )}
            </div>

            {/* Links */}
            <div className="flex items-center gap-3 sm:gap-4 pt-4 border-t border-slate-200 dark:border-white/5">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan transition-colors min-h-[44px] touch-manipulation"
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
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan transition-colors min-h-[44px] touch-manipulation"
                >
                  <ExternalLink size={16} />
                  <span>Live</span>
                </a>
              )}
              <span className="ml-auto text-cyan-600 dark:text-cyan text-sm font-medium group-hover:translate-x-2 transition-transform">
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



'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { GitHubLogoIcon as Github } from '@radix-ui/react-icons';
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
        className="relative bg-white dark:bg-dark-card rounded-none overflow-hidden border-2 border-black dark:border-white/10 hover:border-crimson dark:hover:border-crimson transition-all duration-200 hover:-translate-y-1 cursor-pointer shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.05)] hover:shadow-[6px_6px_0px_#D90429] dark:hover:shadow-[6px_6px_0px_#D90429]"
      >
          {/* Project image with blur placeholder */}
          <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-dark-lighter border-b-2 border-black dark:border-white/10">
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
              className={`object-cover group-hover:scale-105 transition-all duration-500 ${
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
                  className="px-3 py-1 bg-crimson text-white text-[10px] font-extrabold uppercase tracking-wider rounded-none border border-black dark:border-white/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold uppercase tracking-wide text-slate-900 dark:text-white group-hover:text-crimson dark:group-hover:text-crimson transition-colors mb-2">
                {project.title}
              </h3>
              <p className="text-slate-600 dark:text-gray-400 text-sm font-medium line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-2">
              {project.techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-slate-100 dark:bg-dark-lighter text-slate-600 dark:text-gray-300 text-xs font-bold uppercase rounded-none border border-slate-200 dark:border-white/10"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span className="px-2 py-1 text-crimson text-xs font-bold uppercase tracking-wider">
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
                  className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 hover:text-crimson dark:text-gray-400 dark:hover:text-crimson transition-colors min-h-[44px] touch-manipulation"
                >
                  <Github width={16} height={16} />
                  <span>Code</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 hover:text-crimson dark:text-gray-400 dark:hover:text-crimson transition-colors min-h-[44px] touch-manipulation"
                >
                  <ExternalLink size={16} />
                  <span>Live</span>
                </a>
              )}
              <span className="ml-auto text-crimson text-xs font-bold uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                View Details →
              </span>
            </div>
          </div>
        </div>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import ProjectCard from './ProjectCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import AnimatedCounter from './AnimatedCounter';
import type { Project } from '@/types';

interface ProjectGalleryProps {
  projects?: Project[];
}

export default function ProjectGallery({ projects = [] }: ProjectGalleryProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  // Use provided projects or fallback to sample data
  const displayProjects = projects.length > 0 ? projects : getSampleProjects();

  return (
    <section
      id="projects"
      ref={ref}
      className="section-padding bg-white dark:bg-dark relative overflow-hidden transition-colors duration-300"
    >
      {/* Background decorative elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-cyan-600/5 dark:bg-cyan/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-sky-500/5 dark:bg-cyan-secondary/5 rounded-full blur-[120px]" />

      <div className="container-custom relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-cyan-600 dark:text-cyan text-sm font-semibold uppercase tracking-wider"
              >
                Portfolio
              </motion.span>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-4 text-slate-900 dark:text-white"
              >
                My Best <span className="text-gradient-cyan">Projects</span>
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Link
                href="/projects"
                className="btn-outline inline-flex items-center gap-2 group"
              >
                View All Projects
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-slate-600 dark:text-gray-300 text-base sm:text-lg mt-4 sm:mt-6 max-w-3xl"
          >
            Through a diverse portfolio spanning AI surveillance systems, security automation,
            and threat detection tools, I&apos;ve delivered practical solutions that balance
            security with real-world usability.
          </motion.p>
        </motion.div>

        {/* Projects grid with staggered animations */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1,
              }
            }
          }}
        >
          {displayProjects.map((project, index) => (
            <motion.div
              key={project.slug}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.97 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 80,
                    damping: 12,
                  }
                }
              }}
            >
              <ProjectCard project={project} index={index} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 pt-16 border-t border-slate-200 dark:border-white/10"
        >
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-cyan mb-2">
                <AnimatedCounter end={6} suffix="+" />
              </div>
              <div className="text-sm sm:text-base text-gray-400">Security Projects</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-cyan mb-2">
                <AnimatedCounter end={3} suffix="+" />
              </div>
              <div className="text-sm sm:text-base text-gray-400">AI/ML Integrations</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-cyan mb-2">
                <AnimatedCounter end={100} suffix="%" />
              </div>
              <div className="text-sm sm:text-base text-gray-400">Focus on Security</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Sample projects data for initial render
function getSampleProjects() {
  return [
    {
      slug: 'ark-surveillance',
      title: 'Ark Surveillance',
      description: 'Private AI surveillance prototype using TensorFlow for face recognition and local-first deployment.',
      tags: ['AI', 'Security'],
      image: '/images/projects/ark-surveillance.svg',
      techStack: ['Python', 'TensorFlow', 'OpenCV', 'Flask'],
      featured: true,
    },
    {
      slug: 'collegia',
      title: 'Collegia',
      description: 'Private AI server to ingest college data and guide freshers; deployed on AWS/local.',
      tags: ['AI', 'Cloud'],
      image: '/images/projects/collegia.svg',
      techStack: ['Python', 'AWS', 'NLP', 'FastAPI'],
      featured: true,
    },
    {
      slug: 'phishing-detector',
      title: 'Phishing Detection System',
      description: 'Python-based multi-factor phishing classifier: domain reputation, SSL checks, content heuristics, Vulners CVE lookups.',
      tags: ['Security', 'Detection'],
      image: '/images/projects/phishing-detector.svg',
      techStack: ['Python', 'Vulners API', 'scikit-learn'],
      featured: true,
    },
    {
      slug: 'e-voting',
      title: 'E-Voting Prototype',
      description: 'Early research and mockups for a secure e-voting workflow.',
      tags: ['Research', 'Security'],
      image: '/images/projects/e-voting.svg',
      techStack: ['Cryptography', 'Python', 'React'],
    },
    {
      slug: 'mobile-pentest',
      title: 'Mobile App Pentest',
      description: 'Collection of mobile application penetration testing reports and findings.',
      tags: ['Pentesting', 'Mobile'],
      image: '/images/projects/mobile-pentest.svg',
      techStack: ['Frida', 'Burp Suite', 'Android Studio'],
    },
    {
      slug: 'windows-internals',
      title: 'Windows Internals',
      description: 'Research notes and tooling experiments exploring Windows internals and security mechanisms.',
      tags: ['Research', 'Windows'],
      image: '/images/projects/windows-internals.svg',
      techStack: ['C++', 'WinDbg', 'Assembly'],
    },
  ];
}



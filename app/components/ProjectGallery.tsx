'use client';

import ProjectCard from './ProjectCard';
import ConfidentialEngagementsSection from './ConfidentialEngagementsSection';
import ScrollReveal from './ScrollReveal';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import AnimatedCounter from './AnimatedCounter';
import type { Project } from '@/types';
import { CONFIDENTIAL_STATS } from '@/lib/confidential-engagements';

interface ProjectGalleryProps {
  projects?: Project[];
}

export default function ProjectGallery({ projects = [] }: ProjectGalleryProps) {
  const displayProjects = (projects.length > 0 ? projects : getSampleProjects()).filter(
    (project) => project.featured
  );

  return (
    <ScrollReveal
      id="projects"
      className="section-padding bg-transparent relative overflow-hidden transition-colors duration-300"
    >
      <div className="container-custom relative z-10">
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-crimson text-sm font-extrabold uppercase tracking-wider">
                Portfolio
              </span>

              <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase mt-4 text-black dark:text-white">
                My <span className="text-crimson">Work</span>
              </h2>
            </div>

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
          </div>

          <p className="text-slate-700 dark:text-gray-300 text-base mt-4 sm:mt-6 max-w-3xl font-medium">
            Public tools and research I can share openly, plus a summary of{' '}
            {CONFIDENTIAL_STATS.displayLabel} professional engagements delivered under client NDAs.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-6">
            Open Source &amp; Public Projects
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>

        <ConfidentialEngagementsSection compact className="mt-20 pt-20 border-t-2 border-black dark:border-white/15" />

        <div className="mt-16 pt-16 border-t-2 border-black dark:border-white/15">
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-crimson mb-2 font-syne">
                <AnimatedCounter end={CONFIDENTIAL_STATS.totalCount} suffix="+" />
              </div>
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Confidential Engagements</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-crimson mb-2 font-syne">
                <AnimatedCounter end={6} suffix="+" />
              </div>
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Public Projects</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-crimson mb-2 font-syne">
                <AnimatedCounter end={3} suffix="" />
              </div>
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Industry Certifications</div>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

function getSampleProjects() {
  return [
    {
      slug: 'ad-void',
      title: 'AD-Void — Active Directory Attack Cheat Sheet',
      description:
        'A living reference for Active Directory offensive security — attack notes, Kerberos and LDAP abuse paths, scenario walkthroughs, and red team blog posts.',
      tags: ['Active Directory', 'Red Team', 'Offensive Security'],
      image: '/images/projects/ad-void.svg',
      liveUrl: 'https://ad-void.void999.space/',
      techStack: ['Active Directory', 'Kerberos', 'BloodHound', 'Impacket', 'MITRE ATT&CK'],
      featured: true,
    },
    {
      slug: 'vulnessus',
      title: 'Vulnessus',
      description: 'A high-performance full-stack vulnerability management platform utilizing a Rust (Axum) backend, Python dynamic plugin execution via PyO3, Elasticsearch, and AES-256-GCM credential encryption.',
      tags: ['Security', 'VAPT', 'Rust', 'Next.js'],
      image: '/images/projects/vulnessus.svg',
      techStack: ['Rust (Axum)', 'Next.js', 'Python (PyO3)', 'Elasticsearch', 'MongoDB', 'AES-256-GCM'],
      featured: true,
    },
    {
      slug: 'dpdp-scanner',
      title: 'DPDP Act Compliance Scanner',
      description: 'A Python-based automated privacy scanner architecture implementing a 23-rule coverage matrix, analogous CVSS scoring, and seamless integration as a Vulnessus plugin.',
      tags: ['Compliance', 'Privacy', 'Python', 'Security'],
      image: '/images/projects/dpdp-scanner.svg',
      techStack: ['Python', 'CVSS-like Scoring', 'Plugin Architecture', 'Regex Engine'],
      featured: true,
    },
    {
      slug: 'phishing-detector',
      title: 'Phishing Detection System',
      description: 'A Python-based multi-factor phishing URL detector achieving 95% accuracy through URL heuristics, WHOIS analysis, and threat intelligence feed correlation.',
      tags: ['Security', 'Detection', 'Python'],
      image: '/images/projects/phishing-detector.svg',
      techStack: ['Python', 'NLP', 'WHOIS API', 'scikit-learn', 'BeautifulSoup'],
      featured: true,
    },
    {
      slug: 'offensive-toolkit',
      title: 'Offensive Security Automation Toolkit',
      description: 'A collection of reconnaissance and vulnerability correlation automation modules in Python and Bash, reducing manual effort by 30% across active VAPT engagements.',
      tags: ['Automation', 'Security', 'Python', 'Bash'],
      image: '/images/projects/offensive-toolkit.svg',
      techStack: ['Python', 'Bash', 'API Integration', 'Nmap API', 'Shodan API', 'Nessus API'],
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

'use client';

import { SITE_CONFIG } from '@/lib/constants';
import { Mail, ArrowUp } from 'lucide-react';
import { LinkedInLogoIcon as Linkedin, GitHubLogoIcon as Github } from '@radix-ui/react-icons';
import Link from 'next/link';
import VisitorCounter from './VisitorCounter';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 border-t-2 border-black dark:bg-black dark:border-white/10 transition-colors duration-300">
      <div className="container-custom py-8 sm:py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-12">
          {/* Brand column */}
          <div className="space-y-4">
            <h3 className="font-syne text-2xl font-extrabold uppercase tracking-tight text-crimson">
              {SITE_CONFIG.name}
            </h3>
            <p className="text-slate-600 dark:text-gray-400 text-sm font-medium leading-relaxed">
              Cybersecurity analyst building resilient systems and pragmatic security solutions.
            </p>
            <div className="flex gap-3">
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="w-10 h-10 rounded-none bg-white border-2 border-black hover:border-crimson hover:bg-crimson/10 dark:bg-dark-card dark:border-white/10 dark:hover:border-crimson dark:hover:bg-crimson/10 flex items-center justify-center transition-all duration-150 group touch-manipulation"
                aria-label="Email"
              >
                <Mail size={16} className="text-black group-hover:text-crimson dark:text-white" />
              </a>
              <a
                href={SITE_CONFIG.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-none bg-white border-2 border-black hover:border-crimson hover:bg-crimson/10 dark:bg-dark-card dark:border-white/10 dark:hover:border-crimson dark:hover:bg-crimson/10 flex items-center justify-center transition-all duration-150 group touch-manipulation"
                aria-label="LinkedIn"
              >
                <Linkedin width={16} height={16} className="text-black group-hover:text-crimson dark:text-white" />
              </a>
              <a
                href={SITE_CONFIG.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-none bg-white border-2 border-black hover:border-crimson hover:bg-crimson/10 dark:bg-dark-card dark:border-white/10 dark:hover:border-crimson dark:hover:bg-crimson/10 flex items-center justify-center transition-all duration-150 group touch-manipulation"
                aria-label="GitHub"
              >
                <Github width={16} height={16} className="text-black group-hover:text-crimson dark:text-white" />
              </a>
            </div>
          </div>

          {/* Services column */}
          <div>
            <h4 className="font-extrabold uppercase text-xs tracking-wider text-black dark:text-white mb-4">Services</h4>
            <ul className="space-y-3 font-semibold text-sm">
              <li>
                <a href="#" className="text-slate-600 hover:text-crimson dark:text-gray-400 dark:hover:text-crimson transition-colors">
                  Penetration Testing
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-600 hover:text-crimson dark:text-gray-400 dark:hover:text-crimson transition-colors">
                  Vulnerability Assessment
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-600 hover:text-crimson dark:text-gray-400 dark:hover:text-crimson transition-colors">
                  Security Automation
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-600 hover:text-crimson dark:text-gray-400 dark:hover:text-crimson transition-colors">
                  Threat Intelligence
                </a>
              </li>
            </ul>
          </div>

          {/* Resources column */}
          <div>
            <h4 className="font-extrabold uppercase text-xs tracking-wider text-black dark:text-white mb-4">Resources</h4>
            <ul className="space-y-3 font-semibold text-sm">
              <li>
                <Link href="/projects" className="text-slate-600 hover:text-crimson dark:text-gray-400 dark:hover:text-crimson transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <a href="#about" className="text-slate-600 hover:text-crimson dark:text-gray-400 dark:hover:text-crimson transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#expertise" className="text-slate-600 hover:text-crimson dark:text-gray-400 dark:hover:text-crimson transition-colors">
                  Expertise
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE_CONFIG.email}`} className="text-slate-600 hover:text-crimson dark:text-gray-400 dark:hover:text-crimson transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Connect column */}
          <div>
            <h4 className="font-extrabold uppercase text-xs tracking-wider text-black dark:text-white mb-4">Connect</h4>
            <ul className="space-y-3 font-semibold text-sm">
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-slate-600 hover:text-crimson dark:text-gray-400 dark:hover:text-crimson transition-colors block"
                >
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-crimson dark:text-gray-400 dark:hover:text-crimson transition-colors block"
                >
                  LinkedIn Profile
                </a>
              </li>
              <li className="text-slate-500 dark:text-gray-500 text-xs font-bold uppercase tracking-wider pt-2">
                {SITE_CONFIG.location}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 sm:pt-8 border-t-2 border-black dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
            <p className="text-slate-600 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">
              © {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </p>
            <VisitorCounter />
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <a
              href={SITE_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-crimson dark:text-gray-400 dark:hover:text-crimson transition-colors min-h-[44px] flex items-center touch-manipulation"
            >
              GitHub
            </a>
            <a
              href={SITE_CONFIG.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-crimson dark:text-gray-400 dark:hover:text-crimson transition-colors min-h-[44px] flex items-center touch-manipulation"
            >
              LinkedIn
            </a>
          </div>

          {/* Scroll to top */}
          <a
            href="#"
            className="w-10 h-10 rounded-none border-2 border-black text-black bg-white hover:bg-crimson hover:text-white dark:border-white/30 dark:bg-dark-card dark:text-white dark:hover:bg-crimson dark:hover:text-white flex items-center justify-center transition-all duration-150 group touch-manipulation"
            aria-label="Scroll to top"
          >
            <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </div>
    </footer>
  );
}



'use client';

import { SITE_CONFIG } from '@/lib/constants';
import { Mail, Linkedin, Github, ArrowUp } from 'lucide-react';
import Link from 'next/link';
import VisitorCounter from './VisitorCounter';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 border-t border-slate-200 dark:bg-dark dark:border-white/5 transition-colors duration-300">
      <div className="container-custom py-8 sm:py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-12">
          {/* Brand column */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold text-gradient-cyan">
              {SITE_CONFIG.name}
            </h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">
              Cybersecurity analyst building resilient systems and pragmatic security solutions.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="w-11 h-11 sm:w-10 sm:h-10 rounded-lg bg-white border border-slate-200 hover:border-cyan-600/50 hover:bg-cyan-600/10 dark:bg-dark-lighter dark:border-white/5 dark:hover:border-cyan/50 dark:hover:bg-cyan/10 flex items-center justify-center transition-all duration-300 group touch-manipulation"
                aria-label="Email"
              >
                <Mail size={18} className="text-slate-500 group-hover:text-cyan-600 dark:text-gray-400 dark:group-hover:text-cyan" />
              </a>
              <a
                href={SITE_CONFIG.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 sm:w-10 sm:h-10 rounded-lg bg-white border border-slate-200 hover:border-cyan-600/50 hover:bg-cyan-600/10 dark:bg-dark-lighter dark:border-white/5 dark:hover:border-cyan/50 dark:hover:bg-cyan/10 flex items-center justify-center transition-all duration-300 group touch-manipulation"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} className="text-slate-500 group-hover:text-cyan-600 dark:text-gray-400 dark:group-hover:text-cyan" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 sm:w-10 sm:h-10 rounded-lg bg-white border border-slate-200 hover:border-cyan-600/50 hover:bg-cyan-600/10 dark:bg-dark-lighter dark:border-white/5 dark:hover:border-cyan/50 dark:hover:bg-cyan/10 flex items-center justify-center transition-all duration-300 group touch-manipulation"
                aria-label="GitHub"
              >
                <Github size={18} className="text-slate-500 group-hover:text-cyan-600 dark:text-gray-400 dark:group-hover:text-cyan" />
              </a>
            </div>
          </div>

          {/* Services column */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Services</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan transition-colors text-sm">
                  Penetration Testing
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan transition-colors text-sm">
                  Vulnerability Assessment
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan transition-colors text-sm">
                  Security Automation
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan transition-colors text-sm">
                  Threat Intelligence
                </a>
              </li>
            </ul>
          </div>

          {/* Resources column */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/projects" className="text-slate-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan transition-colors text-sm">
                  Projects
                </Link>
              </li>
              <li>
                <a href="#about" className="text-slate-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan transition-colors text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="#expertise" className="text-slate-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan transition-colors text-sm">
                  Expertise
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE_CONFIG.email}`} className="text-slate-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Connect column */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-slate-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan transition-colors text-sm block"
                >
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan transition-colors text-sm block"
                >
                  LinkedIn Profile
                </a>
              </li>
              <li className="text-slate-500 dark:text-gray-400 text-sm pt-2">
                {SITE_CONFIG.location}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 sm:pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
            <p className="text-slate-500 dark:text-gray-400 text-xs sm:text-sm">
              © {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </p>
            <VisitorCounter />
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <a href="#" className="text-slate-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan transition-colors min-h-[44px] flex items-center touch-manipulation">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan transition-colors min-h-[44px] flex items-center touch-manipulation">
              Terms of Service
            </a>
          </div>

          {/* Scroll to top */}
          <a
            href="#"
            className="w-11 h-11 sm:w-10 sm:h-10 rounded-lg bg-cyan-600/10 border border-cyan-600/30 hover:bg-cyan-600 hover:text-white text-cyan-600 dark:bg-cyan/10 dark:border-cyan/30 dark:hover:bg-cyan dark:hover:text-dark dark:text-cyan flex items-center justify-center transition-all duration-300 hover:glow-cyan group touch-manipulation"
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} className="group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </div>
    </footer>
  );
}



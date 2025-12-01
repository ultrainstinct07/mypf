'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { SITE_CONFIG } from '@/lib/constants';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref} className="section-padding bg-white dark:bg-dark-lighter transition-colors duration-300">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Left content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block"
            >
              <span className="text-cyan-600 dark:text-cyan text-sm font-semibold uppercase tracking-wider">
                About Me
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-display text-4xl md:text-5xl font-bold leading-tight text-slate-900 dark:text-white"
            >
              A Deep Dive into My{' '}
              <span className="text-gradient-cyan">Life&apos;s Experiences</span> and
              Lessons Learned
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="space-y-4 text-slate-600 dark:text-gray-300 text-lg leading-relaxed"
            >
              <p>{SITE_CONFIG.bio.paragraph1}</p>
              <p>{SITE_CONFIG.bio.paragraph2}</p>
            </motion.div>

            {/* Key highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="grid grid-cols-2 gap-4 pt-6"
            >
              <div className="space-y-1">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan">Burp Suite</div>
                <div className="text-sm text-slate-500 dark:text-gray-400">Professional</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan">OWASP Top 10</div>
                <div className="text-sm text-slate-500 dark:text-gray-400">Remediation</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan">Python</div>
                <div className="text-sm text-slate-500 dark:text-gray-400">Security Tools</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan">Pentesting</div>
                <div className="text-sm text-slate-500 dark:text-gray-400">Mobile & Web</div>
              </div>
            </motion.div>
          </div>

          {/* Right content - Portrait card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative lg:justify-self-end w-full max-w-md"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-br from-cyan-600/20 to-sky-500/20 dark:from-cyan/20 dark:to-cyan-secondary/20 rounded-3xl blur-2xl opacity-50" />
              
              {/* Portrait card */}
              <div className="relative bg-slate-50 dark:bg-dark rounded-3xl overflow-hidden border border-cyan-600/20 dark:border-cyan/20 glow-cyan shadow-xl dark:shadow-none">
                <div className="aspect-[3/4] relative">
                  <Image
                    src="/images/about-portrait.png"
                    alt="Kshitiz Kumar working on security analysis"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-dark via-transparent to-transparent" />
                </div>

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 dark:from-dark to-transparent">
                  <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">{SITE_CONFIG.name}</h3>
                  <p className="text-cyan-600 dark:text-cyan text-sm font-medium mb-2">
                    {SITE_CONFIG.role}
                  </p>
                  <p className="text-slate-500 dark:text-gray-400 text-sm">
                    {SITE_CONFIG.employmentStatus || 'Full-time'} @ {SITE_CONFIG.company}
                  </p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-600/10 dark:bg-cyan/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-sky-500/10 dark:bg-cyan-secondary/10 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}



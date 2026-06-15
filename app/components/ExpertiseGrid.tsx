'use client';

import { motion } from 'framer-motion';
import { EXPERTISE_ITEMS } from '@/lib/constants';
import { Target, Smartphone, Search, Code, Shield, BookOpen, type LucideIcon } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const iconMap: Record<string, LucideIcon> = {
  'target': Target,
  'smartphone': Smartphone,
  'search': Search,
  'code': Code,
  'shield': Shield,
  'book-open': BookOpen,
};

export default function ExpertiseGrid() {
  return (
    <ScrollReveal
      id="expertise"
      className="section-padding bg-transparent transition-colors duration-300"
    >
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="text-crimson text-sm font-extrabold uppercase tracking-wider">
            What I Do
          </span>

          <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase mt-4 mb-4 sm:mb-6 text-black dark:text-white">
            My <span className="text-crimson">Expertise</span>
          </h2>

          <p className="text-slate-700 dark:text-gray-300 text-base max-w-2xl mx-auto font-medium">
            Specializing in offensive security, application testing, threat intelligence, security engineering, and continuous research.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {EXPERTISE_ITEMS.map((item, index) => {
            const Icon = iconMap[item.icon];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  delay: index * 0.06,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group"
              >
                <div className="relative">
                  <div className="relative bg-white dark:bg-dark-card rounded-none p-6 sm:p-8 border-2 border-black dark:border-white/10 hover:border-crimson dark:hover:border-crimson transition-all duration-200 hover:-translate-y-1 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.05)] hover:shadow-[6px_6px_0px_#D90429] dark:hover:shadow-[6px_6px_0px_#D90429]">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-6">
                      <div className="relative w-full h-full bg-crimson border-2 border-black dark:border-white rounded-none flex items-center justify-center">
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" strokeWidth={2.5} />
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold uppercase text-center mb-3 text-black dark:text-white group-hover:text-crimson dark:group-hover:text-crimson transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-gray-400 text-center text-xs sm:text-sm font-medium leading-relaxed">
                      {item.description}
                    </p>

                    <div className="absolute top-4 right-4 w-2 h-2 bg-crimson rounded-none opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-slate-600 dark:text-gray-400 mb-6 font-bold uppercase tracking-wider text-xs">
            Want to learn more about my security approach?
          </p>
          <a href="/projects" className="btn-outline inline-flex items-center gap-2">
            View My Work
          </a>
        </div>
      </div>
    </ScrollReveal>
  );
}

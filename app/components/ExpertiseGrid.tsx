'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { EXPERTISE_ITEMS } from '@/lib/constants';
import { Target, Smartphone, Search, Code, BookOpen } from 'lucide-react';

const iconMap: { [key: string]: any } = {
  'target': Target,
  'smartphone': Smartphone,
  'search': Search,
  'code': Code,
  'book-open': BookOpen,
};

export default function ExpertiseGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="expertise" ref={ref} className="section-padding bg-slate-50 dark:bg-dark transition-colors duration-300">
      <div className="container-custom">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-cyan-600 dark:text-cyan text-sm font-semibold uppercase tracking-wider"
          >
            What I Do
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-4 sm:mb-6 text-slate-900 dark:text-white"
          >
            My{' '}
            <span className="text-gradient-cyan">Expertise</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-slate-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto"
          >
            Specializing in offensive security, application testing, threat intelligence, security engineering, and continuous research.
          </motion.p>
        </motion.div>

        {/* Expertise cards grid with staggered animations */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
              }
            }
          }}
        >
          {EXPERTISE_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            
            return (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.95 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                    }
                  }
                }}
                className="group"
              >
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-cyan-600/10 dark:bg-cyan/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Card */}
                  <div className="relative bg-white dark:bg-dark-lighter rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200 dark:border-cyan/20 hover:border-cyan-600/40 dark:hover:border-cyan/40 transition-all duration-300 hover:glow-cyan group-hover:scale-105 transform shadow-md dark:shadow-none">
                    {/* Icon circle */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
                      <div className="absolute inset-0 bg-cyan-600/20 dark:bg-cyan/20 rounded-full animate-pulse" />
                      <div className="relative w-full h-full bg-gradient-to-br from-cyan-600 to-sky-500 dark:from-cyan dark:to-cyan-secondary rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white dark:text-dark" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg sm:text-xl font-bold text-center mb-2 sm:mb-3 text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 dark:text-gray-400 text-center text-xs sm:text-sm leading-relaxed">
                      {item.description}
                    </p>

                    {/* Decorative corner accent */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-600 dark:bg-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6">
            Want to learn more about my security approach?
          </p>
          <a
            href="#projects"
            className="btn-outline inline-flex items-center gap-2"
          >
            View My Work
          </a>
        </motion.div>
      </div>
    </section>
  );
}



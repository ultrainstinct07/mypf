'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { TESTIMONIALS, SITE_CONFIG } from '@/lib/constants';
import { Quote } from 'lucide-react';

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="testimonials" ref={ref} className="section-padding bg-transparent transition-colors duration-300">
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
            className="text-crimson text-sm font-extrabold uppercase tracking-wider"
          >
            Testimonials
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-syne text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase mt-4 text-black dark:text-white"
          >
            What <span className="text-crimson">People Say</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-slate-700 dark:text-gray-300 text-base max-w-2xl mx-auto font-medium"
          >
            Feedback from colleagues and collaborators I&apos;ve worked with on security projects.
          </motion.p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="relative h-full bg-white dark:bg-dark-card rounded-none p-6 border-2 border-black dark:border-white/10 hover:border-crimson dark:hover:border-crimson transition-all duration-200 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.05)] hover:shadow-[6px_6px_0px_#D90429] dark:hover:shadow-[6px_6px_0px_#D90429]">
                {/* Quote icon */}
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-crimson border-2 border-black dark:border-white rounded-none flex items-center justify-center shadow-md">
                  <Quote className="w-5 h-5 text-white" fill="currentColor" />
                </div>

                {/* Company logo placeholder */}
                <div className="mb-6 mt-4">
                  <div className="w-full h-8 flex items-center">
                    <div className="text-lg font-extrabold uppercase tracking-wider text-slate-700 dark:text-gray-400 group-hover:text-crimson dark:group-hover:text-crimson transition-colors">
                      {testimonial.company}
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-slate-600 dark:text-gray-300 text-sm font-medium leading-relaxed mb-6 min-h-[100px]">
                  &quot;{testimonial.quote}&quot;
                </blockquote>

                {/* Author */}
                <div className="pt-4 border-t-2 border-black/10 dark:border-white/10">
                  <div className="font-extrabold uppercase tracking-wide text-sm text-black dark:text-white group-hover:text-crimson dark:group-hover:text-crimson transition-colors">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-slate-600 dark:text-gray-400 text-sm font-bold uppercase tracking-wider text-xs">
            Want to work together?{' '}
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-crimson hover:underline font-bold"
            >
              Let&apos;s talk
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}



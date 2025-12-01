'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { TESTIMONIALS } from '@/lib/constants';
import { Quote } from 'lucide-react';
import Image from 'next/image';

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-dark-lighter">
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
            className="text-cyan text-sm font-semibold uppercase tracking-wider"
          >
            Testimonials
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-display text-4xl md:text-5xl font-bold mt-4"
          >
            What <span className="text-gradient-cyan">People Say</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-gray-300 text-lg mt-4 max-w-2xl mx-auto"
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
              <div className="relative h-full bg-dark rounded-2xl p-6 border border-white/5 hover:border-cyan/30 transition-all duration-300 hover:glow-cyan">
                {/* Quote icon */}
                <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-cyan to-cyan-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <Quote className="w-6 h-6 text-dark" fill="currentColor" />
                </div>

                {/* Company logo placeholder */}
                <div className="mb-6 mt-4">
                  <div className="w-full h-8 flex items-center">
                    <div className="text-xl font-bold text-gray-400 group-hover:text-cyan transition-colors">
                      {testimonial.company}
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-gray-300 text-sm leading-relaxed mb-6 min-h-[100px]">
                  &quot;{testimonial.quote}&quot;
                </blockquote>

                {/* Author */}
                <div className="pt-4 border-t border-white/5">
                  <div className="font-semibold text-white group-hover:text-cyan transition-colors">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {testimonial.role}
                  </div>
                </div>

                {/* Decorative glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
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
          <p className="text-gray-400 text-sm">
            Want to work together?{' '}
            <a
              href="mailto:bbruce670@gmail.com"
              className="text-cyan hover:underline font-medium"
            >
              Let&apos;s talk
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}



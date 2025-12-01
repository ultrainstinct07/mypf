'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { EXPERTISE_ITEMS } from '@/lib/constants';
import { Shield, Search, Layers, Workflow } from 'lucide-react';

const iconMap: { [key: string]: any } = {
  'shield-check': Shield,
  'search': Search,
  'layers': Layers,
  'workflow': Workflow,
};

export default function ExpertiseGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="expertise" ref={ref} className="section-padding bg-dark">
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
            My Capabilities
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6"
          >
            I Have Expertise to{' '}
            <span className="text-gradient-cyan">Tackle Challenges</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-gray-300 text-lg max-w-2xl mx-auto"
          >
            My skill set combines modern security practices with pragmatic tools and intuitive workflows.
          </motion.p>
        </motion.div>

        {/* Expertise cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {EXPERTISE_ITEMS.map((item, index) => {
            const Icon = iconMap[item.icon];
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                className="group"
              >
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-cyan/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Card */}
                  <div className="relative bg-gradient-to-br from-cyan/10 to-cyan-secondary/5 rounded-3xl p-8 border border-cyan/20 hover:border-cyan/40 transition-all duration-300 hover:glow-cyan group-hover:scale-105 transform">
                    {/* Icon circle */}
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 bg-cyan/20 rounded-full animate-pulse" />
                      <div className="relative w-full h-full bg-gradient-to-br from-cyan to-cyan-secondary rounded-full flex items-center justify-center">
                        <Icon className="w-10 h-10 text-dark" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-center mb-3 group-hover:text-cyan transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-center text-sm leading-relaxed">
                      {item.description}
                    </p>

                    {/* Decorative corner accent */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

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



'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Mail, Linkedin, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden">
      {/* Diagonal stripe pattern background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan via-cyan to-cyan-secondary">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 35px,
              rgba(0, 0, 0, 0.3) 35px,
              rgba(0, 0, 0, 0.3) 70px
            )`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Main heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-dark mb-6 leading-tight"
          >
            Let&apos;s Whip Up
            <br />
            Something Fun!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-dark/80 text-xl md:text-2xl mb-12 font-medium"
          >
            Ready to enhance your security posture? Let&apos;s collaborate on your next project.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="group bg-dark text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-dark/90 hover:scale-105 transition-all duration-300 inline-flex items-center gap-3 shadow-2xl"
            >
              <Mail size={24} />
              Get Started
              <ArrowRight
                size={24}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            
            <a
              href={SITE_CONFIG.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/20 backdrop-blur-sm text-dark border-2 border-dark px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
            >
              <Linkedin size={24} />
              Connect on LinkedIn
              <ArrowRight
                size={24}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-12 pt-12 border-t-2 border-dark/20"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-dark/80">
              <div className="flex items-center gap-2">
                <Mail size={20} />
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="hover:text-dark hover:underline font-medium"
                >
                  {SITE_CONFIG.email}
                </a>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-dark/40 rounded-full" />
              <div className="flex items-center gap-2">
                <Linkedin size={20} />
                <span className="font-medium">{SITE_CONFIG.name}</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-dark/40 rounded-full" />
              <div className="font-medium">{SITE_CONFIG.location}</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-dark/5 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
    </section>
  );
}



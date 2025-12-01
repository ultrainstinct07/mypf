'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { SITE_CONFIG } from '@/lib/constants';
import { ArrowRight, Mail } from 'lucide-react';
import TypingEffect from './TypingEffect';
import ParticleBackground from './ParticleBackground';
import AnimatedCounter from './AnimatedCounter';
import { useParallax } from '../hooks/useParallax';

export default function Hero() {
  const parallaxSlow = useParallax({ speed: 0.15, direction: 'up' });
  const parallaxMedium = useParallax({ speed: 0.25, direction: 'up' });
  const parallaxFast = useParallax({ speed: 0.4, direction: 'down' });

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-x-clip pt-20 lg:pt-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-dark dark:via-dark dark:to-dark-lighter transition-colors duration-300">
      {/* Animated background grid with parallax */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-40 dark:opacity-20 transition-transform duration-100 ease-out"
        style={{ 
          transform: `translateY(${parallaxFast.y}px)` 
        }}
      />
      
      {/* Cyan glow effect with parallax */}
      <div 
        className="absolute top-10 right-10 sm:top-20 sm:right-20 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-cyan-600/10 dark:bg-cyan/10 rounded-full blur-[120px] animate-pulse transition-transform duration-100 ease-out" 
        style={{ 
          transform: `translateY(${parallaxSlow.y}px)`,
          opacity: parallaxSlow.opacity 
        }}
      />
      <div 
        className="absolute bottom-10 left-10 sm:bottom-20 sm:left-20 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-sky-500/10 dark:bg-cyan-secondary/10 rounded-full blur-[120px] animate-pulse transition-transform duration-100 ease-out" 
        style={{ 
          animationDelay: '1s',
          transform: `translateY(${parallaxMedium.y}px)`,
          opacity: parallaxMedium.opacity 
        }}
      />

      <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Small label */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-600/10 border border-cyan-600/20 text-cyan-600 dark:bg-cyan/10 dark:border-cyan/20 dark:text-cyan text-sm font-medium"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-600 dark:bg-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-600 dark:bg-cyan"></span>
              </span>
              Available for opportunities
            </motion.div>

            {/* Main headline */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white"
              >
                KSHITIZ
                <br />
                <span className="text-gradient-cyan">KUMAR</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-gray-300 leading-relaxed max-w-2xl min-h-[3rem]"
              >
                <TypingEffect
                  texts={[
                    'Red Team Analyst & Offensive Security Engineer — I specialize in red teaming, web/mobile pentesting, and building practical offensive-security tooling.',
                    'Offensive Security | Red Teaming | Vulnerability Research — I study real-world attack paths — privilege escalation, lateral movement, and exploitation — to strengthen systems before attackers do.',
                    'CRTA Certified Red Team Analyst — Breaking things to build better defenses. Web, Mobile, AD, and Cloud pentesting with hands-on red team operations.',
                  ]}
                  speed={50}
                  delayBetweenTexts={3000}
                />
              </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <a
                href="#projects"
                className="btn-primary inline-flex items-center gap-2 group"
              >
                View My Work
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="btn-outline inline-flex items-center gap-2 group"
              >
                <Mail size={20} />
                Contact for Opportunities
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>

            {/* Credibility markers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="space-y-2 pt-4"
            >
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-gray-300">
                <span className="px-3 py-1 bg-cyan-600/10 dark:bg-cyan/10 border border-cyan-600/20 dark:border-cyan/20 rounded-full font-semibold text-cyan-600 dark:text-cyan">
                  CRTA Certified
                </span>
                <span className="text-slate-500 dark:text-gray-400">•</span>
                <span>1+ Year @ {SITE_CONFIG.company}</span>
                <span className="text-slate-500 dark:text-gray-400">•</span>
                <span>Preparing for OSCP & CEH</span>
              </div>
            </motion.div>

            {/* Stats or badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-slate-200 dark:border-white/10"
            >
              <div>
                <div className="text-lg sm:text-xl font-bold text-cyan-600 dark:text-cyan">CRTA</div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">Red Team Ops</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-cyan-600 dark:text-cyan">1+ Years</div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">@ {SITE_CONFIG.company}</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-cyan-600 dark:text-cyan">Pentesting</div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">Web, Mobile, AD</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-cyan-600 dark:text-cyan">Tools</div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">Burp, Cobalt Strike</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right content - Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
            className="relative hidden lg:block lg:justify-self-center"
          >
            <div className="relative w-80 xl:w-96 aspect-square mx-auto z-10">
              {/* Glowing ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-600 via-sky-500 dark:from-cyan dark:via-cyan-secondary to-transparent opacity-20 blur-2xl animate-glow z-5" />
              
              {/* Base portrait container (circular frame) */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-cyan-600/30 dark:border-cyan/30 glow-cyan z-10">
                {/* Particle Background - inside the circular frame */}
                <div className="absolute inset-0 pointer-events-none z-0">
                  <ParticleBackground particleCount={30} />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 dark:from-cyan/10 to-transparent z-5" />
                <Image
                  src="/images/hero-portrait.png"
                  alt="Kshitiz Kumar - Cybersecurity Analyst"
                  fill
                  className="object-cover object-top relative z-10"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute left-0 bottom-1/4 -translate-x-1/2 bg-white border border-cyan-600/30 dark:bg-dark-lighter dark:border-cyan/30 rounded-2xl px-4 py-3 shadow-lg dark:shadow-none glow-cyan z-30"
              >
                <div className="text-sm text-cyan-600 dark:text-cyan font-semibold">CRTA Certified</div>
                <div className="text-xs text-slate-500 dark:text-gray-400">Red Team Analyst</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="absolute right-1 bottom-1/5 translate-x-1/2 bg-white border border-cyan-600/30 dark:bg-dark-lighter dark:border-cyan/30 rounded-2xl px-4 py-3 shadow-lg dark:shadow-none glow-cyan z-30"
              >
                <div className="text-sm text-cyan-600 dark:text-cyan font-semibold">Preparing for OSCP</div>
                <div className="text-xs text-slate-500 dark:text-gray-400">Red Teamer in Training</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className="absolute top-1/4 right-0 translate-x-1/2 bg-white border border-cyan-600/30 dark:bg-dark-lighter dark:border-cyan/30 rounded-2xl px-4 py-3 shadow-lg dark:shadow-none glow-cyan z-30"
              >
                <div className="text-sm text-cyan-600 dark:text-cyan font-semibold">1+ Years</div>
                <div className="text-xs text-slate-500 dark:text-gray-400">Offensive Security</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-1 sm:gap-2 text-slate-500 dark:text-gray-400">
          <span className="text-[10px] sm:text-xs uppercase tracking-wider">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-5 h-8 sm:w-6 sm:h-10 rounded-full border-2 border-cyan-600/30 dark:border-cyan/30 flex items-start justify-center p-1.5 sm:p-2"
          >
            <motion.div className="w-1 h-1.5 sm:h-2 bg-cyan-600 dark:bg-cyan rounded-full" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}



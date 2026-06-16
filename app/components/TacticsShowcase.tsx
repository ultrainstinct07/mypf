'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Crosshair, Shield, Terminal } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useBoldScrollMotion } from '../hooks/useBoldScrollMotion';

export default function TacticsShowcase() {
  const motionEnabled = useBoldScrollMotion();

  const categories = [
    {
      id: 'pentesting',
      title: 'Pentesting Guides',
      desc: 'Offensive tactics covering web vulnerabilities and service/protocol exploitation techniques.',
      count: '75+ Guides',
      icon: Crosshair,
      color: 'text-crimson',
      borderColor: 'group-hover:border-crimson',
      shadowColor: 'group-hover:shadow-[4px_4px_0px_rgba(217,4,41,0.3)]',
    },
    {
      id: 'hardening',
      title: 'Hardening Defenses',
      desc: 'Defense-in-depth system configuration benchmarks for services, networks, and servers.',
      count: '13+ Benchmarks',
      icon: Shield,
      color: 'text-emerald-500',
      borderColor: 'group-hover:border-emerald-500',
      shadowColor: 'group-hover:shadow-[4px_4px_0px_rgba(16,185,129,0.3)]',
    },
    {
      id: 'tools',
      title: 'Security Tooling',
      desc: 'Cheat-sheets, CLI commands, and usage instructions for VAPT and red team tools.',
      count: '55+ Tools',
      icon: Terminal,
      color: 'text-amber-500',
      borderColor: 'group-hover:border-amber-500',
      shadowColor: 'group-hover:shadow-[4px_4px_0px_rgba(245,158,11,0.3)]',
    },
  ];

  return (
    <ScrollReveal
      id="tactics-showcase"
      className="section-padding bg-transparent transition-colors duration-300 border-t-2 border-black dark:border-white/10"
    >
      <div className="container-custom">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-center">
          {/* Left Side: Call to Action */}
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest bg-crimson text-white border border-black dark:border-white/20">
              Knowledge Base
            </span>

            <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase leading-tight text-black dark:text-white">
              Tactical <span className="text-crimson">Playbooks</span> & References
            </h2>

            <p className="text-slate-700 dark:text-gray-300 text-base leading-relaxed font-medium">
              An open-source repository of documentation, command cheat-sheets, and defense benchmarks. Built directly from active engagements, VAPT operations, and offensive security research.
            </p>

            <div className="pt-4">
              <Link
                href="/tactics"
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 border-2 border-black dark:border-white rounded-none text-[12px] sm:text-[13px] font-extrabold uppercase tracking-wider transition-all duration-200 min-h-[44px] touch-manipulation bg-black text-white dark:bg-white dark:text-black shadow-[4px_4px_0px_#D90429]"
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translate(-2px, -2px)';
                  el.style.boxShadow = '6px 6px 0px #D90429';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'none';
                  el.style.boxShadow = '4px 4px 0px #D90429';
                }}
              >
                Access Tactics KB
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </Link>
            </div>
          </div>

          {/* Right Side: Showcase Cards */}
          <div className="space-y-4">
            {categories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.id}
                  initial={motionEnabled ? { opacity: 0, x: 25 } : false}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={`/tactics/${cat.id}`}
                    className={`group block p-5 border-2 border-black/10 dark:border-white/10 bg-white dark:bg-dark-card hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all duration-200 ${cat.borderColor} ${cat.shadowColor}`}
                  >
                    <div className="flex gap-4 items-start">
                      <div className={`p-3 bg-secondary dark:bg-dark-lighter border border-black/10 dark:border-white/10 rounded-none shrink-0 ${cat.color}`}>
                        <Icon size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-syne font-extrabold uppercase text-sm sm:text-base text-black dark:text-white">
                            {cat.title}
                          </h3>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-theme-muted bg-secondary dark:bg-dark-lighter px-2 py-0.5 border border-black/5 dark:border-white/5">
                            {cat.count}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-theme-muted mt-2 leading-relaxed">
                          {cat.desc}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

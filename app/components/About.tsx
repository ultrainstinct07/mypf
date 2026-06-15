'use client';

import Image from 'next/image';
import { SITE_CONFIG } from '@/lib/constants';
import ScrollReveal from './ScrollReveal';

export default function About() {
  return (
    <ScrollReveal
      id="about"
      className="section-padding bg-transparent transition-colors duration-300"
    >
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-block text-crimson text-sm font-extrabold uppercase tracking-wider">
              About Me
            </span>

            <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase leading-tight text-black dark:text-white">
              Red Team Analyst &{' '}
              <span className="text-crimson">Offensive Security</span>{' '}
              Engineer
            </h2>

            <div className="space-y-4 text-black dark:text-gray-300 text-base leading-relaxed font-medium">
              <p>{SITE_CONFIG.bio.paragraph1}</p>
              <p>{SITE_CONFIG.bio.paragraph2}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 sm:pt-6">
              <div className="border-2 border-black dark:border-white/10 p-3 sm:p-4 rounded-none bg-secondary dark:bg-dark-lighter">
                <div className="text-lg sm:text-xl font-extrabold uppercase tracking-wider text-crimson">OSCP & OSCP+</div>
                <div className="text-xs text-slate-600 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">Certified</div>
              </div>
              <div className="border-2 border-black dark:border-white/10 p-3 sm:p-4 rounded-none bg-secondary dark:bg-dark-lighter">
                <div className="text-lg sm:text-xl font-extrabold uppercase tracking-wider text-crimson">Red Team</div>
                <div className="text-xs text-slate-600 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">AD & Lateral</div>
              </div>
              <div className="border-2 border-black dark:border-white/10 p-3 sm:p-4 rounded-none bg-secondary dark:bg-dark-lighter">
                <div className="text-lg sm:text-xl font-extrabold uppercase tracking-wider text-crimson">Pentesting</div>
                <div className="text-xs text-slate-600 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">Web, Mobile, Cloud</div>
              </div>
              <div className="border-2 border-black dark:border-white/10 p-3 sm:p-4 rounded-none bg-secondary dark:bg-dark-lighter">
                <div className="text-lg sm:text-xl font-extrabold uppercase tracking-wider text-crimson">Pentest Tools</div>
                <div className="text-xs text-slate-600 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">Cobalt Strike</div>
              </div>
            </div>
          </div>

          <div className="relative lg:justify-self-end w-full max-w-md mx-auto lg:mx-0">
            <div className="relative">
              <div
                className="relative bg-white dark:bg-dark rounded-none overflow-hidden border-2 border-black dark:border-white"
                style={{ boxShadow: '8px 8px 0px #D90429' }}
              >
                <div className="aspect-[3/4] relative">
                  <Image
                    src="/images/about-portrait.png"
                    alt="Kshitiz Kumar working on security analysis"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-dark via-transparent to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-black/10 dark:border-white/10 bg-white/90 dark:bg-black/90 backdrop-blur-xs">
                  <h3 className="text-lg font-extrabold uppercase tracking-wider mb-0.5 text-black dark:text-white">{SITE_CONFIG.name}</h3>
                  <p className="text-crimson text-xs font-bold uppercase tracking-wider mb-1">
                    {SITE_CONFIG.role}
                  </p>
                  <p className="text-slate-600 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                    {SITE_CONFIG.employmentStatus || 'Full-time'} @ {SITE_CONFIG.company}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

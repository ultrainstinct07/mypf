'use client';

import { motion } from 'framer-motion';
import { Lock, Shield } from 'lucide-react';
import type { ConfidentialEngagement } from '@/types';

interface ConfidentialProjectCardProps {
  engagement: ConfidentialEngagement;
  index: number;
}

export default function ConfidentialProjectCard({
  engagement,
  index,
}: ConfidentialProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.06, duration: 0.6 }}
      className="group relative h-full"
    >
      <div className="relative flex h-full flex-col bg-white dark:bg-dark-card rounded-none overflow-hidden border-2 border-black dark:border-white/10 border-dashed hover:border-crimson dark:hover:border-crimson transition-all duration-200 hover:-translate-y-1 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.05)] hover:shadow-[6px_6px_0px_#D90429] dark:hover:shadow-[6px_6px_0px_#D90429]">
        <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-dark-lighter border-b-2 border-dashed border-black dark:border-white/10">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(217,4,41,0.04)_10px,rgba(217,4,41,0.04)_20px)]">
            <div className="flex h-14 w-14 items-center justify-center border-2 border-black dark:border-white bg-crimson text-white shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_#fff]">
              <Lock size={24} strokeWidth={2.5} />
            </div>
            <span className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-extrabold uppercase tracking-wider">
              Under NDA
            </span>
          </div>

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-extrabold uppercase tracking-wider border border-black dark:border-white">
              {engagement.sector}
            </span>
            {engagement.count > 1 && (
              <span className="px-3 py-1 bg-crimson text-white text-[10px] font-extrabold uppercase tracking-wider border border-black dark:border-white/20">
                ×{engagement.count}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6 space-y-4">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold uppercase tracking-wide text-slate-900 dark:text-white group-hover:text-crimson dark:group-hover:text-crimson transition-colors mb-2">
              {engagement.title}
            </h3>
            <p className="text-slate-600 dark:text-gray-400 text-sm font-medium line-clamp-3 leading-relaxed">
              {engagement.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {engagement.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-slate-100 dark:bg-dark-lighter text-slate-600 dark:text-gray-300 text-xs font-bold uppercase rounded-none border border-slate-200 dark:border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center gap-2 pt-4 border-t border-dashed border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400">
            <Shield size={14} className="text-crimson shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Client &amp; scope confidential
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

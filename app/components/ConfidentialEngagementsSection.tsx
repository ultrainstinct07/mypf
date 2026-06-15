'use client';

import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import ConfidentialProjectCard from './ConfidentialProjectCard';
import AnimatedCounter from './AnimatedCounter';
import {
  CONFIDENTIAL_ENGAGEMENTS,
  CONFIDENTIAL_STATS,
} from '@/lib/confidential-engagements';

interface ConfidentialEngagementsSectionProps {
  compact?: boolean;
  className?: string;
}

export default function ConfidentialEngagementsSection({
  compact = false,
  className = '',
}: ConfidentialEngagementsSectionProps) {
  const engagements = compact
    ? CONFIDENTIAL_ENGAGEMENTS.slice(0, 3)
    : CONFIDENTIAL_ENGAGEMENTS;

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="mb-10 sm:mb-12"
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-crimson text-sm font-extrabold uppercase tracking-wider">
              <Lock size={14} />
              Confidential Work
            </span>
            <h3 className="font-syne text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase mt-4 text-black dark:text-white">
              <span className="text-crimson">{CONFIDENTIAL_STATS.displayLabel}</span>{' '}
              Engagements Under NDA
            </h3>
            <p className="text-slate-700 dark:text-gray-300 text-base mt-4 font-medium leading-relaxed">
              {CONFIDENTIAL_STATS.summary} The categories below represent real
              professional work — anonymized by sector and engagement type.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="text-center px-6 py-4 border-2 border-dashed border-black dark:border-white/20 bg-slate-50 dark:bg-dark-card shadow-[3px_3px_0px_#D90429]">
              <div className="text-3xl sm:text-4xl font-extrabold text-crimson font-syne">
                <AnimatedCounter end={CONFIDENTIAL_STATS.totalCount} suffix="+" />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1">
                Total Engagements
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {engagements.map((engagement, index) => (
          <ConfidentialProjectCard
            key={engagement.id}
            engagement={engagement}
            index={index}
          />
        ))}
      </div>

      {compact && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 text-center text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400"
        >
          {CONFIDENTIAL_ENGAGEMENTS.length - 3} more engagement categories on the full projects page
        </motion.p>
      )}
    </div>
  );
}

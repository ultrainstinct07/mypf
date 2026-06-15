'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export interface Skill {
  name: string;
  level: number; // 0-100
  color?: string;
}

interface SkillBarsProps {
  skills: Skill[];
  className?: string;
}

export default function SkillBars({ skills, className = '' }: SkillBarsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className={`space-y-6 ${className}`}>
      {skills.map((skill, index) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300">
              {skill.name}
            </span>
            <span className="text-sm text-crimson dark:text-crimson font-extrabold">
              {skill.level}%
            </span>
          </div>
          <div className="h-4 bg-slate-200 dark:bg-dark-card border-2 border-black dark:border-white/10 rounded-none overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
              transition={{
                delay: index * 0.1 + 0.3,
                duration: 1,
                ease: 'easeOut',
              }}
              className={`h-full rounded-none ${
                skill.color || 'bg-crimson'
              }`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}


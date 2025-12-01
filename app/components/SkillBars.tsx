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
            <span className="text-sm font-medium text-slate-600 dark:text-gray-300">
              {skill.name}
            </span>
            <span className="text-sm text-cyan-600 dark:text-cyan font-semibold">
              {skill.level}%
            </span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-dark-lighter rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
              transition={{
                delay: index * 0.1 + 0.3,
                duration: 1,
                ease: 'easeOut',
              }}
              className={`h-full rounded-full ${
                skill.color || 'bg-gradient-to-r from-cyan-600 to-sky-500 dark:from-cyan dark:to-cyan-secondary'
              }`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}


'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';

export interface TimelineItem {
  id: string;
  title: string;
  organization: string;
  location?: string;
  period: string;
  description: string;
  tags?: string[];
}

interface ExperienceTimelineProps {
  items: TimelineItem[];
  className?: string;
}

export default function ExperienceTimeline({
  items,
  className = '',
}: ExperienceTimelineProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-crimson dark:from-crimson via-crimson/40 dark:via-crimson/20 to-transparent opacity-30" />

      <div className="space-y-8">
        {items.map((item, index) => {
          const isExpanded = expandedId === item.id;
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: isEven ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative pl-20"
            >
              {/* Timeline dot */}
              <div className="absolute left-6 top-2.5 w-4 h-4 bg-crimson dark:bg-crimson rounded-none border-2 border-black dark:border-white shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#ffffff]" />

              {/* Content card */}
              <div
                className="bg-white dark:bg-dark-card border-2 border-black dark:border-white/10 rounded-none p-6 hover:border-crimson dark:hover:border-crimson hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.05)] hover:shadow-[5px_5px_0px_#D90429] dark:hover:shadow-[5px_5px_0px_#D90429]"
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-crimson dark:text-crimson font-bold uppercase tracking-wider text-sm">{item.organization}</p>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-slate-500 dark:text-gray-400 font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {item.period}
                    </div>
                    {item.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        {item.location}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed font-medium mb-4">
                  {item.description}
                </p>

                {isExpanded && item.tags && item.tags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2 pt-4 border-t-2 border-black/10 dark:border-white/10"
                  >
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-crimson/10 dark:bg-crimson/10 text-crimson dark:text-crimson text-xs font-bold uppercase tracking-wider rounded-none border border-crimson/20 dark:border-crimson/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}


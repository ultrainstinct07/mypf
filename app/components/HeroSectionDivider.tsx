'use client';

import { motion } from 'framer-motion';

export default function HeroSectionDivider() {
  return (
    <div className="relative px-0 py-3" aria-hidden>
      <motion.div
        initial={{ scaleX: 0, opacity: 0.6 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-40px', amount: 0.6 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="h-1 origin-left bg-crimson shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff]"
      />
      <motion.div
        initial={{ scaleX: 0, opacity: 0.4 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-40px', amount: 0.6 }}
        transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        className="mt-2 h-px origin-left bg-black/15 dark:bg-white/25"
      />
    </div>
  );
}

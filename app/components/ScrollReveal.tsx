'use client';

import { motion } from 'framer-motion';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useBoldScrollMotion } from '../hooks/useBoldScrollMotion';

interface ScrollRevealProps extends ComponentPropsWithoutRef<'section'> {
  children: ReactNode;
}

export default function ScrollReveal({
  children,
  className,
  ...props
}: ScrollRevealProps) {
  const motionEnabled = useBoldScrollMotion();

  return (
    <section className={className} {...props}>
      {motionEnabled ? (
        <motion.div
          initial={{ y: 40 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: '-50px', amount: 0.08 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      ) : (
        children
      )}
    </section>
  );
}

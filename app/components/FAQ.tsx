'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FAQ_ITEMS } from '@/lib/constants';
import { ChevronDown } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="faq" ref={ref} className="section-padding bg-slate-50 dark:bg-dark transition-colors duration-300">
      <div className="container-custom max-w-4xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-cyan-600 dark:text-cyan text-sm font-semibold uppercase tracking-wider"
          >
            FAQ
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-4 text-slate-900 dark:text-white"
          >
            Frequently Asked{' '}
            <span className="text-gradient-cyan">Questions</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-slate-600 dark:text-gray-300 text-base sm:text-lg mt-4"
          >
            Have any other questions? Feel free to reach out!
          </motion.p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Accordion.Root
            type="single"
            collapsible
            className="space-y-4"
          >
            {FAQ_ITEMS.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
              >
                <Accordion.Item
                  value={item.id}
                  className="bg-white dark:bg-dark-lighter rounded-2xl border border-slate-200 dark:border-white/5 hover:border-cyan-600/30 dark:hover:border-cyan/30 transition-all duration-300 overflow-hidden group shadow-sm dark:shadow-none"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="w-full flex items-center justify-between p-4 sm:p-6 text-left group/trigger min-h-[44px] touch-manipulation">
                      <span className="font-semibold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan transition-colors pr-4">
                        {item.question}
                      </span>
                      <ChevronDown
                        className="w-5 h-5 text-cyan-600 dark:text-cyan transition-transform duration-300 group-data-[state=open]/trigger:rotate-180 flex-shrink-0"
                        aria-hidden
                      />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-accordionSlideUp overflow-hidden">
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-slate-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                      {item.answer}
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </motion.div>
            ))}
          </Accordion.Root>
        </motion.div>

        {/* Contact prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center mt-8 sm:mt-12 p-6 sm:p-8 bg-white dark:bg-dark-lighter rounded-xl sm:rounded-2xl border border-cyan-600/20 dark:border-cyan/20 shadow-sm dark:shadow-none"
        >
          <h3 className="text-lg sm:text-xl font-bold mb-2 text-slate-900 dark:text-white">Still have questions?</h3>
          <p className="text-slate-500 dark:text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
            I&apos;m always happy to discuss your security needs and how I can help.
          </p>
          <a
            href="mailto:bbruce670@gmail.com"
            className="btn-primary inline-flex items-center gap-2 min-h-[44px] touch-manipulation"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}



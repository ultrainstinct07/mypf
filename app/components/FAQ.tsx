'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FAQ_ITEMS, SITE_CONFIG } from '@/lib/constants';
import { ChevronDown } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="faq" ref={ref} className="section-padding bg-slate-50 dark:bg-black transition-colors duration-300">
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
            className="text-crimson text-sm font-extrabold uppercase tracking-wider"
          >
            FAQ
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-syne text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase mt-4 text-black dark:text-white"
          >
            Frequently Asked <span className="text-crimson">Questions</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-slate-700 dark:text-gray-300 text-base mt-4 font-medium"
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
                  className="bg-white dark:bg-dark-card rounded-none border-2 border-black dark:border-white/10 hover:border-crimson dark:hover:border-crimson transition-all duration-200 overflow-hidden group shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.05)] hover:shadow-[4px_4px_0px_#D90429] dark:hover:shadow-[4px_4px_0px_#D90429]"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="w-full flex items-center justify-between p-4 sm:p-6 text-left group/trigger min-h-[44px] touch-manipulation">
                      <span className="font-extrabold uppercase text-sm sm:text-base text-black dark:text-white group-hover:text-crimson dark:group-hover:text-crimson transition-colors pr-4">
                        {item.question}
                      </span>
                      <ChevronDown
                        className="w-5 h-5 text-crimson transition-transform duration-300 group-data-[state=open]/trigger:rotate-180 flex-shrink-0"
                        aria-hidden
                      />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-accordionSlideUp overflow-hidden">
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-slate-700 dark:text-gray-300 text-sm sm:text-base font-medium leading-relaxed border-t border-black/5 dark:border-white/5 pt-4">
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
          className="text-center mt-8 sm:mt-12 p-6 sm:p-8 bg-white dark:bg-dark-card rounded-none border-2 border-black dark:border-white/10 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.05)]"
        >
          <h3 className="text-lg sm:text-xl font-extrabold uppercase tracking-wide mb-2 text-black dark:text-white">Still have questions?</h3>
          <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-base font-medium mb-4 sm:mb-6">
            I&apos;m always happy to discuss your security needs and how I can help.
          </p>
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="btn-primary inline-flex items-center gap-2 min-h-[44px] touch-manipulation"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}



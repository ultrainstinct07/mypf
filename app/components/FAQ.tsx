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
    <section id="faq" ref={ref} className="section-padding bg-dark">
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
            className="text-cyan text-sm font-semibold uppercase tracking-wider"
          >
            FAQ
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-display text-4xl md:text-5xl font-bold mt-4"
          >
            Frequently Asked{' '}
            <span className="text-gradient-cyan">Questions</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-gray-300 text-lg mt-4"
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
                  className="bg-dark-lighter rounded-2xl border border-white/5 hover:border-cyan/30 transition-all duration-300 overflow-hidden group"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="w-full flex items-center justify-between p-6 text-left group/trigger">
                      <span className="font-semibold text-lg group-hover:text-cyan transition-colors pr-4">
                        {item.question}
                      </span>
                      <ChevronDown
                        className="w-5 h-5 text-cyan transition-transform duration-300 group-data-[state=open]/trigger:rotate-180 flex-shrink-0"
                        aria-hidden
                      />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
                    <div className="px-6 pb-6 text-gray-300 leading-relaxed">
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
          className="text-center mt-12 p-8 bg-dark-lighter rounded-2xl border border-cyan/20"
        >
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-gray-400 mb-6">
            I&apos;m always happy to discuss your security needs and how I can help.
          </p>
          <a
            href="mailto:bbruce670@gmail.com"
            className="btn-primary inline-flex items-center gap-2"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}



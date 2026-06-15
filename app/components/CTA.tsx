'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Mail,
  ArrowRight,
  Phone,
  MapPin,
  Clock,
  Shield,
} from 'lucide-react';
import { LinkedInLogoIcon as Linkedin, GitHubLogoIcon as Github } from '@radix-ui/react-icons';
import { CONTACT_ENGAGEMENTS, SITE_CONFIG } from '@/lib/constants';

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden bg-crimson">
      <div className="absolute inset-0 bg-crimson">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 35px,
              rgba(0, 0, 0, 0.25) 35px,
              rgba(0, 0, 0, 0.25) 70px
            )`,
          }}
        />
      </div>

      <div className="relative z-10 container-custom py-24 md:py-32">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start">
          {/* Left — pitch & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-[11px] font-extrabold uppercase tracking-wider bg-black text-white border-2 border-white"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              Available for Security Consulting
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="font-syne text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase text-white mb-6 leading-[0.95]"
            >
              Let&apos;s Harden
              <br />
              Your Attack Surface
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="text-white/90 text-base sm:text-lg leading-relaxed mb-4 font-medium max-w-2xl"
            >
              OSCP, OSCP+, and CRTA certified offensive security engineer with 1.5+ years
              delivering VAPT, red team, and adversary simulation for government and enterprise
              clients — including 50+ engagements under NDA.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.45, duration: 0.8 }}
              className="text-white/75 text-sm sm:text-base leading-relaxed mb-8 font-medium max-w-2xl"
            >
              Share your scope, environment, and compliance requirements — web, mobile, AD,
              cloud, or critical infrastructure. I&apos;ll follow up with availability, approach,
              and next steps within 1–2 business days.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.55, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8"
            >
              <a
                href={`mailto:${SITE_CONFIG.email}?subject=Security%20Engagement%20Inquiry`}
                className="group bg-black text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-none font-bold uppercase tracking-wider text-sm sm:text-base hover:bg-black/95 transition-all duration-200 inline-flex items-center justify-center gap-2 sm:gap-3 shadow-[4px_4px_0px_#ffffff] hover:translate-x-[-2px] hover:translate-y-[-2px] min-h-[44px] touch-manipulation border-2 border-black"
              >
                <Mail size={20} />
                Email Me
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>

              <a
                href={SITE_CONFIG.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/10 text-white border-2 border-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-none font-bold uppercase tracking-wider text-sm sm:text-base hover:bg-white hover:text-black transition-all duration-200 inline-flex items-center justify-center gap-2 sm:gap-3 min-h-[44px] touch-manipulation"
              >
                <Linkedin width={20} height={20} />
                LinkedIn
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.65, duration: 0.8 }}
              className="flex items-start gap-3 text-white/80"
            >
              <Clock size={18} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-relaxed">
                Based in {SITE_CONFIG.location}. Open to remote engagements across India and
                selective international consulting. Detailed reports and scoping calls available
                on request.
              </p>
            </motion.div>
          </motion.div>

          {/* Right — contact card & services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-6"
          >
            <div className="bg-black border-2 border-white p-6 sm:p-8 shadow-[6px_6px_0px_#ffffff]">
              <h3 className="font-syne text-xl font-extrabold uppercase text-white mb-6">
                Direct Contact
              </h3>

              <ul className="space-y-4">
                <li>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="flex items-start gap-3 text-white/90 hover:text-white transition-colors group"
                  >
                    <Mail size={18} className="shrink-0 mt-0.5 text-crimson group-hover:scale-110 transition-transform" />
                    <span>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-white/50 mb-0.5">
                        Email
                      </span>
                      <span className="font-bold text-sm break-all">{SITE_CONFIG.email}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${SITE_CONFIG.phone.replace(/[^+\d]/g, '')}`}
                    className="flex items-start gap-3 text-white/90 hover:text-white transition-colors group"
                  >
                    <Phone size={18} className="shrink-0 mt-0.5 text-crimson group-hover:scale-110 transition-transform" />
                    <span>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-white/50 mb-0.5">
                        Phone
                      </span>
                      <span className="font-bold text-sm">{SITE_CONFIG.phone}</span>
                    </span>
                  </a>
                </li>
                <li className="flex items-start gap-3 text-white/90">
                  <MapPin size={18} className="shrink-0 mt-0.5 text-crimson" />
                  <span>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-white/50 mb-0.5">
                      Location
                    </span>
                    <span className="font-bold text-sm">{SITE_CONFIG.location}</span>
                  </span>
                </li>
                <li>
                  <a
                    href={SITE_CONFIG.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 text-white/90 hover:text-white transition-colors group"
                  >
                    <Linkedin width={18} height={18} className="shrink-0 mt-0.5 text-crimson group-hover:scale-110 transition-transform" />
                    <span>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-white/50 mb-0.5">
                        LinkedIn
                      </span>
                      <span className="font-bold text-sm">Connect professionally</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={SITE_CONFIG.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 text-white/90 hover:text-white transition-colors group"
                  >
                    <Github width={18} height={18} className="shrink-0 mt-0.5 text-crimson group-hover:scale-110 transition-transform" />
                    <span>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-white/50 mb-0.5">
                        GitHub
                      </span>
                      <span className="font-bold text-sm">Open-source security tools</span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="border-2 border-white/30 bg-black/20 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-5">
                <Shield size={18} className="text-white" />
                <h3 className="font-syne text-lg font-extrabold uppercase text-white">
                  Engagement Types
                </h3>
              </div>

              <ul className="grid sm:grid-cols-2 gap-4">
                {CONTACT_ENGAGEMENTS.map((item, index) => (
                  <motion.li
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                    transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                    className="border border-white/15 bg-black/30 p-4"
                  >
                    <p className="text-white font-extrabold uppercase text-xs tracking-wide mb-1.5">
                      {item.title}
                    </p>
                    <p className="text-white/70 text-xs leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

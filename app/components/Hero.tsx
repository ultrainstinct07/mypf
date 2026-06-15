'use client';

import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import { useEffect, useRef, useCallback } from 'react';
import { SITE_CONFIG } from '@/lib/constants';
import { CONFIDENTIAL_STATS } from '@/lib/confidential-engagements';
import { useBoldScrollMotion } from '../hooks/useBoldScrollMotion';

// ─────────────────────────────────────────────────────────────────────────────
// Static data (defined outside to prevent hydration mismatches)
// ─────────────────────────────────────────────────────────────────────────────

const PARTICLES: Array<{
  id: number; x: number; y: number; size: number;
  dur: number; delay: number; bright: boolean;
}> = [
  { id: 0,  x: 8,  y: 15, size: 1.5, dur: 14, delay: 0,   bright: true  },
  { id: 1,  x: 23, y: 72, size: 1.0, dur: 11, delay: 1.5, bright: false },
  { id: 2,  x: 45, y: 30, size: 2.0, dur: 16, delay: 3.0, bright: true  },
  { id: 3,  x: 67, y: 55, size: 1.5, dur: 9,  delay: 0.5, bright: false },
  { id: 4,  x: 82, y: 20, size: 1.0, dur: 13, delay: 2.0, bright: true  },
  { id: 5,  x: 12, y: 85, size: 2.0, dur: 10, delay: 4.0, bright: false },
  { id: 6,  x: 55, y: 90, size: 1.0, dur: 15, delay: 1.0, bright: true  },
  { id: 7,  x: 90, y: 65, size: 1.5, dur: 12, delay: 3.5, bright: false },
  { id: 8,  x: 33, y: 45, size: 1.0, dur: 17, delay: 2.5, bright: true  },
  { id: 9,  x: 75, y: 40, size: 2.0, dur: 8,  delay: 1.8, bright: false },
  { id: 10, x: 18, y: 50, size: 1.5, dur: 11, delay: 4.5, bright: true  },
  { id: 11, x: 60, y: 10, size: 1.0, dur: 14, delay: 0.8, bright: false },
  { id: 12, x: 40, y: 75, size: 2.0, dur: 10, delay: 3.2, bright: true  },
  { id: 13, x: 92, y: 30, size: 1.0, dur: 13, delay: 1.2, bright: false },
  { id: 14, x: 5,  y: 60, size: 1.5, dur: 16, delay: 2.8, bright: true  },
  { id: 15, x: 78, y: 80, size: 1.0, dur: 9,  delay: 0.3, bright: false },
  { id: 16, x: 50, y: 5,  size: 2.0, dur: 12, delay: 4.2, bright: true  },
  { id: 17, x: 25, y: 35, size: 1.0, dur: 15, delay: 1.7, bright: false },
];

const EXPERTISE_PILLS = [
  'Red Teaming',
  'Active Directory',
  'Web Pentesting',
  'MITRE ATT&CK',
  'Cloud Security',
  'Security Automation',
];

const STATS = [
  { value: '1.5+', label: 'Years Experience', shiftHint: null },
  { value: CONFIDENTIAL_STATS.displayLabel, label: 'NDA Engagements', shiftHint: null },
  { value: 'OSCP+', label: 'OffSec Advanced', shiftHint: '4' },
  { value: 'CRTA', label: 'Red Team Analyst', shiftHint: null },
];

const HEADLINE_LINES = ['SIMULATING ATTACKS', 'HARDENING DEFENSES'];

// ─────────────────────────────────────────────────────────────────────────────
// VideoBackground
// ─────────────────────────────────────────────────────────────────────────────
function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef  = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    video.addEventListener('ended', handleEnded);

    const init = async () => {
      try {
        const { default: Hls } = await import('hls.js');
        const src = 'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8';

        if (Hls.isSupported()) {
          const hls = new Hls({ enableWorker: false });
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
          });
          hlsRef.current = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
          video.play().catch(() => {});
        }
      } catch {
        // Fail silently — dark base background is still shown
      }
    };

    init();
    return () => {
      video.removeEventListener('ended', handleEnded);
      hlsRef.current?.destroy();
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-[72%_center] scale-[1.08]"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.72) 28%, rgba(5,5,5,0.28) 58%, rgba(5,5,5,0.06) 100%)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, transparent 62%, rgba(5,5,5,0.45) 100%)',
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CyberGrid
// ─────────────────────────────────────────────────────────────────────────────
function CyberGrid() {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
      {[20, 40, 60, 80].map((pct) => (
        <div
          key={pct}
          className="absolute top-0 bottom-0 w-px"
          style={{ left: `${pct}%`, background: 'rgba(255,255,255,0.05)' }}
        />
      ))}

      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(217,4,41,0.18) 15%, rgba(217,4,41,0.5) 50%, rgba(217,4,41,0.18) 85%, transparent 100%)',
          top: 0,
        }}
        animate={{ y: ['-5%', '105vh'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CentralGlow
// ─────────────────────────────────────────────────────────────────────────────
function CentralGlow() {
  return (
    <div
      className="absolute z-[2] pointer-events-none"
      style={{
        top: '50%',
        left: '35%',
        transform: 'translate(-50%, -50%)',
        width: 900,
        height: 400,
        opacity: 0.1,
      }}
    >
      <svg width="900" height="400" viewBox="0 0 900 400" aria-hidden>
        <defs>
          <filter id="hero-glow">
            <feGaussianBlur stdDeviation="30" />
          </filter>
          <radialGradient id="hero-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#D90429" />
            <stop offset="50%"  stopColor="#9B0218" />
            <stop offset="100%" stopColor="#9B0218" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse
          cx="450" cy="200" rx="420" ry="180"
          fill="url(#hero-gradient)"
          filter="url(#hero-glow)"
        />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FloatingParticles
// ─────────────────────────────────────────────────────────────────────────────
function FloatingParticles() {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.bright
              ? 'rgba(217,4,41,0.75)'
              : 'rgba(217,4,41,0.3)',
          }}
          animate={{ y: [0, -28, 0], opacity: [0.15, 0.8, 0.15] }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FloatingCredentialCard — identity + focus only (desktop)
// ─────────────────────────────────────────────────────────────────────────────
function FloatingCredentialCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.0, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[240px]"
    >
      <motion.div
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="relative w-full h-auto bg-black border-2 border-white"
          style={{ boxShadow: '6px 6px 0px #D90429' }}
        >
          <div className="flex flex-col gap-4 px-4 py-4 bg-black">
            <span
              className="inline-block w-fit text-[10px] font-extrabold tracking-[0.16em] uppercase px-3 py-1 bg-crimson text-white border border-white"
              style={{ fontFamily: 'var(--font-manrope)' }}
            >
              CRTA • OSCP • OSCP+
            </span>

            <div>
              <p
                className="text-[14px] font-extrabold uppercase tracking-tight text-white leading-tight"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                {SITE_CONFIG.name}
              </p>
              <p
                className="text-[11px] font-semibold uppercase tracking-wider mt-1"
                style={{ fontFamily: 'var(--font-space-grotesk)', color: '#D90429' }}
              >
                {SITE_CONFIG.role}
              </p>
              <p
                className="text-[10px] font-bold uppercase tracking-wider text-white/45 mt-1.5"
                style={{ fontFamily: 'var(--font-manrope)' }}
              >
                {SITE_CONFIG.company}
              </p>
            </div>

            <div className="w-full h-0.5 bg-white/20" />

            <p
              className="text-[11px] leading-relaxed text-gray-400"
              style={{ fontFamily: 'var(--font-manrope)' }}
            >
              Adversary simulation, MITRE ATT&CK mapping, and OWASP-aligned exploitation
              across enterprise environments.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ExpertisePills
// ─────────────────────────────────────────────────────────────────────────────
function ExpertisePills() {
  return (
    <motion.div
      className="flex flex-wrap gap-2"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05, delayChildren: 0.9 } },
      }}
    >
      {EXPERTISE_PILLS.map((pill) => (
        <motion.span
          key={pill}
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          whileHover={{ scale: 1.05 }}
          className="px-2.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-none cursor-default select-none border border-white/25 text-white/70 bg-transparent transition-colors duration-150"
          style={{ fontFamily: 'var(--font-manrope)' }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = '#D90429';
            el.style.color = '#fff';
            el.style.borderColor = '#D90429';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'transparent';
            el.style.color = 'rgba(255,255,255,0.7)';
            el.style.borderColor = 'rgba(255,255,255,0.25)';
          }}
        >
          {pill}
        </motion.span>
      ))}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StatCards
// ─────────────────────────────────────────────────────────────────────────────
function StatCards() {
  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08, delayChildren: 1.2 } },
      }}
    >
      {STATS.map((s) => (
        <motion.div
          key={s.label}
          variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
          className="rounded-none px-2 sm:px-3 py-2.5 sm:py-3 text-center border border-white/10 bg-black"
          style={{ boxShadow: '3px 3px 0px rgba(255, 255, 255, 0.05)' }}
          {...(s.shiftHint ? { 'data-ch': s.shiftHint } : {})}
          whileHover={{
            borderColor: '#D90429',
            boxShadow: '4px 4px 0px #D90429',
            y: -2,
          }}
        >
          <div
            className="text-lg sm:text-xl font-extrabold uppercase mb-0.5"
            style={{ color: '#D90429', fontFamily: 'var(--font-syne)' }}
          >
            {s.value}
          </div>
          <div
            className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider leading-tight"
            style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-manrope)' }}
          >
            {s.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero — main export
// ─────────────────────────────────────────────────────────────────────────────
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const scrollMotionEnabled = useBoldScrollMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const bgOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 0.4, 0]);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(useTransform(mouseX, [0, 1], [-10, 10]), {
    stiffness: 40,
    damping: 20,
  });
  const springY = useSpring(useTransform(mouseY, [0, 1], [-6, 6]), {
    stiffness: 40,
    damping: 20,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      mouseX.set((e.clientX - r.left) / r.width);
      mouseY.set((e.clientY - r.top) / r.height);
    },
    [mouseX, mouseY],
  );

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[100dvh] flex flex-col overflow-x-hidden"
      style={{ background: '#050505' }}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="absolute inset-0 z-0 origin-center"
        style={
          scrollMotionEnabled
            ? { opacity: bgOpacity, scale: bgScale }
            : undefined
        }
      >
        <VideoBackground />
        <CyberGrid />
        <CentralGlow />
        <FloatingParticles />
      </motion.div>

      <motion.div
        className="relative z-10 flex-1 flex items-start pt-6 xl:items-center"
        style={
          scrollMotionEnabled
            ? { y: contentY, opacity: contentOpacity }
            : undefined
        }
      >
        <motion.div className="w-full" style={{ x: springX, y: springY }}>
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-16 pt-20 pb-16 lg:py-0">
          <div className="grid lg:grid-cols-[1fr_240px] gap-8 lg:gap-12 xl:gap-16 items-start lg:items-center">

            <div className="space-y-4 lg:space-y-5 max-w-3xl">

              <motion.div
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              >
                <span
                  className="inline-flex items-center gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-none text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase border-2 border-crimson bg-crimson/5 text-crimson"
                  style={{ fontFamily: 'var(--font-manrope)' }}
                >
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-crimson" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-crimson" />
                  </span>
                  Available for Security Consulting
                </span>
              </motion.div>

              <div className="overflow-hidden">
                <h1
                  className="font-black leading-[0.9] tracking-tight uppercase"
                  style={{
                    fontFamily: 'var(--font-syne)',
                    fontSize: 'clamp(36px, 6vw, 72px)',
                  }}
                >
                  {HEADLINE_LINES.map((line, i) => (
                    <span key={line} className="block overflow-hidden">
                      <motion.span
                        className="block"
                        initial={{ y: '115%' }}
                        animate={{ y: '0%' }}
                        transition={{
                          duration: 0.9,
                          delay: 0.35 + i * 0.12,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{ color: '#fff' }}
                      >
                        {line}
                        <span style={{ color: '#D90429' }}>.</span>
                      </motion.span>
                    </span>
                  ))}
                </h1>
              </div>

              <motion.p
                className="text-sm sm:text-base leading-relaxed text-white/80 font-medium max-w-[650px]"
                style={{ fontFamily: 'var(--font-manrope)', lineHeight: '1.65' }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                {SITE_CONFIG.bio.short}
              </motion.p>

              <ExpertisePills />

              <motion.div
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <a
                  href="/projects"
                  className="group inline-flex items-center gap-2.5 px-5 sm:px-6 py-3 border-2 border-black dark:border-white rounded-none text-[12px] sm:text-[13px] font-extrabold uppercase tracking-wider transition-all duration-200 min-h-[44px] touch-manipulation bg-crimson text-white"
                  style={{
                    fontFamily: 'var(--font-manrope)',
                    boxShadow: '3px 3px 0px #ffffff',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translate(-2px, -2px)';
                    el.style.boxShadow = '5px 5px 0px #ffffff';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'none';
                    el.style.boxShadow = '3px 3px 0px #ffffff';
                  }}
                >
                  View My Work
                  <ArrowRight
                    size={15}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  />
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-3 border border-white/20 rounded-none text-[12px] sm:text-[13px] font-bold uppercase tracking-wider transition-all duration-200 hover:border-crimson hover:text-white min-h-[44px] touch-manipulation bg-white/5 text-white/80"
                  style={{ fontFamily: 'var(--font-manrope)' }}
                >
                  <Mail size={15} />
                  Get in Touch
                </a>
              </motion.div>

              <StatCards />
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <FloatingCredentialCard />
            </div>
          </div>
        </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 [@media(max-height:700px)]:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 1 }}
        aria-hidden
      >
        <span
          className="text-[9px] uppercase tracking-[0.22em]"
          style={{ color: 'rgba(255,255,255,0.22)', fontFamily: 'var(--font-manrope)' }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-none flex items-start justify-center p-1.5"
          style={{ border: '1px solid rgba(217,4,41,0.45)' }}
        >
          <div
            className="w-1.5 h-2.5 rounded-none"
            style={{ background: '#D90429' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

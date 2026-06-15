'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Briefcase, User, HelpCircle, Mail } from 'lucide-react';
import { useScrollPosition } from '../hooks/useScrollPosition';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/#about', label: 'About', icon: User },
  { href: '/#expertise', label: 'Expertise', icon: Briefcase },
  { href: '/projects', label: 'Projects', icon: Briefcase },
  { href: '/#faq', label: 'FAQ', icon: HelpCircle },
  { href: '/#contact', label: 'Contact', icon: Mail },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();
  const { scrollDirection, scrollPosition } = useScrollPosition();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (scrollPosition < 100) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
      return;
    }

    if (scrollDirection === 'up') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
    } else if (scrollDirection === 'down') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(false);
    }

  }, [scrollDirection, scrollPosition]);

  // Helper: determine active state for a nav link
  const isLinkActive = (href: string) => {
    if (href === '/projects') {
      return pathname === '/projects' || pathname.startsWith('/projects/');
    }

    return (
      href === pathname ||
      (href.startsWith('/#') && pathname === '/' && activeSection === href.substring(2))
    );
  };

  useEffect(() => {
    if (pathname === '/') {
      const handleScroll = () => {
        const sections = ['hero', 'about', 'expertise', 'projects', 'faq', 'contact'];
        const current = sections.find((section) => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });
        setActiveSection(current || '');
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [pathname]);

  const smoothScrollTo = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.substring(2);
      const element = document.getElementById(id);
      if (element) {
        // Custom smooth scroll with navbar offset
        const navbarHeight = 100; // Account for floating navbar + margin
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - navbarHeight;

        // Use custom smooth scroll for better control
        smoothScrollToPosition(offsetPosition, 800);
        setIsOpen(false);
      }
    }
  };

  // Custom smooth scroll function with easing
  const smoothScrollToPosition = (targetPosition: number, duration: number) => {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    // Ease-in-out cubic function for smooth animation
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      
      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 border-b-2 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      } bg-white border-black dark:bg-black dark:border-white/10`}
    >
      <div className="px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            href="/"
            className="font-syne text-lg sm:text-xl font-extrabold uppercase tracking-tighter text-crimson hover:text-crimson-secondary transition-colors relative z-10"
          >
            KSHITIZ KUMAR
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link.href);
              const Icon = link.icon;

              if (link.href.startsWith('/#')) {
                return (
                  <button
                    key={link.href}
                    onClick={() => smoothScrollTo(link.href)}
                    className={`px-3 py-1.5 rounded-none text-sm font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-crimson text-white border border-black dark:border-white/20'
                        : 'text-black hover:text-crimson hover:bg-black/5 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon size={14} />
                    {link.label}
                  </button>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-none text-sm font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-crimson text-white border border-black dark:border-white/20'
                      : 'text-black hover:text-crimson hover:bg-black/5 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  {link.label}
                </Link>
              );
            })}
            <div className="pl-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-black hover:text-crimson dark:text-gray-300 dark:hover:text-white transition-colors touch-manipulation"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="md:hidden fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-xs z-[-1] top-14 sm:top-16"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <div className="md:hidden border-t-2 border-black dark:border-white/10 py-2 space-y-1 max-w-7xl mx-auto bg-white dark:bg-black">
              {navLinks.map((link) => {
                const isActive = isLinkActive(link.href);
                const Icon = link.icon;

                if (link.href.startsWith('/#')) {
                  return (
                    <button
                      key={link.href}
                      onClick={() => smoothScrollTo(link.href)}
                      className={`w-full px-4 py-3 min-h-[44px] rounded-none text-left transition-colors flex items-center gap-3 touch-manipulation ${
                        isActive
                          ? 'bg-crimson text-white border-l-4 border-black dark:border-white'
                          : 'text-black hover:text-crimson hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/5'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="font-semibold uppercase tracking-wider text-sm">{link.label}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 min-h-[44px] rounded-none transition-colors flex items-center gap-3 touch-manipulation ${
                      isActive
                        ? 'bg-crimson text-white border-l-4 border-black dark:border-white'
                        : 'text-black hover:text-crimson hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="font-semibold uppercase tracking-wider text-sm">{link.label}</span>
                  </Link>
                );
              })}
              <div className="px-4 py-2 min-h-[44px] flex items-center">
                <ThemeToggle />
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}


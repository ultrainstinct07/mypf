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
  { href: '/#projects', label: 'Projects', icon: Briefcase },
  { href: '/projects', label: 'All Projects', icon: Briefcase },
  { href: '/#faq', label: 'FAQ', icon: HelpCircle },
  { href: '/#contact', label: 'Contact', icon: Mail },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();
  const { scrollDirection, scrollPosition } = useScrollPosition();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (scrollPosition < 100) {
      setIsVisible(true);
      return;
    }

    if (scrollDirection === 'up') {
      setIsVisible(true);
    } else if (scrollDirection === 'down') {
      setIsVisible(false);
    }

    setLastScrollY(scrollPosition);
  }, [scrollDirection, scrollPosition]);

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
      className={`fixed top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 z-40 rounded-xl sm:rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      } bg-white/80 border-slate-200/50 dark:bg-dark/70 dark:border-white/10`}
      style={{
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <div className="px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-lg sm:text-xl font-bold text-gradient-cyan hover:opacity-80 transition-opacity relative z-10"
          >
            Kshitiz Kumar
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === pathname ||
                (link.href.startsWith('/#') &&
                  pathname === '/' &&
                  activeSection === link.href.substring(2));
              const Icon = link.icon;

              if (link.href.startsWith('/#')) {
                return (
                  <button
                    key={link.href}
                    onClick={() => smoothScrollTo(link.href)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      isActive
                        ? 'bg-cyan-600/20 text-cyan-600 dark:bg-cyan/20 dark:text-cyan'
                        : 'text-slate-600 hover:text-cyan-600 hover:bg-cyan-600/10 dark:text-gray-300 dark:hover:text-cyan dark:hover:bg-cyan/10'
                    }`}
                  >
                    <Icon size={16} />
                    {link.label}
                  </button>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'bg-cyan-600/20 text-cyan-600 dark:bg-cyan/20 dark:text-cyan'
                      : 'text-slate-600 hover:text-cyan-600 hover:bg-cyan-600/10 dark:text-gray-300 dark:hover:text-cyan dark:hover:bg-cyan/10'
                  }`}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-600 hover:text-cyan-600 dark:text-gray-300 dark:hover:text-cyan transition-colors touch-manipulation"
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
              className="md:hidden fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-[-1] top-[calc(3.5rem+0.5rem)] sm:top-[calc(4rem+1rem)]"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <div className="md:hidden border-t border-slate-200 dark:border-white/10 py-2 space-y-1 max-w-7xl mx-auto">
              {navLinks.map((link) => {
                const isActive =
                  link.href === pathname ||
                  (link.href.startsWith('/#') &&
                    pathname === '/' &&
                    activeSection === link.href.substring(2));
                const Icon = link.icon;

                if (link.href.startsWith('/#')) {
                  return (
                    <button
                      key={link.href}
                      onClick={() => smoothScrollTo(link.href)}
                      className={`w-full px-4 py-3.5 min-h-[44px] rounded-lg text-left transition-colors flex items-center gap-3 touch-manipulation ${
                        isActive
                          ? 'bg-cyan-600/20 text-cyan-600 dark:bg-cyan/20 dark:text-cyan'
                          : 'text-slate-600 hover:text-cyan-600 hover:bg-cyan-600/10 dark:text-gray-300 dark:hover:text-cyan dark:hover:bg-cyan/10 active:bg-cyan-600/10 dark:active:bg-cyan/10'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{link.label}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3.5 min-h-[44px] rounded-lg transition-colors flex items-center gap-3 touch-manipulation ${
                      isActive
                        ? 'bg-cyan-600/20 text-cyan-600 dark:bg-cyan/20 dark:text-cyan'
                        : 'text-slate-600 hover:text-cyan-600 hover:bg-cyan-600/10 dark:text-gray-300 dark:hover:text-cyan dark:hover:bg-cyan/10 active:bg-cyan-600/10 dark:active:bg-cyan/10'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
              <div className="px-4 py-3.5 min-h-[44px]">
                <ThemeToggle />
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}


'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Briefcase, User, HelpCircle, Mail } from 'lucide-react';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { useHomeSectionSpy } from '../hooks/useHomeSectionSpy';
import { smoothScrollToSectionId } from '@/lib/smoothScroll';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/#about', label: 'About', icon: User },
  { href: '/#expertise', label: 'Expertise', icon: Briefcase },
  { href: '/projects', label: 'Projects', icon: Briefcase },
  { href: '/#faq', label: 'FAQ', icon: HelpCircle },
  { href: '/#contact', label: 'Contact', icon: Mail },
];

const mobileCompactLinks = navLinks.filter((link) => link.href === '/projects');

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { pastHero, activeSection } = useHomeSectionSpy();
  const { scrollDirection, scrollPosition } = useScrollPosition();
  const [isVisible, setIsVisible] = useState(true);

  const isHomeCompact = pathname === '/' && pastHero;
  const desktopLinks = isHomeCompact ? [] : navLinks;
  const mobileLinks = isHomeCompact ? mobileCompactLinks : navLinks;

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
  }, [scrollDirection, scrollPosition]);

  const isLinkActive = (href: string) => {
    if (href === '/projects') {
      return pathname === '/projects' || pathname.startsWith('/projects/');
    }

    if (href === '/') {
      return pathname === '/' && !pastHero;
    }

    return (
      href.startsWith('/#') &&
      pathname === '/' &&
      activeSection === href.substring(2)
    );
  };

  const smoothScrollTo = (href: string) => {
    if (href.startsWith('/#')) {
      smoothScrollToSectionId(href.substring(2));
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 border-b-2 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      } ${
        isHomeCompact
          ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md border-black/80 dark:border-white/10'
          : 'bg-white border-black dark:bg-black dark:border-white/10'
      }`}
    >
      <div className="px-3 sm:px-4 md:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between max-w-7xl mx-auto transition-all duration-300 ${
            isHomeCompact ? 'h-12' : 'h-14 sm:h-16'
          }`}
        >
          <Link
            href="/"
            className="font-syne text-lg sm:text-xl font-extrabold uppercase tracking-tighter text-crimson hover:text-crimson-secondary transition-colors relative z-10"
          >
            KSHITIZ KUMAR
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {desktopLinks.map((link) => {
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
            <div className={desktopLinks.length > 0 ? 'pl-2' : ''}>
              <ThemeToggle />
            </div>
          </div>

          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-black hover:text-crimson dark:text-gray-300 dark:hover:text-white transition-colors touch-manipulation"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <>
            <div
              className="md:hidden fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-xs z-[-1] top-14 sm:top-16"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <div className="md:hidden border-t-2 border-black dark:border-white/10 py-2 space-y-1 max-w-7xl mx-auto bg-white dark:bg-black">
              {mobileLinks.map((link) => {
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
                      <span className="font-semibold uppercase tracking-wider text-sm">
                        {link.label}
                      </span>
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
                    <span className="font-semibold uppercase tracking-wider text-sm">
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

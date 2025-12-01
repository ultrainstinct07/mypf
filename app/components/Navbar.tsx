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
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsOpen(false);
      }
    }
  };

  return (
    <nav
      className={`fixed top-4 left-4 right-4 z-40 rounded-2xl bg-dark/70 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
      style={{
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 217, 255, 0.1)',
      }}
    >
      <div className="px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-xl font-bold text-gradient-cyan hover:opacity-80 transition-opacity relative z-10"
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
                        ? 'bg-cyan/20 text-cyan'
                        : 'text-gray-300 hover:text-cyan hover:bg-cyan/10'
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
                      ? 'bg-cyan/20 text-cyan'
                      : 'text-gray-300 hover:text-cyan hover:bg-cyan/10'
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
            className="md:hidden p-2 text-gray-300 hover:text-cyan transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-2 max-w-7xl mx-auto">
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
                    className={`w-full px-4 py-3 rounded-lg text-left transition-colors flex items-center gap-3 ${
                      isActive
                        ? 'bg-cyan/20 text-cyan'
                        : 'text-gray-300 hover:text-cyan hover:bg-cyan/10'
                    }`}
                  >
                    <Icon size={18} />
                    {link.label}
                  </button>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                    isActive
                      ? 'bg-cyan/20 text-cyan'
                      : 'text-gray-300 hover:text-cyan hover:bg-cyan/10'
                  }`}
                >
                  <Icon size={18} />
                  {link.label}
                  </Link>
                );
              })}
              <div className="px-4 py-3">
                <ThemeToggle />
              </div>
          </div>
        )}
      </div>
    </nav>
  );
}


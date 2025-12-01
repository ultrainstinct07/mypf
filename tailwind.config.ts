import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark mode colors
        dark: {
          DEFAULT: '#0A0A0A',
          lighter: '#1F1F1F',
          card: '#151515',
        },
        // Light mode colors
        light: {
          DEFAULT: '#F8FAFC',
          surface: '#FFFFFF',
          alt: '#F1F5F9',
          border: '#E2E8F0',
        },
        // Accent colors (work for both themes)
        cyan: {
          DEFAULT: '#00D9FF',
          secondary: '#0EA5E9',
          glow: 'rgba(0, 217, 255, 0.15)',
          light: '#0891B2', // Darker cyan for light mode
        },
        // Text colors for light mode
        slate: {
          900: '#0F172A',
          600: '#475569',
          500: '#64748B',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite',
        'slideDown': 'slideDown 0.3s ease-out',
        'accordionSlideUp': 'accordionSlideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 217, 255, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 217, 255, 0.4)' },
        },
        slideDown: {
          '0%': { height: '0', opacity: '0' },
          '100%': { height: 'var(--radix-accordion-content-height)', opacity: '1' },
        },
        accordionSlideUp: {
          '0%': { height: 'var(--radix-accordion-content-height)', opacity: '1' },
          '100%': { height: '0', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
export default config



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
          DEFAULT: '#000000',
          lighter: '#0A0A0A',
          card: '#0D0D0D',
        },
        // Light mode colors
        light: {
          DEFAULT: '#FFFFFF',
          surface: '#F5F5F5',
          alt: '#E5E5E5',
          border: '#000000',
        },
        // Accent colors (work for both themes)
        crimson: {
          DEFAULT: '#D90429',
          secondary: '#9B0218',
          glow: 'rgba(217, 4, 41, 0.15)',
          light: '#D90429',
        },
        // Text colors for light mode
        slate: {
          900: '#000000',
          600: '#1C1C1C',
          500: '#5E5E5E',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        syne: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        manrope: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        instrument: ['var(--font-instrument)', 'Georgia', 'serif'],
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
          '0%, 100%': { boxShadow: '2px 2px 0px var(--border-color)' },
          '50%': { boxShadow: '4px 4px 0px var(--accent-primary)' },
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



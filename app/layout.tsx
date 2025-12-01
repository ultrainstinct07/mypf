import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { SITE_CONFIG } from '@/lib/constants';
import ThemeProvider from './providers/ThemeProvider';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import CommandPalette from './components/CommandPalette';
import ChatWidget from './components/ChatWidget';
import KeyboardShortcuts from './components/KeyboardShortcuts';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: SITE_CONFIG.meta.title,
  description: SITE_CONFIG.meta.description,
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.meta.siteUrl }],
  creator: SITE_CONFIG.name,
  keywords: [
    'cybersecurity',
    'security analyst',
    'penetration testing',
    'OWASP',
    'Burp Suite',
    'vulnerability assessment',
    'security automation',
    'threat intelligence',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.meta.siteUrl,
    title: SITE_CONFIG.meta.title,
    description: SITE_CONFIG.meta.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.meta.siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.meta.title,
    description: SITE_CONFIG.meta.description,
    images: [`${SITE_CONFIG.meta.siteUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <ScrollProgress />
          <Navbar />
          {children}
          <CommandPalette />
          <ChatWidget />
          <KeyboardShortcuts />
        </ThemeProvider>
      </body>
    </html>
  );
}



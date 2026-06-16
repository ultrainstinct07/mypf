import Hero from './components/Hero';
import PostHeroParticleBackground from './components/PostHeroParticleBackground';
import SectionIndicatorRail from './components/SectionIndicatorRail';
import HeroSectionDivider from './components/HeroSectionDivider';
import About from './components/About';
import ExpertiseGrid from './components/ExpertiseGrid';
import TacticsShowcase from './components/TacticsShowcase';
import ProjectGallery from './components/ProjectGallery';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import CtfHintCallout from './components/CtfHintCallout';
import Footer from './components/Footer';
import { SITE_CONFIG } from '@/lib/constants';
import { getAllProjects } from '@/lib/mdx';

export default function Home() {
  const projects = getAllProjects();
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_CONFIG.name,
    jobTitle: SITE_CONFIG.role,
    email: SITE_CONFIG.email,
    url: SITE_CONFIG.meta.siteUrl,
    sameAs: [SITE_CONFIG.linkedin],
    worksFor: {
      '@type': 'Organization',
      name: SITE_CONFIG.company,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE_CONFIG.location,
      addressCountry: 'IN',
    },
    description: SITE_CONFIG.bio.short,
  };

  return (
    <>
      <PostHeroParticleBackground />
      <SectionIndicatorRail />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main id="main-content" className="relative isolate">
        <Hero />
        <div className="relative">
          <HeroSectionDivider />
          <About />
          <ExpertiseGrid />
          <TacticsShowcase />
          <ProjectGallery projects={projects} />
          <Testimonials />
          <FAQ />
          <CTA />
        </div>
      </main>
      <CtfHintCallout />
      <Footer />
    </>
  );
}

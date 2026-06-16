import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSubcategories, getTacticsByCategory } from '@/lib/tactics';
import type { TacticCategory } from '@/types/tactics';
import CategoryPageClient from './CategoryPageClient';

const validCategories: TacticCategory[] = ['pentesting', 'hardening', 'tools'];

const categoryMeta: Record<TacticCategory, { title: string; description: string }> = {
  pentesting: {
    title: 'Pentesting Tactics — Web Vulnerabilities & Service Exploitation',
    description:
      'Comprehensive pentesting reference guides covering web vulnerabilities (SQLi, XSS, SSRF) and service/protocol exploitation techniques.',
  },
  hardening: {
    title: 'Hardening Tactics — System & Service Security Guides',
    description:
      'Step-by-step hardening guides for SSH, Apache, Nginx, SMB, and other critical services and infrastructure.',
  },
  tools: {
    title: 'Tool Tactics — Security Tool Reference Guides',
    description:
      'Practical guides for essential security tools including Nmap, Metasploit, Hydra, SQLMap, and more.',
  },
};

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  if (!validCategories.includes(category as TacticCategory)) return {};
  const meta = categoryMeta[category as TacticCategory];
  return {
    title: `${meta.title} | Kshitiz Kumar`,
    description: meta.description,
  };
}

export function generateStaticParams() {
  return validCategories.map((category) => ({ category }));
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  if (!validCategories.includes(category as TacticCategory)) {
    notFound();
  }

  const cat = category as TacticCategory;
  const subcategories = getSubcategories(cat);
  const all = getTacticsByCategory(cat);

  return <CategoryPageClient category={cat} subcategories={subcategories} totalCount={all.length} />;
}

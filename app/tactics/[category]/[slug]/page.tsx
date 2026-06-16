import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import { getTacticBySlug, getAdjacentTactics, getAllTacticSlugs, getSubcategories } from '@/lib/tactics';
import type { TacticCategory } from '@/types/tactics';
import TacticDetailClient from './TacticDetailClient';

const validCategories: TacticCategory[] = ['pentesting', 'hardening', 'tools'];

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  if (!validCategories.includes(category as TacticCategory)) return {};

  const tactic = getTacticBySlug(category as TacticCategory, slug);
  if (!tactic) return {};

  return {
    title: `${tactic.frontmatter.title} — ${category.charAt(0).toUpperCase() + category.slice(1)} | Kshitiz Kumar`,
    description: tactic.frontmatter.description,
  };
}

export function generateStaticParams() {
  const slugs = getAllTacticSlugs();
  return slugs.map(({ category, slug }) => ({ category, slug }));
}

export default async function TacticDetailPage({ params }: PageProps) {
  const { category, slug } = await params;

  if (!validCategories.includes(category as TacticCategory)) {
    notFound();
  }

  const cat = category as TacticCategory;
  const tactic = getTacticBySlug(cat, slug);

  if (!tactic) {
    notFound();
  }

  // Compile MDX to HTML
  const { content: mdxContent } = await compileMDX({
    source: tactic.content,
    options: { parseFrontmatter: false },
  });

  // Render MDX to HTML string using ReactDOMServer
  const { renderToStaticMarkup } = await import('react-dom/server');
  const htmlContent = renderToStaticMarkup(mdxContent);

  const { prev, next } = getAdjacentTactics(cat, slug);
  const subcategories = getSubcategories(cat);

  return (
    <TacticDetailClient
      category={cat}
      slug={slug}
      title={tactic.frontmatter.title}
      description={tactic.frontmatter.description}
      tags={tactic.frontmatter.tags}
      subcategory={tactic.subcategory}
      htmlContent={htmlContent}
      prev={prev}
      next={next}
      subcategories={subcategories}
    />
  );
}

import { MetadataRoute } from 'next';
import { getAllProjectSlugs } from '@/lib/mdx';
import { SITE_CONFIG } from '@/lib/constants';
import { getAllTacticSlugs } from '@/lib/tactics';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.meta.siteUrl;
  
  // Get all project slugs
  const projectSlugs = getAllProjectSlugs();
  
  // Generate project URLs
  const projectUrls = projectSlugs.map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Get all tactic slugs
  const tacticSlugs = getAllTacticSlugs();

  // Generate tactic category URLs
  const categories = ['pentesting', 'hardening', 'tools'] as const;
  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/tactics/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Generate tactic detail URLs
  const tacticUrls = tacticSlugs.map(({ category, slug }) => ({
    url: `${baseUrl}/tactics/${category}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tactics`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...categoryUrls,
    ...projectUrls,
    ...tacticUrls,
  ];
}


import { MetadataRoute } from 'next';
import { getAllProjectSlugs } from '@/lib/mdx';
import { SITE_CONFIG } from '@/lib/constants';

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
    ...projectUrls,
  ];
}


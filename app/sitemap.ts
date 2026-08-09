import type { MetadataRoute } from 'next';

// NOTE: Update these static lastModified dates only when route content actually changes.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://drybar.qa';

  return [
    {
      url: `${baseUrl}/`,
      lastModified: '2026-02-09',
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/prices`,
      lastModified: '2026-02-09',
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gifts`,
      lastModified: '2026-02-09',
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}

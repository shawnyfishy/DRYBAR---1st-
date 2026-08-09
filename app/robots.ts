import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://drybar.qa';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/prices', '/gifts'],
      disallow: '/dev/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

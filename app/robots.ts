import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/login/',
        '/portfolio-secret/',
        '/_next/',
        '/admin/',
      ],
    },
    sitemap: 'https://castprov29.vercel.app/sitemap.xml',
  }
}

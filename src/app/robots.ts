import { site } from '@/lib/site'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/signin', '/signup'],
      disallow: [
        '/api/',
        '/browse',
        '/movies',
        '/tv-shows',
        '/my-list',
        '/search',
        '/title/',
        '/watch/',
      ],
    },
    host: site.url,
  }
}

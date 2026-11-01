import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // TMDB already serves pre-sized images from its CDN, so the loader picks
    // the closest size instead of routing every poster through /_next/image.
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
  },
  async redirects() {
    return [{ source: '/series', destination: '/tv-shows', permanent: true }]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          // YouTube embeds refuse to play when no referrer is sent.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig

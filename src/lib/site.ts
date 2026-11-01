export const site = {
  name: 'Lumora',
  tagline: 'Every story worth watching, in one place.',
  description:
    'Lumora is a cinematic discovery app: browse trending films and series, watch trailers, and keep a watchlist that follows you everywhere.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
}

/** Shared guest account used by "Explore as guest". */
export const DEMO_EMAIL = 'guest@demo.lumora'

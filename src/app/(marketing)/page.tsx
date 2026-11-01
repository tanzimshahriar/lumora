import { Logo } from '@/components/brand/Logo'
import { Aurora } from '@/components/marketing/Aurora'
import { Faq } from '@/components/marketing/Faq'
import { Features } from '@/components/marketing/Features'
import { GuestButton } from '@/components/marketing/GuestButton'
import { PosterWall } from '@/components/marketing/PosterWall'
import { Footer } from '@/components/shell/Footer'
import { buttonStyles } from '@/components/ui/button'
import { redirectIfSignedIn } from '@/lib/auth/session'
import { site } from '@/lib/site'
import { getCollection, isTmdbConfigured } from '@/lib/tmdb'
import { ArrowRight, Sparkles } from 'lucide-react'
import Form from 'next/form'
import Link from 'next/link'

async function getPosters() {
  if (!isTmdbConfigured()) return []
  try {
    const [movies, series] = await Promise.all([
      getCollection('trendingMovies'),
      getCollection('trendingTv'),
    ])
    // Interleave so each row mixes films and series.
    return movies
      .flatMap((movie, i) => [movie, series[i]])
      .map((t) => t?.posterPath)
      .filter((path): path is string => Boolean(path))
      .slice(0, 36)
  } catch {
    return []
  }
}

export default async function LandingPage() {
  await redirectIfSignedIn()
  const posters = await getPosters()

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-20">
        <nav className="flex h-20 container-app items-center justify-between">
          <Link
            href="/"
            aria-label={`${site.name} home`}
            className="rounded-lg"
          >
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/signin"
              className={buttonStyles({ variant: 'ghost', size: 'sm' })}
            >
              Sign in
            </Link>
            <Link href="/signup" className={buttonStyles({ size: 'sm' })}>
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative isolate flex min-h-svh items-center justify-center overflow-hidden px-5 pt-24 pb-16">
          <Aurora />
          {posters.length > 0 && (
            <PosterWall posters={posters} className="opacity-35" />
          )}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,rgb(7_7_11/0.55)_0%,var(--color-ink-950)_80%)]" />

          <div className="mx-auto max-w-4xl animate-rise text-center">
            <p className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-zinc-200">
              <Sparkles aria-hidden="true" className="size-3.5 text-glow" />
              Trailers, watchlists and smarter discovery
            </p>
            <h1 className="mt-7 font-display text-6xl leading-[0.9] tracking-tight text-balance text-white sm:text-7xl lg:text-8xl xl:text-9xl">
              Every story worth watching,{' '}
              <em className="text-aurora">in one place.</em>
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-lg text-pretty text-zinc-300 sm:text-xl/relaxed">
              Browse what&apos;s trending, watch trailers in full screen and
              build a watchlist that follows you everywhere.
            </p>

            <Form
              action="/signup"
              className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="hero-email" className="sr-only">
                Email address
              </label>
              <input
                id="hero-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="h-13 flex-1 rounded-full bg-white/[0.07] px-6 text-white ring-1 ring-white/15 backdrop-blur transition outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-accent"
              />
              <button type="submit" className={buttonStyles({ size: 'lg' })}>
                Create free account
                <ArrowRight aria-hidden="true" />
              </button>
            </Form>
            <div className="mt-5 flex items-center justify-center gap-3 text-sm text-zinc-400">
              <span>No card. No catch.</span>
              <span aria-hidden="true" className="text-zinc-700">
                ·
              </span>
              <GuestButton
                variant="ghost"
                size="md"
                className="h-auto px-0 text-sm font-medium text-white underline-offset-4 hover:bg-transparent hover:underline"
              />
            </div>
          </div>
        </section>

        <Features />
        <Faq />

        <section className="relative isolate overflow-hidden px-5 py-24 text-center sm:py-32">
          <Aurora className="opacity-70" />
          <h2 className="font-display text-5xl text-white sm:text-7xl">
            Your next favourite is waiting.
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className={buttonStyles({ size: 'lg' })}>
              Create free account
            </Link>
            <GuestButton variant="glass" />
          </div>
        </section>
      </main>

      <Footer
        links={[
          { href: '/signin', label: 'Sign in' },
          { href: '/signup', label: 'Create account' },
        ]}
      />
    </>
  )
}

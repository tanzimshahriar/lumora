import { buttonStyles } from '@/components/ui/button'
import { requireUser } from '@/lib/auth/session'
import {
  mediaLabel,
  titleHref,
  tmdbImage,
  watchHref,
  type MediaType,
} from '@/lib/media'
import { getFeatured, isTmdbConfigured } from '@/lib/tmdb'
import { isInWatchlist } from '@/lib/watchlist'
import { Info, Play, Sparkles, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { HeroTrailer } from './HeroTrailer'
import { WatchlistButton } from './WatchlistButton'

export async function Hero({ scope = 'all' }: { scope?: 'all' | MediaType }) {
  if (!isTmdbConfigured()) return null
  const user = await requireUser()
  const featured = await getFeatured(scope).catch((error) => {
    console.error('Failed to load featured title', error)
    return null
  })
  if (!featured) return <div className="h-40" />

  const { title, trailerKey } = featured
  const saved = await isInWatchlist(user.id, title.type, title.id)
  const backdrop = tmdbImage(title.backdropPath)

  return (
    <section className="relative isolate flex h-[min(92svh,62rem)] min-h-[34rem] items-end overflow-hidden">
      {backdrop && (
        <Image
          src={backdrop}
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="animate-fade object-cover object-[center_20%]"
        />
      )}
      {trailerKey && <HeroTrailer videoKey={trailerKey} />}

      <div className="absolute inset-0 bg-linear-to-r from-ink-950/95 via-ink-950/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-ink-950 via-ink-950/70 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-ink-950/70 to-transparent" />

      <div className="relative z-10 container-app pb-[max(8rem,20%)] sm:pb-[max(10rem,18%)]">
        <div className="max-w-2xl animate-rise">
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
            <Sparkles aria-hidden="true" className="size-3.5" />
            Trending {mediaLabel(title.type).toLowerCase()}
          </p>
          <h1 className="font-display text-5xl leading-[0.92] text-balance text-white drop-shadow-lg sm:text-6xl lg:text-7xl xl:text-8xl">
            {title.title}
          </h1>
          <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-300">
            {title.rating ? (
              <span className="inline-flex items-center gap-1 font-semibold text-glow">
                <Star aria-hidden="true" className="size-4 fill-current" />
                {title.rating.toFixed(1)}
              </span>
            ) : null}
            {[title.year, ...title.genres.slice(0, 2)]
              .filter(Boolean)
              .map((item) => (
                <span key={item} className="flex items-center gap-3">
                  <span aria-hidden="true" className="text-zinc-600">
                    •
                  </span>
                  {item}
                </span>
              ))}
          </p>
          <p className="mt-4 line-clamp-3 max-w-xl text-pretty text-zinc-300 sm:text-lg/relaxed">
            {title.overview}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3">
            {trailerKey && (
              <Link
                href={watchHref(title)}
                className={buttonStyles({ size: 'lg' })}
              >
                <Play aria-hidden="true" className="fill-current" />
                Play trailer
              </Link>
            )}
            <Link
              href={titleHref(title)}
              className={buttonStyles({ variant: 'glass', size: 'lg' })}
            >
              <Info aria-hidden="true" />
              More info
            </Link>
            <WatchlistButton
              type={title.type}
              id={title.id}
              initialSaved={saved}
              variant="icon"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export function HeroSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-[min(92svh,62rem)] min-h-[34rem] items-end bg-linear-to-b from-ink-800 to-ink-950"
    >
      <div className="container-app pb-[max(8rem,20%)]">
        <div className="h-4 w-36 animate-pulse rounded bg-ink-600" />
        <div className="mt-5 h-16 w-[min(36rem,80%)] animate-pulse rounded-lg bg-ink-600" />
        <div className="mt-5 h-4 w-[min(30rem,70%)] animate-pulse rounded bg-ink-700" />
        <div className="mt-2 h-4 w-[min(26rem,60%)] animate-pulse rounded bg-ink-700" />
        <div className="mt-8 flex gap-3">
          <div className="h-12 w-40 animate-pulse rounded-full bg-ink-600" />
          <div className="h-12 w-36 animate-pulse rounded-full bg-ink-700" />
        </div>
      </div>
    </div>
  )
}

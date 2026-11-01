import { CastRow } from '@/components/media/CastRow'
import { Row } from '@/components/media/Row'
import { WatchlistButton } from '@/components/media/WatchlistButton'
import { buttonStyles } from '@/components/ui/button'
import { requireUser } from '@/lib/auth/session'
import {
  formatRuntime,
  mediaLabel,
  parseTitleParams,
  tmdbImage,
  watchHref,
} from '@/lib/media'
import { getTitleDetails } from '@/lib/tmdb'
import { isInWatchlist } from '@/lib/watchlist'
import { Play, Star } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ type: string; id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parsed = parseTitleParams(await params)
  const details = parsed && (await getTitleDetails(parsed.type, parsed.id))
  if (!details) return {}
  return {
    title: details.title,
    description: details.overview,
    openGraph: {
      images: details.backdropPath
        ? [`https://image.tmdb.org/t/p/w1280${details.backdropPath}`]
        : undefined,
    },
  }
}

export default async function TitlePage({ params }: Props) {
  const parsed = parseTitleParams(await params)
  if (!parsed) notFound()

  const user = await requireUser()
  const [details, saved] = await Promise.all([
    getTitleDetails(parsed.type, parsed.id),
    isInWatchlist(user.id, parsed.type, parsed.id),
  ])
  if (!details) notFound()

  const backdrop = tmdbImage(details.backdropPath)
  const poster = tmdbImage(details.posterPath)
  const facts = [
    details.year,
    details.type === 'tv' && details.seasons
      ? `${details.seasons} season${details.seasons > 1 ? 's' : ''}`
      : details.runtime
        ? formatRuntime(details.runtime)
        : null,
  ].filter(Boolean)

  return (
    <>
      <section className="relative isolate flex min-h-[min(88svh,58rem)] items-end overflow-hidden">
        {backdrop && (
          <Image
            src={backdrop}
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="-z-10 animate-fade object-cover object-[center_20%]"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-ink-950 via-ink-950/75 to-ink-950/10" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-linear-to-t from-ink-950 via-ink-950/80 to-transparent" />
        <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b from-ink-950/80 to-transparent" />

        <div className="grid container-app w-full items-end gap-10 pt-32 pb-12 lg:grid-cols-[minmax(0,17rem)_1fr] xl:grid-cols-[minmax(0,19rem)_1fr]">
          {poster && (
            <div className="relative hidden aspect-[2/3] animate-rise overflow-hidden rounded-2xl shadow-2xl ring-1 shadow-black/70 ring-white/15 lg:block">
              <Image
                src={poster}
                alt={`${details.title} poster`}
                fill
                loading="eager"
                sizes="304px"
                className="object-cover"
              />
            </div>
          )}

          <div className="max-w-3xl animate-rise [animation-delay:80ms]">
            <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">
              {mediaLabel(details.type)}
            </p>
            <h1 className="mt-3 font-display text-5xl leading-[0.92] text-balance text-white sm:text-6xl lg:text-7xl">
              {details.title}
            </h1>
            {details.tagline && (
              <p className="mt-3 font-display text-xl text-pretty text-zinc-300 italic sm:text-2xl">
                {details.tagline}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-zinc-300">
              {details.rating ? (
                <span className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 font-semibold text-glow">
                  <Star aria-hidden="true" className="size-3.5 fill-current" />
                  {details.rating.toFixed(1)}
                </span>
              ) : null}
              {details.certification && (
                <span className="rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-white/30">
                  {details.certification}
                </span>
              )}
              {facts.map((fact) => (
                <span key={fact} className="px-1">
                  {fact}
                </span>
              ))}
            </div>

            {details.genres.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {details.genres.map((genre) => (
                  <li
                    key={genre}
                    className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-zinc-300 ring-1 ring-white/10"
                  >
                    {genre}
                  </li>
                ))}
              </ul>
            )}

            {details.overview && (
              <p className="mt-6 max-w-2xl text-base/relaxed text-pretty text-zinc-300 sm:text-lg/relaxed">
                {details.overview}
              </p>
            )}
            {details.credits && (
              <p className="mt-4 text-sm text-zinc-400">
                <span className="text-zinc-500">{details.credits.role}</span>{' '}
                <span className="text-zinc-200">
                  {details.credits.names.join(', ')}
                </span>
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {details.trailerKey ? (
                <Link
                  href={watchHref(details)}
                  className={buttonStyles({ size: 'lg' })}
                >
                  <Play aria-hidden="true" className="fill-current" />
                  Play trailer
                </Link>
              ) : (
                <span
                  className={buttonStyles({
                    variant: 'outline',
                    size: 'lg',
                    className: 'pointer-events-none opacity-60',
                  })}
                >
                  No trailer yet
                </span>
              )}
              <WatchlistButton
                type={details.type}
                id={details.id}
                initialSaved={saved}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-6 pt-4 pb-16">
        {details.cast.length > 0 && <CastRow cast={details.cast} />}
        {details.related.length > 0 && (
          <Row label="More like this" titles={details.related} />
        )}
      </div>
    </>
  )
}

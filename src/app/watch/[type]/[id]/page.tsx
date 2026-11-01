import { buttonStyles } from '@/components/ui/button'
import { requireUser } from '@/lib/auth/session'
import { parseTitleParams, titleHref } from '@/lib/media'
import { getTitleDetails, isTmdbConfigured } from '@/lib/tmdb'
import { ArrowLeft, Clapperboard } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

type Props = { params: Promise<{ type: string; id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parsed = parseTitleParams(await params)
  const details =
    parsed && isTmdbConfigured()
      ? await getTitleDetails(parsed.type, parsed.id)
      : null
  return { title: details ? `${details.title} · Trailer` : 'Trailer' }
}

export default async function WatchPage({ params }: Props) {
  await requireUser()
  if (!isTmdbConfigured()) redirect('/browse')

  const parsed = parseTitleParams(await params)
  if (!parsed) notFound()
  const details = await getTitleDetails(parsed.type, parsed.id)
  if (!details) notFound()

  const back = titleHref(details)

  return (
    <main className="fixed inset-0 bg-black">
      {details.trailerKey ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${details.trailerKey}?autoplay=1&rel=0&playsinline=1&iv_load_policy=3`}
          title={`${details.title} trailer`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <div className="grid h-full place-items-center px-6 text-center">
          <div>
            <Clapperboard
              aria-hidden="true"
              className="mx-auto size-10 text-zinc-600"
            />
            <p className="mt-5 text-lg text-white">
              No trailer is available for {details.title} yet.
            </p>
            <Link
              href={back}
              className={buttonStyles({ variant: 'glass', className: 'mt-6' })}
            >
              Back to details
            </Link>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center gap-4 bg-linear-to-b from-black/80 to-transparent p-4 pb-12 sm:p-6 sm:pb-16">
        <Link
          href={back}
          aria-label={`Back to ${details.title}`}
          className={buttonStyles({
            variant: 'glass',
            size: 'icon',
            className: 'pointer-events-auto',
          })}
        >
          <ArrowLeft aria-hidden="true" />
        </Link>
        <div className="min-w-0">
          <p className="text-xs tracking-[0.2em] text-zinc-400 uppercase">
            Now playing · Trailer
          </p>
          <p className="truncate font-display text-2xl text-white">
            {details.title}
          </p>
        </div>
      </div>
    </main>
  )
}

import { cn } from '@/lib/cn'
import { tmdbImage, titleHref, type Title } from '@/lib/media'
import { Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export type CardVariant = 'poster' | 'backdrop'

const widths: Record<CardVariant, string> = {
  poster: 'w-[clamp(8.5rem,14vw,12.5rem)]',
  backdrop: 'w-[clamp(15rem,24vw,22rem)]',
}

const sizes: Record<CardVariant, string> = {
  poster: '(min-width: 1440px) 200px, (min-width: 640px) 14vw, 136px',
  backdrop: '(min-width: 1440px) 352px, (min-width: 640px) 24vw, 240px',
}

export function TitleCard({
  title,
  variant = 'backdrop',
  fluid = false,
}: {
  title: Title
  variant?: CardVariant
  /** Fill the parent's width (grids) instead of a fixed row width. */
  fluid?: boolean
}) {
  const src = tmdbImage(
    variant === 'poster' ? title.posterPath : title.backdropPath,
  )
  const meta = [title.year, title.genres[0]].filter(Boolean).join(' · ')

  return (
    <Link
      href={titleHref(title)}
      className={cn(
        'group/card block shrink-0 rounded-xl outline-offset-4',
        fluid ? 'w-full' : widths[variant],
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-xl bg-ink-800 ring-1 ring-white/[0.06] transition duration-500 ease-out-expo ring-inset',
          'group-hover/card:-translate-y-1 group-hover/card:shadow-2xl group-hover/card:shadow-black/70 group-hover/card:ring-white/25',
          variant === 'poster' ? 'aspect-[2/3]' : 'aspect-video',
        )}
      >
        {src ? (
          <Image
            src={src}
            alt=""
            fill
            sizes={fluid ? '(min-width: 1024px) 18vw, 45vw' : sizes[variant]}
            className="object-cover transition duration-700 ease-out-expo group-hover/card:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-ink-700 to-ink-900 p-4 text-center font-display text-xl text-zinc-300">
            {title.title}
          </div>
        )}

        <div
          className={cn(
            'absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent transition duration-500',
            variant === 'poster' &&
              'opacity-0 group-hover/card:opacity-100 group-focus-visible/card:opacity-100',
          )}
        />

        <div
          className={cn(
            'absolute inset-x-0 bottom-0 p-3 transition duration-500 ease-out-expo sm:p-4',
            variant === 'poster' &&
              'translate-y-2 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus-visible/card:translate-y-0 group-focus-visible/card:opacity-100',
          )}
        >
          <p className="line-clamp-2 text-sm leading-snug font-semibold text-white sm:text-[15px]">
            {title.title}
          </p>
          {(meta || title.rating) && (
            <p className="mt-1 flex items-center gap-2 text-xs text-zinc-300">
              {title.rating ? (
                <span className="inline-flex items-center gap-1 text-glow">
                  <Star aria-hidden="true" className="size-3 fill-current" />
                  {title.rating.toFixed(1)}
                </span>
              ) : null}
              <span className="truncate">{meta}</span>
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

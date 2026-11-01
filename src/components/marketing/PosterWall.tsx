import { cn } from '@/lib/cn'
import { tmdbImage } from '@/lib/media'
import Image from 'next/image'

const ROWS = 4

/** Slowly drifting, tilted rows of posters behind the landing hero. */
export function PosterWall({
  posters,
  className,
}: {
  posters: string[]
  className?: string
}) {
  const perRow = Math.ceil(posters.length / ROWS)
  const rows = Array.from({ length: ROWS }, (_, i) =>
    posters.slice(i * perRow, (i + 1) * perRow),
  ).filter((row) => row.length > 0)

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 flex scale-125 -rotate-[8deg] flex-col justify-center gap-4 sm:gap-5',
        className,
      )}
    >
      {rows.map((row, i) => (
        <div
          key={i}
          className={cn(
            'flex w-max animate-marquee gap-4 sm:gap-5',
            i % 2 === 1 && '[animation-direction:reverse]',
          )}
          style={
            { '--marquee-duration': `${90 + i * 25}s` } as React.CSSProperties
          }
        >
          {/* Rendered twice so the -50% translate loops seamlessly. */}
          {[...row, ...row].map((path, j) => (
            <div
              key={j}
              className="relative aspect-[2/3] w-32 shrink-0 overflow-hidden rounded-xl bg-ink-800 ring-1 ring-white/10 sm:w-40 lg:w-44"
            >
              <Image
                src={tmdbImage(path)!}
                alt=""
                fill
                sizes="176px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

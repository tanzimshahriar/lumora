import { tmdbImage } from '@/lib/media'
import type { CastMember } from '@/lib/tmdb'
import Image from 'next/image'
import { RowHeading } from './Row'
import { RowScroller } from './RowScroller'

export function CastRow({ cast }: { cast: CastMember[] }) {
  return (
    <section aria-labelledby="row-cast">
      <RowHeading id="row-cast" label="Cast" />
      <RowScroller label="Cast">
        {cast.map((person) => {
          const photo = tmdbImage(person.profilePath)
          return (
            <li key={person.id} className="w-28 shrink-0 snap-start sm:w-32">
              <div className="relative aspect-square overflow-hidden rounded-full bg-ink-800 ring-1 ring-white/10">
                {photo ? (
                  <Image
                    src={photo}
                    alt=""
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                ) : (
                  <span className="grid h-full place-items-center font-display text-3xl text-zinc-500">
                    {person.name[0]}
                  </span>
                )}
              </div>
              <p className="mt-3 line-clamp-2 text-center text-sm font-medium text-white">
                {person.name}
              </p>
              {person.character && (
                <p className="mt-0.5 line-clamp-2 text-center text-xs text-zinc-500">
                  {person.character}
                </p>
              )}
            </li>
          )
        })}
      </RowScroller>
    </section>
  )
}

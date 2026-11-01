import { requireUser } from '@/lib/auth/session'
import type { MediaType } from '@/lib/media'
import {
  collections,
  getCollection,
  isTmdbConfigured,
  type CollectionId,
} from '@/lib/tmdb'
import { getWatchlist } from '@/lib/watchlist'
import { Suspense } from 'react'
import { Hero, HeroSkeleton } from './Hero'
import { Row, RowSkeleton } from './Row'
import type { CardVariant } from './TitleCard'

export interface CatalogRow {
  id: CollectionId
  variant?: CardVariant
}

/** Shared layout for Home, Films and Series: a hero plus streamed rows. */
export function Catalog({
  scope,
  rows,
  showWatchlist = false,
}: {
  scope: 'all' | MediaType
  rows: CatalogRow[]
  showWatchlist?: boolean
}) {
  const [first, ...rest] = rows
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <Hero scope={scope} />
      </Suspense>
      <div className="relative z-10 -mt-24 space-y-4 pb-16 sm:-mt-32 sm:space-y-6 lg:-mt-40">
        {first && <StreamedRow {...first} />}
        {showWatchlist && (
          <Suspense>
            <WatchlistRow />
          </Suspense>
        )}
        {rest.map((row) => (
          <StreamedRow key={row.id} {...row} />
        ))}
      </div>
    </>
  )
}

function StreamedRow(row: CatalogRow) {
  return (
    <Suspense fallback={<RowSkeleton variant={row.variant} />}>
      <CollectionRow {...row} />
    </Suspense>
  )
}

async function CollectionRow({ id, variant = 'backdrop' }: CatalogRow) {
  if (!isTmdbConfigured()) return null
  // One failing row shouldn't take the whole page down.
  const titles = await getCollection(id).catch((error) => {
    console.error(`Failed to load collection "${id}"`, error)
    return []
  })
  const visible = titles.filter((t) =>
    variant === 'poster' ? t.posterPath : t.backdropPath,
  )
  if (visible.length === 0) return null
  return (
    <Row label={collections[id].label} titles={visible} variant={variant} />
  )
}

async function WatchlistRow() {
  const user = await requireUser()
  const titles = await getWatchlist(user.id)
  if (titles.length === 0) return null
  return <Row label="My List" titles={titles} variant="poster" />
}

import 'server-only'
import { db } from '@/db'
import { watchlist } from '@/db/schema'
import type { MediaType, Title } from '@/lib/media'
import { and, desc, eq } from 'drizzle-orm'

export async function getWatchlist(userId: string): Promise<Title[]> {
  const rows = await db
    .select()
    .from(watchlist)
    .where(eq(watchlist.userId, userId))
    .orderBy(desc(watchlist.createdAt))

  return rows.map((row) => ({
    id: row.mediaId,
    type: row.mediaType,
    title: row.title,
    overview: '',
    posterPath: row.posterPath,
    backdropPath: row.backdropPath,
    year: null,
    rating: null,
    genres: [],
  }))
}

export async function isInWatchlist(
  userId: string,
  type: MediaType,
  id: number,
) {
  const rows = await db
    .select({ id: watchlist.mediaId })
    .from(watchlist)
    .where(
      and(
        eq(watchlist.userId, userId),
        eq(watchlist.mediaType, type),
        eq(watchlist.mediaId, id),
      ),
    )
    .limit(1)
  return rows.length > 0
}

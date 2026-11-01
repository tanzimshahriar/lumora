// Shared between server and client components; keep free of secrets.

export type MediaType = 'movie' | 'tv'

export interface Title {
  id: number
  type: MediaType
  title: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  year: string | null
  rating: number | null
  genres: string[]
}

export const isMediaType = (value: string): value is MediaType =>
  value === 'movie' || value === 'tv'

export const tmdbImage = (path: string | null) =>
  path ? `https://image.tmdb.org/t/p/original${path}` : null

export const titleHref = (t: Pick<Title, 'type' | 'id'>) =>
  `/title/${t.type}/${t.id}`

export const watchHref = (t: Pick<Title, 'type' | 'id'>) =>
  `/watch/${t.type}/${t.id}`

export const mediaLabel = (type: MediaType) =>
  type === 'tv' ? 'Series' : 'Film'

export function formatRuntime(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h ? `${h}h${m ? ` ${m}m` : ''}` : `${m}m`
}

/** Parses `/[type]/[id]` route params, returning null for anything invalid. */
export function parseTitleParams(params: { type: string; id: string }) {
  const id = Number(params.id)
  if (!isMediaType(params.type) || !Number.isInteger(id) || id <= 0) {
    return null
  }
  return { type: params.type, id }
}

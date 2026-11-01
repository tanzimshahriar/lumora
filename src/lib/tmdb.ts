import 'server-only'
import { isMediaType, type MediaType, type Title } from '@/lib/media'

export interface CastMember {
  id: number
  name: string
  character: string
  profilePath: string | null
}

export interface TitleDetails extends Title {
  tagline: string | null
  runtime: number | null
  seasons: number | null
  certification: string | null
  trailerKey: string | null
  credits: { role: string; names: string[] } | null
  cast: CastMember[]
  related: Title[]
}

export interface Featured {
  title: Title
  trailerKey: string | null
}

const API_URL = process.env.TMDB_API_URL ?? 'https://api.themoviedb.org/3'
const TOKEN = process.env.TMDB_TOKEN || process.env.TMDB_READ_ACCESS_TOKEN
const API_KEY = process.env.TMDB_API_KEY
const HOUR = 60 * 60

export const isTmdbConfigured = () => Boolean(TOKEN || API_KEY)

class TmdbNotFoundError extends Error {}

async function tmdb<T>(
  path: string,
  params: Record<string, string | number> = {},
  revalidate = HOUR,
): Promise<T> {
  if (!isTmdbConfigured()) {
    throw new Error('TMDB is not configured: set TMDB_TOKEN or TMDB_API_KEY')
  }
  const url = new URL(API_URL + path)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value))
  }
  if (!TOKEN && API_KEY) url.searchParams.set('api_key', API_KEY)

  const res = await fetch(url, {
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : undefined,
    next: { revalidate },
  })
  if (res.status === 404) throw new TmdbNotFoundError(path)
  if (!res.ok) throw new Error(`TMDB request failed (${res.status}): ${path}`)
  return res.json() as Promise<T>
}

// ---------------------------------------------------------------------------
// Raw TMDB shapes (only the fields we read)

interface RawTitle {
  id: number
  media_type?: string
  title?: string
  name?: string
  overview?: string
  poster_path?: string | null
  backdrop_path?: string | null
  release_date?: string
  first_air_date?: string
  vote_average?: number
  vote_count?: number
  genre_ids?: number[]
  genres?: { id: number; name: string }[]
}

interface RawVideo {
  key: string
  site: string
  type: string
  official: boolean
}

interface RawDetails extends RawTitle {
  tagline?: string
  runtime?: number
  episode_run_time?: number[]
  number_of_seasons?: number
  created_by?: { name: string }[]
  videos?: { results: RawVideo[] }
  credits?: {
    cast: {
      id: number
      name: string
      character: string
      profile_path: string | null
    }[]
    crew: { name: string; job: string }[]
  }
  recommendations?: { results: RawTitle[] }
  similar?: { results: RawTitle[] }
  release_dates?: {
    results: {
      iso_3166_1: string
      release_dates: { certification: string }[]
    }[]
  }
  content_ratings?: { results: { iso_3166_1: string; rating: string }[] }
}

type Page<T> = { results: T[] }

// ---------------------------------------------------------------------------
// Normalisation

const getGenreNames = async (): Promise<Map<number, string>> => {
  const lists = await Promise.all(
    (['movie', 'tv'] as const).map((type) =>
      tmdb<{ genres: { id: number; name: string }[] }>(
        `/genre/${type}/list`,
        {},
        24 * HOUR,
      ),
    ),
  )
  return new Map(lists.flatMap((l) => l.genres).map((g) => [g.id, g.name]))
}

function toTitle(
  raw: RawTitle,
  fallbackType: MediaType,
  genreNames?: Map<number, string>,
): Title | null {
  // Multi-type endpoints also return people.
  if (raw.media_type && !isMediaType(raw.media_type)) return null
  const type = (raw.media_type as MediaType | undefined) ?? fallbackType

  const title = raw.title ?? raw.name
  if (!title) return null

  const date = raw.release_date || raw.first_air_date
  const genres =
    raw.genres?.map((g) => g.name) ??
    raw.genre_ids
      ?.map((id) => genreNames?.get(id))
      .filter((g): g is string => Boolean(g)) ??
    []

  return {
    id: raw.id,
    type,
    title,
    overview: raw.overview ?? '',
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    year: date ? date.slice(0, 4) : null,
    rating:
      raw.vote_average && (raw.vote_count ?? 1) > 0
        ? Math.round(raw.vote_average * 10) / 10
        : null,
    genres,
  }
}

const toTitles = (
  results: RawTitle[],
  fallbackType: MediaType,
  genreNames?: Map<number, string>,
) =>
  results
    .map((r) => toTitle(r, fallbackType, genreNames))
    .filter((t): t is Title => t !== null)

function pickTrailer(videos: RawVideo[] = []): string | null {
  const youtube = videos.filter((v) => v.site === 'YouTube')
  const rank = (v: RawVideo) =>
    (v.type === 'Trailer' ? 0 : v.type === 'Teaser' ? 2 : 4) +
    (v.official ? 0 : 1)
  return youtube.sort((a, b) => rank(a) - rank(b))[0]?.key ?? null
}

// ---------------------------------------------------------------------------
// Collections

// TV discovery is dominated by talk shows and news without these filters.
const TV_NOISE = { without_genres: '10763,10764,10767' }
const QUALITY = { sort_by: 'popularity.desc', 'vote_count.gte': 200 }

export const collections = {
  trending: { label: 'Trending this week', path: '/trending/all/week' },
  trendingMovies: { label: 'Trending films', path: '/trending/movie/week' },
  trendingTv: { label: 'Trending series', path: '/trending/tv/week' },
  popularMovies: { label: 'Popular films', path: '/movie/popular' },
  nowPlaying: { label: 'In cinemas now', path: '/movie/now_playing' },
  topRatedMovies: { label: 'Critically acclaimed', path: '/movie/top_rated' },
  comedyMovies: {
    label: 'Feel-good comedies',
    path: '/discover/movie',
    params: { ...QUALITY, with_genres: 35 },
  },
  thrillerMovies: {
    label: 'Edge-of-your-seat thrillers',
    path: '/discover/movie',
    params: { ...QUALITY, with_genres: 53 },
  },
  romanceMovies: {
    label: 'Love stories',
    path: '/discover/movie',
    params: { ...QUALITY, with_genres: 10749 },
  },
  animationMovies: {
    label: 'Animated worlds',
    path: '/discover/movie',
    params: { ...QUALITY, with_genres: 16 },
  },
  documentaries: {
    label: 'Documentaries',
    path: '/discover/movie',
    params: { ...QUALITY, 'vote_count.gte': 50, with_genres: 99 },
  },
  popularTv: {
    label: 'Binge-worthy series',
    path: '/discover/tv',
    params: { ...QUALITY, ...TV_NOISE },
  },
  topRatedTv: {
    label: 'Highest-rated series',
    path: '/discover/tv',
    params: {
      ...TV_NOISE,
      sort_by: 'vote_average.desc',
      'vote_count.gte': 2000,
    },
  },
  crimeTv: {
    label: 'Crime & mystery series',
    path: '/discover/tv',
    params: { ...QUALITY, ...TV_NOISE, with_genres: 80 },
  },
  comedyTv: {
    label: 'Comedy series',
    path: '/discover/tv',
    params: { ...QUALITY, ...TV_NOISE, with_genres: 35 },
  },
  scifiTv: {
    label: 'Sci-fi & fantasy series',
    path: '/discover/tv',
    params: { ...QUALITY, ...TV_NOISE, with_genres: 10765 },
  },
  dramaTv: {
    label: 'Drama series',
    path: '/discover/tv',
    params: { ...QUALITY, ...TV_NOISE, with_genres: 18 },
  },
} satisfies Record<
  string,
  { label: string; path: string; params?: Record<string, string | number> }
>

export type CollectionId = keyof typeof collections

export async function getCollection(id: CollectionId): Promise<Title[]> {
  const collection = collections[id]
  const params = 'params' in collection ? collection.params : {}
  const fallbackType: MediaType = collection.path.includes('/tv')
    ? 'tv'
    : 'movie'
  const [page, genreNames] = await Promise.all([
    tmdb<Page<RawTitle>>(collection.path, params),
    getGenreNames(),
  ])
  return toTitles(page.results, fallbackType, genreNames)
}

export async function getFeatured(
  scope: 'all' | MediaType = 'all',
): Promise<Featured | null> {
  const trending = await getCollection(
    scope === 'movie'
      ? 'trendingMovies'
      : scope === 'tv'
        ? 'trendingTv'
        : 'trending',
  )
  const candidates = trending
    .filter((t) => t.backdropPath && t.overview)
    .slice(0, 8)
  const title = candidates[Math.floor(Math.random() * candidates.length)]
  if (!title) return null

  const videos = await tmdb<{ results: RawVideo[] }>(
    `/${title.type}/${title.id}/videos`,
  )
  return { title, trailerKey: pickTrailer(videos.results) }
}

export async function search(query: string): Promise<Title[]> {
  const [page, genreNames] = await Promise.all([
    tmdb<Page<RawTitle>>(
      '/search/multi',
      { query, include_adult: 'false' },
      10 * 60,
    ),
    getGenreNames(),
  ])
  return toTitles(page.results, 'movie', genreNames).filter(
    (t) => t.posterPath || t.backdropPath,
  )
}

// ---------------------------------------------------------------------------
// Single titles

export async function getTitle(
  type: MediaType,
  id: number,
): Promise<Title | null> {
  try {
    return toTitle(await tmdb<RawTitle>(`/${type}/${id}`), type)
  } catch (error) {
    if (error instanceof TmdbNotFoundError) return null
    throw error
  }
}

export async function getTitleDetails(
  type: MediaType,
  id: number,
): Promise<TitleDetails | null> {
  let raw: RawDetails
  try {
    raw = await tmdb<RawDetails>(`/${type}/${id}`, {
      append_to_response: [
        'videos',
        'credits',
        'recommendations',
        'similar',
        type === 'movie' ? 'release_dates' : 'content_ratings',
      ].join(','),
    })
  } catch (error) {
    if (error instanceof TmdbNotFoundError) return null
    throw error
  }

  const base = toTitle(raw, type)
  if (!base) return null

  const genreNames = await getGenreNames()
  const recommendations = toTitles(
    raw.recommendations?.results ?? [],
    type,
    genreNames,
  )
  const related = (
    recommendations.length >= 6
      ? recommendations
      : toTitles(raw.similar?.results ?? [], type, genreNames)
  ).filter((t) => t.backdropPath)

  const certification =
    type === 'movie'
      ? raw.release_dates?.results
          .find((r) => r.iso_3166_1 === 'US')
          ?.release_dates.find((d) => d.certification)?.certification
      : raw.content_ratings?.results.find((r) => r.iso_3166_1 === 'US')?.rating

  const directors =
    raw.credits?.crew.filter((c) => c.job === 'Director').map((c) => c.name) ??
    []
  const creators = raw.created_by?.map((c) => c.name) ?? []
  const credits =
    type === 'tv' && creators.length
      ? { role: creators.length > 1 ? 'Creators' : 'Creator', names: creators }
      : directors.length
        ? {
            role: directors.length > 1 ? 'Directors' : 'Director',
            names: directors,
          }
        : null

  return {
    ...base,
    tagline: raw.tagline || null,
    runtime: raw.runtime || raw.episode_run_time?.[0] || null,
    seasons: raw.number_of_seasons ?? null,
    certification: certification || null,
    trailerKey: pickTrailer(raw.videos?.results),
    credits,
    cast: (raw.credits?.cast ?? []).slice(0, 12).map((c) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profilePath: c.profile_path,
    })),
    related: related.slice(0, 18),
  }
}

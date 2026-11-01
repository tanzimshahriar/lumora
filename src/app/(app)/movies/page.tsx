import { Catalog } from '@/components/media/Catalog'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Films' }

export default function MoviesPage() {
  return (
    <Catalog
      scope="movie"
      rows={[
        { id: 'trendingMovies', variant: 'poster' },
        { id: 'nowPlaying' },
        { id: 'popularMovies' },
        { id: 'topRatedMovies', variant: 'poster' },
        { id: 'thrillerMovies' },
        { id: 'comedyMovies' },
        { id: 'romanceMovies' },
        { id: 'animationMovies', variant: 'poster' },
        { id: 'documentaries' },
      ]}
    />
  )
}

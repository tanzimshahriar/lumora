import { Catalog } from '@/components/media/Catalog'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Home' }

export default function BrowsePage() {
  return (
    <Catalog
      scope="all"
      showWatchlist
      rows={[
        { id: 'trending', variant: 'poster' },
        { id: 'popularMovies' },
        { id: 'popularTv' },
        { id: 'topRatedMovies', variant: 'poster' },
        { id: 'comedyMovies' },
        { id: 'crimeTv' },
        { id: 'scifiTv' },
        { id: 'romanceMovies' },
        { id: 'animationMovies', variant: 'poster' },
        { id: 'thrillerMovies' },
      ]}
    />
  )
}

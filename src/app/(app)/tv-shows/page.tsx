import { Catalog } from '@/components/media/Catalog'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Series' }

export default function SeriesPage() {
  return (
    <Catalog
      scope="tv"
      rows={[
        { id: 'trendingTv', variant: 'poster' },
        { id: 'popularTv' },
        { id: 'topRatedTv', variant: 'poster' },
        { id: 'crimeTv' },
        { id: 'dramaTv' },
        { id: 'comedyTv' },
        { id: 'scifiTv' },
      ]}
    />
  )
}

import { TitleGrid, TitleGridSkeleton } from '@/components/media/TitleGrid'
import { SearchField } from '@/components/shell/SearchField'
import { getCollection, search } from '@/lib/tmdb'
import { SearchX } from 'lucide-react'
import type { Metadata } from 'next'
import { Suspense } from 'react'

type Props = { searchParams: Promise<{ q?: string | string[] }> }

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: typeof q === 'string' && q.trim() ? `“${q.trim()}”` : 'Search',
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = typeof q === 'string' ? q.trim() : ''

  return (
    <div className="container-app pt-24 pb-20 md:pt-32">
      <div className="mb-8 md:hidden">
        <Suspense>
          <SearchField variant="page" />
        </Suspense>
      </div>

      <h1 className="mb-8 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {query ? (
          <>
            Results for <span className="text-aurora">“{query}”</span>
          </>
        ) : (
          'Popular right now'
        )}
      </h1>

      <Suspense key={query} fallback={<TitleGridSkeleton />}>
        {query ? <SearchResults query={query} /> : <Popular />}
      </Suspense>
    </div>
  )
}

async function SearchResults({ query }: { query: string }) {
  const results = await search(query)

  if (results.length === 0) {
    return (
      <div className="grid place-items-center py-20 text-center">
        <SearchX aria-hidden="true" className="size-10 text-zinc-600" />
        <p className="mt-5 text-lg font-medium text-white">
          Nothing matched “{query}”
        </p>
        <p className="mt-2 text-zinc-400">
          Check the spelling or try a different title.
        </p>
      </div>
    )
  }

  return <TitleGrid titles={results} />
}

async function Popular() {
  const titles = await getCollection('trending')
  return <TitleGrid titles={titles.filter((t) => t.posterPath)} />
}

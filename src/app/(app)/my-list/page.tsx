import { TitleGrid } from '@/components/media/TitleGrid'
import { WatchlistButton } from '@/components/media/WatchlistButton'
import { buttonStyles } from '@/components/ui/button'
import { requireUser } from '@/lib/auth/session'
import { getWatchlist } from '@/lib/watchlist'
import { Bookmark } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'My List' }

export default async function MyListPage() {
  const user = await requireUser()
  const titles = await getWatchlist(user.id)

  return (
    <div className="container-app pt-28 pb-20 sm:pt-32">
      <header className="mb-10 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl text-white sm:text-6xl">
            My List
          </h1>
          <p className="mt-2 text-zinc-400">
            {titles.length
              ? `${titles.length} title${titles.length > 1 ? 's' : ''} saved for later`
              : 'Everything you save shows up here, on every device.'}
          </p>
        </div>
      </header>

      {titles.length ? (
        <TitleGrid
          titles={titles}
          renderAction={(title) => (
            <WatchlistButton
              type={title.type}
              id={title.id}
              initialSaved
              variant="overlay"
            />
          )}
        />
      ) : (
        <div className="grid place-items-center rounded-3xl border border-dashed border-white/10 px-6 py-20 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-accent/10 text-accent">
            <Bookmark aria-hidden="true" className="size-6" />
          </span>
          <h2 className="mt-6 text-xl font-semibold text-white">
            Your list is empty
          </h2>
          <p className="mt-2 max-w-sm text-zinc-400">
            Tap the + on any title to save it here and come back to it later.
          </p>
          <Link href="/browse" className={buttonStyles({ className: 'mt-8' })}>
            Find something to watch
          </Link>
        </div>
      )}
    </div>
  )
}

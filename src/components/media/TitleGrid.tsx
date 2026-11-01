import type { Title } from '@/lib/media'
import type { ReactNode } from 'react'
import { TitleCard } from './TitleCard'

const gridClass =
  'grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7'

export function TitleGrid({
  titles,
  renderAction,
}: {
  titles: Title[]
  /** Optional control overlaid on each card (e.g. remove from list). */
  renderAction?: (title: Title) => ReactNode
}) {
  return (
    <ul className={gridClass}>
      {titles.map((title) => (
        <li key={`${title.type}-${title.id}`} className="group relative">
          <TitleCard title={title} variant="poster" fluid />
          {renderAction && (
            <div className="absolute top-2 right-2 opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100">
              {renderAction(title)}
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

export function TitleGridSkeleton({ count = 14 }: { count?: number }) {
  return (
    <div aria-hidden="true" className={gridClass}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="aspect-[2/3] animate-pulse rounded-xl bg-ink-800"
          style={{ animationDelay: `${(i % 7) * 70}ms` }}
        />
      ))}
    </div>
  )
}

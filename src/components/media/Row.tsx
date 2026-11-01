import type { Title } from '@/lib/media'
import { cn } from '@/lib/cn'
import { RowScroller } from './RowScroller'
import { TitleCard, type CardVariant } from './TitleCard'

const slug = (label: string) =>
  `row-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

export function RowHeading({ id, label }: { id?: string; label: string }) {
  return (
    <h2
      id={id}
      className="container-app text-lg font-semibold tracking-tight text-white sm:text-xl"
    >
      {label}
    </h2>
  )
}

export function Row({
  label,
  titles,
  variant = 'backdrop',
}: {
  label: string
  titles: Title[]
  variant?: CardVariant
}) {
  const id = slug(label)
  return (
    <section aria-labelledby={id}>
      <RowHeading id={id} label={label} />
      <RowScroller label={label}>
        {titles.map((title) => (
          <li key={`${title.type}-${title.id}`} className="snap-start">
            <TitleCard title={title} variant={variant} />
          </li>
        ))}
      </RowScroller>
    </section>
  )
}

export function RowSkeleton({
  variant = 'backdrop',
}: {
  variant?: CardVariant
}) {
  return (
    <div aria-hidden="true">
      <div className="container-app">
        <div className="h-6 w-48 animate-pulse rounded-md bg-ink-700" />
      </div>
      <div className="flex gap-3 overflow-hidden px-(--gutter) pt-3 pb-6 sm:gap-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className={cn(
              'shrink-0 animate-pulse rounded-xl bg-ink-800',
              variant === 'poster'
                ? 'aspect-[2/3] w-[clamp(8.5rem,14vw,12.5rem)]'
                : 'aspect-video w-[clamp(15rem,24vw,22rem)]',
            )}
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

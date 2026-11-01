import { RowSkeleton } from '@/components/media/Row'

export default function Loading() {
  return (
    <div aria-hidden="true">
      <div className="flex min-h-[min(88svh,58rem)] items-end bg-linear-to-b from-ink-800 to-ink-950">
        <div className="grid container-app w-full items-end gap-10 pt-32 pb-12 lg:grid-cols-[minmax(0,17rem)_1fr] xl:grid-cols-[minmax(0,19rem)_1fr]">
          <div className="hidden aspect-[2/3] animate-pulse rounded-2xl bg-ink-700 lg:block" />
          <div>
            <div className="h-3 w-16 animate-pulse rounded bg-ink-600" />
            <div className="mt-4 h-16 w-[min(32rem,85%)] animate-pulse rounded-lg bg-ink-600" />
            <div className="mt-6 h-6 w-64 animate-pulse rounded-full bg-ink-700" />
            <div className="mt-6 h-4 w-[min(40rem,90%)] animate-pulse rounded bg-ink-700" />
            <div className="mt-2 h-4 w-[min(34rem,80%)] animate-pulse rounded bg-ink-700" />
            <div className="mt-8 flex gap-3">
              <div className="h-12 w-40 animate-pulse rounded-full bg-ink-600" />
              <div className="h-12 w-32 animate-pulse rounded-full bg-ink-700" />
            </div>
          </div>
        </div>
      </div>
      <div className="pt-4">
        <RowSkeleton />
      </div>
    </div>
  )
}

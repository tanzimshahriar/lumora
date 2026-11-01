import { TitleGridSkeleton } from '@/components/media/TitleGrid'

export default function Loading() {
  return (
    <div className="container-app pt-28 pb-20 sm:pt-32">
      <div className="mb-10 h-14 w-56 animate-pulse rounded-lg bg-ink-700" />
      <TitleGridSkeleton />
    </div>
  )
}

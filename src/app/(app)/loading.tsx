import { HeroSkeleton } from '@/components/media/Hero'
import { RowSkeleton } from '@/components/media/Row'

export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      <div className="relative z-10 -mt-24 space-y-6 sm:-mt-32 lg:-mt-40">
        <RowSkeleton variant="poster" />
        <RowSkeleton />
      </div>
    </>
  )
}

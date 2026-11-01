import { cn } from '@/lib/cn'
import { LoaderCircle } from 'lucide-react'

export function Spinner({ className }: { className?: string }) {
  return (
    <LoaderCircle
      aria-hidden="true"
      className={cn('size-4 animate-spin', className)}
    />
  )
}

import { cn } from '@/lib/cn'

/** Soft drifting light blobs used behind marketing and auth pages. */
export function Aurora({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 -z-20 overflow-hidden', className)}
    >
      <div className="absolute -top-[20%] -left-[10%] size-[60vmax] animate-drift rounded-full bg-accent-strong/25 blur-[120px]" />
      <div className="absolute top-[30%] -right-[15%] size-[50vmax] animate-drift rounded-full bg-[#f0b8ff]/15 blur-[120px] [animation-delay:-6s]" />
      <div className="absolute -bottom-[25%] left-[20%] size-[45vmax] animate-drift rounded-full bg-glow/15 blur-[120px] [animation-delay:-12s]" />
    </div>
  )
}

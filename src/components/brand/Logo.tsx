import { cn } from '@/lib/cn'
import { site } from '@/lib/site'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn('size-8 shrink-0', className)}
    >
      <defs>
        <linearGradient id="lumora-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b3a4ff" />
          <stop offset="0.55" stopColor="#f0b8ff" />
          <stop offset="1" stopColor="#ffc67d" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="24" fill="url(#lumora-mark)" />
      <circle cx="41.5" cy="24" r="17.5" fill="var(--color-ink-950)" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark />
      <span className="font-display text-[1.7rem] leading-none tracking-tight text-white">
        {site.name}
      </span>
    </span>
  )
}

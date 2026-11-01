import { cn } from '@/lib/cn'

const variants = {
  primary:
    'bg-white text-ink-950 shadow-lg shadow-black/30 hover:bg-zinc-100 hover:shadow-white/10',
  glass: 'glass text-white hover:bg-white/15',
  ghost: 'text-zinc-300 hover:bg-white/5 hover:text-white',
  outline:
    'text-white ring-1 ring-white/15 ring-inset hover:bg-white/5 hover:ring-white/30',
}

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-5 text-[15px] sm:h-13 sm:px-7',
  icon: 'size-11 justify-center sm:size-12',
}

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  className?: string
} = {}) {
  return cn(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition duration-200 select-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-[1.15em] [&_svg]:shrink-0',
    variants[variant],
    sizes[size],
    className,
  )
}

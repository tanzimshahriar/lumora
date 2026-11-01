import { GuestButton } from '@/components/marketing/GuestButton'
import Link from 'next/link'

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  footer: { prompt: string; href: string; label: string }
}) {
  return (
    <div className="w-full max-w-md animate-rise rounded-[2rem] bg-ink-900/75 p-7 shadow-2xl ring-1 shadow-black/50 ring-white/10 backdrop-blur-2xl sm:p-10">
      <h1 className="font-display text-4xl text-white sm:text-5xl">{title}</h1>
      <p className="mt-2 text-zinc-400">{subtitle}</p>

      <div className="mt-8">{children}</div>

      <div className="my-6 flex items-center gap-4 text-xs text-zinc-500 uppercase">
        <span className="h-px flex-1 bg-white/10" />
        or
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <GuestButton className="w-full" />

      <p className="mt-8 text-center text-sm text-zinc-400">
        {footer.prompt}{' '}
        <Link
          href={footer.href}
          className="font-medium text-white underline-offset-4 hover:underline"
        >
          {footer.label}
        </Link>
      </p>
    </div>
  )
}

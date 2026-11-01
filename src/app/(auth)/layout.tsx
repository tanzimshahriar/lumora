import { Logo } from '@/components/brand/Logo'
import { Aurora } from '@/components/marketing/Aurora'
import { site } from '@/lib/site'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden">
      <Aurora />
      <header className="flex h-20 container-app items-center">
        <Link href="/" aria-label={`${site.name} home`} className="rounded-lg">
          <Logo />
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        {children}
      </main>
      <p className="px-4 pb-6 text-center text-xs text-zinc-600">
        {site.name} is an independent portfolio project. Titles and artwork via
        TMDB.
      </p>
    </div>
  )
}

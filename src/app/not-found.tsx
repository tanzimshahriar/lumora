import { Logo } from '@/components/brand/Logo'
import { Aurora } from '@/components/marketing/Aurora'
import { buttonStyles } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="relative isolate grid min-h-dvh place-items-center overflow-hidden px-6 text-center">
      <Aurora />
      <div className="animate-rise">
        <Logo className="justify-center" />
        <p className="mt-12 text-aurora font-display text-8xl sm:text-9xl">
          404
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-white">
          This scene was cut
        </h1>
        <p className="mt-2 text-zinc-400">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link href="/" className={buttonStyles({ className: 'mt-8' })}>
          Back to the start
        </Link>
      </div>
    </main>
  )
}

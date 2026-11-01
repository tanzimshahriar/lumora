'use client'

import { buttonStyles } from '@/components/ui/button'
import { CircleAlert, RotateCw } from 'lucide-react'
import Link from 'next/link'

export default function Error({ retry }: { error: Error; retry: () => void }) {
  return (
    <div className="grid min-h-[80svh] container-app place-items-center pt-24 pb-16 text-center">
      <div className="max-w-md">
        <CircleAlert
          aria-hidden="true"
          className="mx-auto size-10 text-accent"
        />
        <h1 className="mt-5 font-display text-4xl text-white">
          The projector jammed
        </h1>
        <p className="mt-3 text-zinc-400">
          We couldn't load this page. It's usually a temporary hiccup with the
          catalogue, so give it another go.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button type="button" onClick={retry} className={buttonStyles()}>
            <RotateCw aria-hidden="true" />
            Try again
          </button>
          <Link href="/browse" className={buttonStyles({ variant: 'glass' })}>
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}

'use client'

import { buttonStyles } from '@/components/ui/button'
import { setWatchlisted } from '@/lib/actions'
import { cn } from '@/lib/cn'
import type { MediaType } from '@/lib/media'
import { Check, Plus } from 'lucide-react'
import { useOptimistic, useState, useTransition } from 'react'

export function WatchlistButton({
  type,
  id,
  initialSaved,
  variant = 'pill',
}: {
  type: MediaType
  id: number
  initialSaved: boolean
  variant?: 'pill' | 'icon' | 'overlay'
}) {
  const [saved, setSaved] = useState(initialSaved)
  const [optimisticSaved, setOptimisticSaved] = useOptimistic(saved)
  const [, startTransition] = useTransition()

  const toggle = () => {
    const next = !optimisticSaved
    startTransition(async () => {
      setOptimisticSaved(next)
      try {
        const result = await setWatchlisted({ type, id, saved: next })
        setSaved(result.saved)
      } catch {
        // The optimistic value rolls back on its own when the action fails.
      }
    })
  }

  const label = optimisticSaved ? 'Remove from My List' : 'Add to My List'
  const icon = (
    <span className="relative inline-grid size-[1.15em] place-items-center">
      <Plus
        aria-hidden="true"
        className={cn(
          'absolute transition duration-300 ease-out-expo',
          optimisticSaved && 'scale-50 rotate-90 opacity-0',
        )}
      />
      <Check
        aria-hidden="true"
        className={cn(
          'absolute transition duration-300 ease-out-expo',
          !optimisticSaved && 'scale-50 -rotate-90 opacity-0',
        )}
      />
    </span>
  )

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={optimisticSaved}
        className={buttonStyles({ variant: 'glass', size: 'lg' })}
      >
        {icon}
        {optimisticSaved ? 'In My List' : 'My List'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={optimisticSaved}
      aria-label={label}
      title={label}
      className={
        variant === 'icon'
          ? buttonStyles({ variant: 'glass', size: 'icon' })
          : 'grid size-9 place-items-center rounded-full glass bg-black/40 text-white transition hover:scale-110 hover:bg-black/60 active:scale-95'
      }
    >
      {icon}
    </button>
  )
}

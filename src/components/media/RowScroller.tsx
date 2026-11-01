'use client'

import { cn } from '@/lib/cn'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

export function RowScroller({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  const track = useRef<HTMLUListElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const update = useCallback(() => {
    const el = track.current
    if (!el) return
    setAtStart(el.scrollLeft < 8)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8)
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [update])

  const scroll = (direction: 1 | -1) => {
    const el = track.current
    el?.scrollBy({
      left: direction * el.clientWidth * 0.85,
      behavior: 'smooth',
    })
  }

  return (
    <div className="group/row relative">
      <ul
        ref={track}
        onScroll={update}
        aria-label={label}
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-(--gutter) gap-3 overflow-x-auto overscroll-x-contain px-(--gutter) pt-3 pb-6 sm:gap-4"
      >
        {children}
      </ul>
      <ScrollButton side="left" hidden={atStart} onClick={() => scroll(-1)} />
      <ScrollButton side="right" hidden={atEnd} onClick={() => scroll(1)} />
    </div>
  )
}

function ScrollButton({
  side,
  hidden,
  onClick,
}: {
  side: 'left' | 'right'
  hidden: boolean
  onClick: () => void
}) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-hidden="true"
      onClick={onClick}
      className={cn(
        'absolute inset-y-0 z-10 hidden w-(--gutter) min-w-12 items-center justify-center transition duration-300 md:flex',
        side === 'left'
          ? 'left-0 bg-linear-to-r from-ink-950 via-ink-950/70 to-transparent'
          : 'right-0 bg-linear-to-l from-ink-950 via-ink-950/70 to-transparent',
        hidden
          ? 'pointer-events-none opacity-0'
          : 'opacity-0 group-hover/row:opacity-100',
      )}
    >
      <span className="grid size-10 place-items-center rounded-full glass transition hover:scale-110 hover:bg-white/20">
        <Icon className="size-5" />
      </span>
    </button>
  )
}

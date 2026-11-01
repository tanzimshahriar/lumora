'use client'

import { cn } from '@/lib/cn'
import { DEMO_EMAIL } from '@/lib/site'
import { Bookmark, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export interface MenuUser {
  name?: string | null
  email?: string | null
}

const initials = (user: MenuUser) =>
  (user.name || user.email || '?')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

export function UserMenu({ user }: { user: MenuUser }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isGuest = user.email === DEMO_EMAIL

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const itemClass =
    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.07] hover:text-white'

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'grid size-9 place-items-center rounded-full bg-linear-to-br from-accent via-[#f0b8ff] to-glow text-[13px] font-bold text-ink-950 ring-2 transition sm:size-10',
          open ? 'ring-white/50' : 'ring-white/10 hover:ring-white/30',
        )}
      >
        {initials(user)}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-3 w-64 origin-top-right animate-rise rounded-2xl bg-ink-900/90 p-2 shadow-2xl ring-1 shadow-black/60 ring-white/10 backdrop-blur-xl"
        >
          <div className="px-3 py-2.5">
            <p className="truncate font-medium text-white">
              {user.name || 'Your account'}
            </p>
            <p className="truncate text-xs text-zinc-400">
              {isGuest ? 'Guest session · shared demo account' : user.email}
            </p>
          </div>
          <div className="my-1 h-px bg-white/10" />
          <Link role="menuitem" href="/my-list" className={itemClass}>
            <Bookmark aria-hidden="true" className="size-4" />
            My List
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => signOut({ callbackUrl: '/' })}
            className={itemClass}
          >
            <LogOut aria-hidden="true" className="size-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

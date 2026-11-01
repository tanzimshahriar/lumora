'use client'

import { Logo } from '@/components/brand/Logo'
import { cn } from '@/lib/cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { navItems } from './nav-items'
import { SearchField } from './SearchField'
import { UserMenu, type MenuUser } from './UserMenu'

export function Navbar({ user }: { user: MenuUser }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-500',
        scrolled
          ? 'bg-ink-950/75 shadow-[0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-xl backdrop-saturate-150'
          : 'bg-linear-to-b from-ink-950/80 to-transparent',
      )}
    >
      <nav
        aria-label="Main"
        className="flex h-16 container-app items-center gap-8 lg:h-18"
      >
        <Link href="/browse" aria-label="Lumora home" className="rounded-lg">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition',
                    active
                      ? 'bg-white/10 text-white'
                      : 'text-zinc-400 hover:text-white',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Suspense>
            <SearchField variant="nav" />
          </Suspense>
          <UserMenu user={user} />
        </div>
      </nav>
    </header>
  )
}

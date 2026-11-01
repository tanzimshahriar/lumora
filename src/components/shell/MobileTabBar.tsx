'use client'

import { cn } from '@/lib/cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { mobileNavItems } from './nav-items'

export function MobileTabBar() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.06] bg-ink-950/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <ul className="grid grid-cols-5">
        {mobileNavItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition',
                  active ? 'text-white' : 'text-zinc-500',
                )}
              >
                <Icon
                  aria-hidden="true"
                  className={cn('size-5', active && 'text-accent')}
                />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

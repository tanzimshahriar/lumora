'use client'

import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/cn'
import { Search, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'

const DEBOUNCE_MS = 300

/**
 * Live search that keeps the query in the URL (/search?q=…), so results are
 * server-rendered, shareable and survive back/forward navigation.
 * `nav` is the collapsible desktop field; `page` is the always-open field
 * shown on the search page on mobile.
 */
export function SearchField({ variant }: { variant: 'nav' | 'page' }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const onSearchPage = pathname === '/search'

  const [value, setValue] = useState(() =>
    onSearchPage ? (searchParams.get('q') ?? '') : '',
  )
  const [open, setOpen] = useState(variant === 'page' || onSearchPage)
  const [pending, startTransition] = useTransition()
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const input = useRef<HTMLInputElement>(null)

  // The navbar outlives page changes: sync it when entering or leaving search.
  useEffect(() => {
    if (variant !== 'nav') return
    setOpen(onSearchPage)
    setValue(
      onSearchPage
        ? (new URLSearchParams(window.location.search).get('q') ?? '')
        : '',
    )
  }, [onSearchPage, variant])

  useEffect(() => () => clearTimeout(timer.current), [])

  const navigate = (query: string) => {
    const url = query ? `/search?q=${encodeURIComponent(query)}` : '/search'
    startTransition(() => {
      if (onSearchPage) router.replace(url, { scroll: false })
      else router.push(url)
    })
  }

  const handleChange = (next: string) => {
    setValue(next)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      const query = next.trim()
      if (query || onSearchPage) navigate(query)
    }, DEBOUNCE_MS)
  }

  const clear = () => {
    handleChange('')
    input.current?.focus()
  }

  if (variant === 'nav' && !open) {
    return (
      <button
        type="button"
        aria-label="Search"
        onClick={() => setOpen(true)}
        className="hidden size-10 place-items-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white md:grid"
      >
        <Search aria-hidden="true" className="size-5" />
      </button>
    )
  }

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        clearTimeout(timer.current)
        navigate(value.trim())
      }}
      className={cn(
        'relative items-center',
        variant === 'nav'
          ? 'hidden w-64 animate-fade md:flex lg:w-80'
          : 'flex w-full',
      )}
    >
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 size-4.5 text-zinc-400"
      />
      <input
        ref={input}
        type="search"
        value={value}
        autoFocus={variant === 'nav' || !value}
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && variant === 'nav' && !value) {
            setOpen(false)
          }
        }}
        onBlur={() => {
          if (variant === 'nav' && !value && !onSearchPage) setOpen(false)
        }}
        placeholder="Search films and series…"
        aria-label="Search films and series"
        className={cn(
          'w-full rounded-full bg-white/[0.07] pr-11 pl-11 text-white ring-1 ring-white/10 transition outline-none placeholder:text-zinc-500 focus:bg-white/10 focus:ring-2 focus:ring-accent [&::-webkit-search-cancel-button]:hidden',
          variant === 'nav' ? 'h-10 text-sm' : 'h-13 text-base',
        )}
      />
      <span className="absolute right-3 grid size-6 place-items-center">
        {pending ? (
          <Spinner className="text-zinc-400" />
        ) : value ? (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="grid size-6 place-items-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        ) : null}
      </span>
    </form>
  )
}

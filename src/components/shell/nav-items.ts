import { Bookmark, Film, House, Search, Tv } from 'lucide-react'

export const navItems = [
  { href: '/browse', label: 'Home', icon: House },
  { href: '/movies', label: 'Films', icon: Film },
  { href: '/tv-shows', label: 'Series', icon: Tv },
  { href: '/my-list', label: 'My List', icon: Bookmark },
]

export const mobileNavItems = [
  ...navItems.slice(0, 3),
  { href: '/search', label: 'Search', icon: Search },
  navItems[3],
]

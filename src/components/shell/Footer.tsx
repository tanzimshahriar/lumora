import { Logo } from '@/components/brand/Logo'
import { cn } from '@/lib/cn'
import { site } from '@/lib/site'
import Link from 'next/link'

export function Footer({
  links = [],
  className,
}: {
  links?: { href: string; label: string }[]
  className?: string
}) {
  return (
    <footer
      className={cn(
        'border-t border-white/[0.06] bg-ink-950 text-sm text-zinc-500',
        className,
      )}
    >
      <div className="flex container-app flex-col gap-8 py-10 sm:py-12 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-sm space-y-3">
          <Logo />
          <p className="text-zinc-400">{site.tagline}</p>
        </div>

        {links.length > 0 && (
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-zinc-400 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="max-w-md space-y-2 text-xs/relaxed lg:text-right">
          <p>
            Film and series data from{' '}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-300 underline-offset-4 hover:underline"
            >
              TMDB
            </a>
            . This product uses the TMDB API but is not endorsed or certified by
            TMDB. Trailers are streamed from YouTube and belong to their
            respective owners.
          </p>
          <p>
            © {new Date().getFullYear()} {site.name} · An independent portfolio
            project. No full-length content is hosted here.
          </p>
        </div>
      </div>
    </footer>
  )
}

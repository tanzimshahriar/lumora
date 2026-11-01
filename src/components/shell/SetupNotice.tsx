import { KeyRound } from 'lucide-react'

export function SetupNotice() {
  return (
    <div className="grid min-h-[80svh] container-app place-items-center pt-24 pb-16">
      <div className="max-w-lg rounded-3xl bg-ink-900 p-8 ring-1 ring-white/10 sm:p-10">
        <span className="grid size-12 place-items-center rounded-2xl bg-accent/15 text-accent">
          <KeyRound aria-hidden="true" className="size-6" />
        </span>
        <h1 className="mt-6 font-display text-4xl text-white">
          Connect the catalogue
        </h1>
        <p className="mt-3 text-zinc-400">
          Titles, artwork and trailers come from TMDB. Add a free API token to
          load them:
        </p>
        <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-zinc-300 marker:text-zinc-500">
          <li>
            Create an account at{' '}
            <a
              className="text-accent underline-offset-4 hover:underline"
              href="https://www.themoviedb.org/settings/api"
              target="_blank"
              rel="noreferrer"
            >
              themoviedb.org/settings/api
            </a>
          </li>
          <li>
            Copy the <strong>API Read Access Token</strong>
          </li>
          <li>
            Set <code className="rounded bg-white/10 px-1.5">TMDB_TOKEN</code>{' '}
            in <code className="rounded bg-white/10 px-1.5">.env.local</code>{' '}
            and restart the dev server
          </li>
        </ol>
      </div>
    </div>
  )
}

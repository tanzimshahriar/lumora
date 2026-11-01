import { site } from '@/lib/site'
import { Plus } from 'lucide-react'

const questions = [
  {
    q: `What is ${site.name}?`,
    a: `${site.name} is a cinematic discovery app built as a portfolio project. Browse what's trending, watch official trailers in full screen, and keep a personal watchlist.`,
  },
  {
    q: 'Can I watch full movies or episodes?',
    a: `No. ${site.name} plays official trailers hosted on YouTube and shows metadata from TMDB. It doesn't host, sell or stream full-length content.`,
  },
  {
    q: 'Does it cost anything?',
    a: 'Nothing at all. Create an account or explore instantly as a guest. You will never be asked for payment details.',
  },
  {
    q: 'Where does the film and series data come from?',
    a: 'Titles, artwork, cast and ratings come from The Movie Database (TMDB), a community-built catalogue. Trailers are embedded from YouTube.',
  },
  {
    q: 'How is my account stored?',
    a: 'Your account and watchlist live in a PostgreSQL database. Passwords are hashed with bcrypt and never stored or logged in plain text.',
  },
]

export function Faq() {
  return (
    <section
      aria-labelledby="faq"
      className="mx-auto max-w-3xl px-5 py-24 sm:py-32"
    >
      <h2
        id="faq"
        className="text-center font-display text-5xl text-white sm:text-6xl"
      >
        Questions, answered
      </h2>
      <div className="mt-12 divide-y divide-white/[0.08] rounded-3xl bg-ink-900/60 ring-1 ring-white/[0.08]">
        {questions.map(({ q, a }) => (
          <details
            key={q}
            name="faq"
            className="group px-6 transition-colors open:bg-white/[0.02] sm:px-8"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-base font-medium text-white sm:text-lg [&::-webkit-details-marker]:hidden">
              {q}
              <Plus
                aria-hidden="true"
                className="size-5 shrink-0 text-zinc-400 transition duration-300 group-open:rotate-45 group-open:text-accent"
              />
            </summary>
            <p className="-mt-2 pb-6 leading-relaxed text-pretty text-zinc-400">
              {a}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}

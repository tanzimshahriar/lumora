import { cn } from '@/lib/cn'
import {
  Bookmark,
  MonitorPlay,
  MonitorSmartphone,
  Search,
  type LucideIcon,
} from 'lucide-react'

const features: {
  icon: LucideIcon
  title: string
  body: string
  className?: string
  art?: React.ReactNode
}[] = [
  {
    icon: MonitorPlay,
    title: 'Trailers take centre stage',
    body: 'Every title opens with its official trailer, playing quietly behind the artwork. One tap takes it full screen.',
    className: 'md:col-span-2',
    art: (
      <div className="absolute inset-y-6 right-6 hidden w-[46%] overflow-hidden rounded-2xl bg-linear-to-br from-accent-strong/40 via-[#f0b8ff]/20 to-glow/30 ring-1 ring-white/10 sm:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgb(255_255_255/0.25),transparent_60%)]" />
        <div className="absolute bottom-4 left-4 space-y-2">
          <div className="h-3 w-32 rounded-full bg-white/70" />
          <div className="h-2 w-20 rounded-full bg-white/40" />
        </div>
        <div className="absolute top-1/2 left-1/2 grid size-14 -translate-1/2 place-items-center rounded-full glass">
          <div className="ml-1 size-0 border-y-8 border-l-[13px] border-y-transparent border-l-white" />
        </div>
      </div>
    ),
  },
  {
    icon: Bookmark,
    title: 'A list that follows you',
    body: 'Save anything with a tap. Your list is stored with your account, so it is there on every device.',
  },
  {
    icon: Search,
    title: 'Find it in a keystroke',
    body: 'Search films and series as you type, with results that update instantly and links you can share.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Made for every screen',
    body: 'Designed for widescreen monitors and phones alike, with touch-friendly rows and a thumb-reachable tab bar.',
    className: 'md:col-span-2',
    art: (
      <div className="absolute right-8 bottom-0 hidden h-[78%] w-[40%] sm:block">
        <div className="absolute inset-x-0 top-0 bottom-0 rounded-t-2xl bg-ink-800 p-3 ring-1 ring-white/10">
          <div className="h-[38%] rounded-lg bg-linear-to-br from-accent-strong/40 to-glow/25" />
          <div className="mt-3 flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-10 flex-1 rounded-md bg-white/[0.07]" />
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-10 flex-1 rounded-md bg-white/[0.05]" />
            ))}
          </div>
        </div>
        <div className="absolute -bottom-6 -left-6 h-[86%] w-[28%] rounded-[1.4rem] bg-ink-950 p-1.5 shadow-2xl ring-1 shadow-black ring-white/15">
          <div className="flex h-full flex-col overflow-hidden rounded-[1.1rem] bg-ink-800">
            <div className="h-[45%] bg-linear-to-b from-[#f0b8ff]/30 to-accent-strong/20" />
            <div className="m-2 h-6 rounded bg-white/[0.07]" />
            <div className="mx-2 h-6 rounded bg-white/[0.05]" />
            <div className="mt-auto flex justify-around border-t border-white/10 py-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'size-2 rounded-full',
                    i === 0 ? 'bg-accent' : 'bg-white/20',
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
]

export function Features() {
  return (
    <section
      aria-labelledby="features"
      className="mx-auto max-w-6xl px-5 py-24 sm:py-32"
    >
      <p className="text-center text-xs font-semibold tracking-[0.22em] text-accent uppercase">
        Why you'll like it
      </p>
      <h2
        id="features"
        className="mx-auto mt-4 max-w-2xl text-center font-display text-5xl leading-[0.95] text-balance text-white sm:text-6xl"
      >
        Less scrolling. More watching.
      </h2>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {features.map(({ icon: Icon, title, body, className, art }) => (
          <article
            key={title}
            className={cn(
              'group relative min-h-64 overflow-hidden rounded-3xl bg-ink-900 p-8 ring-1 ring-white/[0.07] transition duration-500 hover:ring-white/15',
              className,
            )}
          >
            <div className="absolute -top-24 -left-24 size-64 rounded-full bg-accent/10 opacity-0 blur-3xl transition duration-700 group-hover:opacity-100" />
            <span className="relative grid size-11 place-items-center rounded-xl bg-white/[0.06] text-accent ring-1 ring-white/10">
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <div className={cn('relative mt-10', art && 'sm:max-w-[46%]')}>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="mt-2 leading-relaxed text-zinc-400">{body}</p>
            </div>
            {art}
          </article>
        ))}
      </div>
    </section>
  )
}

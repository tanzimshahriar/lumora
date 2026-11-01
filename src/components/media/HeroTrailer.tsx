'use client'

import { cn } from '@/lib/cn'
import { Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import YouTube, { type YouTubePlayer, type YouTubeProps } from 'react-youtube'

const PLAYER_OPTIONS: YouTubeProps['opts'] = {
  host: 'https://www.youtube-nocookie.com',
  playerVars: {
    autoplay: 1,
    mute: 1,
    controls: 0,
    disablekb: 1,
    fs: 0,
    iv_load_policy: 3,
    playsinline: 1,
    rel: 0,
  },
}

/**
 * Fades a muted trailer in over the hero still once it actually starts
 * playing. Skipped on small screens, data saver and reduced motion.
 */
export function HeroTrailer({ videoKey }: { videoKey: string }) {
  const [enabled, setEnabled] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const player = useRef<YouTubePlayer | null>(null)
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saveData = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection?.saveData
    const suitable = window.matchMedia(
      '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
    ).matches
    if (!suitable || saveData) return
    // Let the still image land before the video starts loading.
    const timer = setTimeout(() => setEnabled(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  // Pause while the hero is scrolled out of view.
  useEffect(() => {
    const el = container.current
    if (!el || !enabled) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) player.current?.playVideo()
        else player.current?.pauseVideo()
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [enabled])

  const toggleMute = () => {
    if (muted) player.current?.unMute()
    else player.current?.mute()
    setMuted(!muted)
  }

  return (
    <>
      <div
        ref={container}
        aria-hidden="true"
        className={cn(
          'video-cover absolute inset-0 transition-opacity duration-[1500ms]',
          playing ? 'opacity-100' : 'opacity-0',
        )}
      >
        {enabled && (
          <YouTube
            videoId={videoKey}
            opts={PLAYER_OPTIONS}
            className="absolute inset-0"
            onReady={(event) => {
              player.current = event.target
            }}
            onPlay={() => setPlaying(true)}
            onEnd={() => setPlaying(false)}
            onError={() => setPlaying(false)}
          />
        )}
      </div>
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? 'Unmute trailer' : 'Mute trailer'}
        className={cn(
          'absolute right-(--gutter) bottom-[max(9rem,22%)] z-20 grid size-11 place-items-center rounded-full glass text-white transition duration-500 hover:bg-white/20',
          playing ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        {muted ? (
          <VolumeX aria-hidden="true" className="size-5" />
        ) : (
          <Volume2 aria-hidden="true" className="size-5" />
        )}
      </button>
    </>
  )
}

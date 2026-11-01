import { site } from '@/lib/site'
import { ImageResponse } from 'next/og'

export const alt = `${site.name}: ${site.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 96,
        color: 'white',
        background:
          'radial-gradient(circle at 15% 20%, rgba(143,123,255,0.45), transparent 50%), radial-gradient(circle at 85% 90%, rgba(255,198,125,0.35), transparent 45%), #07070b',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 999,
            background: 'linear-gradient(135deg, #b3a4ff, #f0b8ff, #ffc67d)',
          }}
        />
        <div style={{ fontSize: 56, fontWeight: 700 }}>{site.name}</div>
      </div>
      <div
        style={{ marginTop: 48, fontSize: 76, lineHeight: 1.05, maxWidth: 900 }}
      >
        {site.tagline}
      </div>
      <div style={{ marginTop: 28, fontSize: 30, color: '#a1a1aa' }}>
        Trailers · Watchlists · Discovery
      </div>
    </div>,
    size,
  )
}

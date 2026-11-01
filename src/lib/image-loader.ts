const TMDB_PREFIX = 'https://image.tmdb.org/t/p/'
const TMDB_WIDTHS = [185, 300, 342, 500, 780, 1280]

type LoaderProps = { src: string; width: number }

export default function imageLoader({ src, width }: LoaderProps) {
  if (!src.startsWith(TMDB_PREFIX)) return src

  // src looks like https://image.tmdb.org/t/p/<size>/<file>.jpg
  const file = src.slice(src.indexOf('/', TMDB_PREFIX.length))
  // Never request `original`: those files are often several megabytes and
  // paint top-down while loading. w1280 still looks sharp behind gradients.
  const size = TMDB_WIDTHS.find((w) => w >= width) ?? 1280
  return `${TMDB_PREFIX}w${size}${file}`
}

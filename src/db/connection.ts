/**
 * Resolves the Postgres URL for the app and drizzle-kit.
 *
 * Hosted providers (Supabase, Vercel, Neon) hand out URLs with libpq's
 * `sslmode=require`, meaning "encrypt the connection". node-postgres now reads
 * that as `verify-full`, which rejects Supabase's private CA, so opt into
 * libpq semantics unless the URL already picks a behaviour.
 */
export function getDatabaseUrl() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!url) return undefined
  if (/[?&]sslmode=require(&|$)/.test(url) && !url.includes('uselibpqcompat')) {
    return `${url}&uselibpqcompat=true`
  }
  return url
}

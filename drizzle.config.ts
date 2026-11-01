import type { Config } from 'drizzle-kit'
import { config } from 'dotenv'

config({ path: ['.env.local', '.env'], quiet: true })

const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL

if (!url) {
  throw new Error('DATABASE_URL is missing. Copy .env.example to .env.local.')
}

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url },
} satisfies Config

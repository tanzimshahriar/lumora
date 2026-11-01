import type { Config } from 'drizzle-kit'
import { config } from 'dotenv'
import { getDatabaseUrl } from './src/db/connection'

config({ path: ['.env.local', '.env'], quiet: true })

const url = getDatabaseUrl()

if (!url) {
  throw new Error('DATABASE_URL is missing. Copy .env.example to .env.local.')
}

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url },
} satisfies Config

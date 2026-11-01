import 'server-only'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { getDatabaseUrl } from './connection'
import * as schema from './schema'

// Reuse one pool across hot reloads in development.
const globalForDb = globalThis as unknown as { pgPool?: Pool }

const pool =
  globalForDb.pgPool ??
  new Pool({
    connectionString: getDatabaseUrl(),
    max: process.env.NODE_ENV === 'production' ? 5 : 10,
  })

if (process.env.NODE_ENV !== 'production') globalForDb.pgPool = pool

export const db = drizzle({ client: pool, schema })

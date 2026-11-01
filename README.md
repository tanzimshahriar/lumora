# Lumora

A cinematic discovery app: browse trending films and series, watch official
trailers, and keep a watchlist synced to your account.

Built with Next.js 16 (App Router, Server Components, Server Actions), React 19,
Tailwind CSS 4, Drizzle ORM on PostgreSQL, and NextAuth. Catalogue data comes
from [TMDB](https://www.themoviedb.org); trailers are embedded from YouTube.

> Lumora is an independent portfolio project. It does not host or stream
> full-length content.

## Features

- **Trailer-first hero** that fades a muted trailer in over the artwork, with
  mute control, and pauses when scrolled out of view
- **Streamed catalogue rows** with snap scrolling, hover previews and skeletons
- **Title pages** with cast, ratings, certification and recommendations
- **My List** stored in Postgres, with optimistic toggles
- **Live search** kept in the URL (`/search?q=…`), so results are shareable
- **Guest mode** for one-click exploring, plus email and password accounts
- Responsive layout with a mobile tab bar, keyboard focus states and
  reduced-motion support

## Getting started

Requires Node.js 20.9 or newer (`.nvmrc` pins 22).

```bash
npm install
cp .env.example .env.local
```

### 1. Database (any PostgreSQL)

Set `DATABASE_URL` in `.env.local`. Anything that speaks Postgres works:

| Provider    | Example `DATABASE_URL`                                                         |
| ----------- | ------------------------------------------------------------------------------ |
| Local       | `postgresql://postgres:postgres@localhost:5432/lumora`                         |
| Docker      | `docker compose up -d`, then use the local URL above                           |
| Neon        | `postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/db?sslmode=require` |
| Supabase    | See [Using Supabase](#using-supabase) below                                    |
| Railway/RDS | The connection string from your dashboard                                      |

`POSTGRES_URL` is also accepted, so the env var set by Vercel's Postgres and
Supabase integrations works as-is. On serverless hosts such as Vercel, use your
provider's **pooled** connection string. `sslmode=require` keeps libpq's meaning
(encrypt the connection); use `sslmode=verify-full` with `sslrootcert` for
strict certificate checks.

#### Using Supabase

The app talks to Supabase's Postgres directly through Drizzle, so it needs the
database connection string, not the `NEXT_PUBLIC_SUPABASE_*` keys.

1. In the Supabase dashboard, click **Connect**, then **Connection String**.
2. Copy the **Session pooler** URI (port 5432, IPv4-friendly) for local
   development and migrations. On Vercel, use the **Transaction pooler** URI
   (port 6543).
3. Replace `[YOUR-PASSWORD]` with your database password (Project Settings,
   then Database, to reset it). URL-encode special characters, e.g. `@` → `%40`.
4. Add `?sslmode=require` to the end and save it as `DATABASE_URL` in
   `.env.local`.

Migrations enable row-level security on every table. The app connects as the
table owner, so it is unaffected, but Supabase's public REST API can't read the
`users` table.

Create the tables:

```bash
npm run db:migrate
```

Check the connection at any time with `GET /api/health`.

### 2. TMDB

Create a free account, then copy the **API Read Access Token** from
[themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) into
`TMDB_TOKEN`. A v3 key in `TMDB_API_KEY` also works.

### 3. Auth

Set `NEXTAUTH_SECRET` to a random value (`openssl rand -base64 32`) and
`NEXTAUTH_URL` to the site's URL.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command               | Purpose                                     |
| --------------------- | ------------------------------------------- |
| `npm run dev`         | Start the dev server (Turbopack)            |
| `npm run build`       | Production build                            |
| `npm run lint`        | ESLint                                      |
| `npm run typecheck`   | Generate route types and run `tsc`          |
| `npm run db:generate` | Create a migration after editing the schema |
| `npm run db:migrate`  | Apply migrations                            |
| `npm run db:push`     | Sync the schema directly (prototyping)      |
| `npm run db:studio`   | Browse the database in Drizzle Studio       |

## Project structure

```
src/
  app/
    (marketing)/     Landing page
    (auth)/          Sign in and sign up
    (app)/           Signed-in app: browse, films, series, title, search, my list
    watch/           Full-screen trailer player
  components/        UI grouped by area (media, shell, marketing, auth, ui)
  db/                Drizzle schema, client and migrations
  lib/               TMDB client, auth, server actions, watchlist queries
```

## Deploying

Deploy to Vercel or any Node host. Set `DATABASE_URL`, `NEXTAUTH_SECRET`,
`NEXTAUTH_URL` and `TMDB_TOKEN`, then run `npm run db:migrate` against the
production database.

Choose a project name and domain that are your own. Avoid names or URLs that
reference an existing streaming brand: browsers' safe-browsing systems flag
look-alike sign-in pages as phishing.

## Credits

This product uses the TMDB API but is not endorsed or certified by TMDB.
Trailers are streamed from YouTube and belong to their respective owners.

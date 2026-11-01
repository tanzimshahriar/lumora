import {
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'

export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 255 }).primaryKey().notNull(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }),
    emailVerified: timestamp('emailVerified'),
    image: varchar('image', { length: 255 }),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (user) => [uniqueIndex('users__email__idx').on(user.email)],
)

export const watchlist = pgTable(
  'watchlist',
  {
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    mediaType: varchar('media_type', { length: 8 })
      .$type<'movie' | 'tv'>()
      .notNull(),
    mediaId: integer('media_id').notNull(),
    // Snapshot of the title so My List renders without calling TMDB.
    title: text('title').notNull(),
    posterPath: text('poster_path'),
    backdropPath: text('backdrop_path'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (item) => [
    primaryKey({ columns: [item.userId, item.mediaType, item.mediaId] }),
    index('watchlist__user_created__idx').on(item.userId, item.createdAt),
  ],
)

export type WatchlistItem = typeof watchlist.$inferSelect

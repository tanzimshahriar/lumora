'use server'

import { db } from '@/db'
import { users, watchlist } from '@/db/schema'
import { DEMO_EMAIL } from '@/lib/site'
import { requireUser } from '@/lib/auth/session'
import { getTitle } from '@/lib/tmdb'
import { hash } from 'bcryptjs'
import { and, eq } from 'drizzle-orm'
import { refresh } from 'next/cache'
import { z } from 'zod'

const watchlistInput = z.object({
  type: z.enum(['movie', 'tv']),
  id: z.number().int().positive(),
  saved: z.boolean(),
})

/** Idempotently adds or removes a title, so double clicks can't desync. */
export async function setWatchlisted(input: z.input<typeof watchlistInput>) {
  const user = await requireUser()
  const { type, id, saved } = watchlistInput.parse(input)
  const match = and(
    eq(watchlist.userId, user.id),
    eq(watchlist.mediaType, type),
    eq(watchlist.mediaId, id),
  )

  if (saved) {
    // Look the title up server-side rather than trusting client-sent fields.
    const title = await getTitle(type, id)
    if (!title) throw new Error('Title not found')
    await db
      .insert(watchlist)
      .values({
        userId: user.id,
        mediaType: type,
        mediaId: id,
        title: title.title,
        posterPath: title.posterPath,
        backdropPath: title.backdropPath,
      })
      .onConflictDoNothing()
  } else {
    await db.delete(watchlist).where(match)
  }

  refresh()
  return { saved }
}

const signUpInput = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(80),
  email: z
    .email('Enter a valid email address.')
    .transform((email) => email.toLowerCase())
    .refine((email) => email !== DEMO_EMAIL, 'This email is reserved.'),
  password: z
    .string()
    .min(8, 'Use at least 8 characters.')
    .max(72, 'Use 72 characters or fewer.'),
})

export type SignUpField = keyof z.input<typeof signUpInput>
export type SignUpResult =
  { ok: true } | { ok: false; errors: Partial<Record<SignUpField, string>> }

export async function signUp(
  input: z.input<typeof signUpInput>,
): Promise<SignUpResult> {
  const parsed = signUpInput.safeParse(input)
  if (!parsed.success) {
    const errors: Partial<Record<SignUpField, string>> = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as SignUpField
      errors[field] ??= issue.message
    }
    return { ok: false, errors }
  }

  const { name, email, password } = parsed.data
  const created = await db
    .insert(users)
    .values({
      id: crypto.randomUUID(),
      name,
      email,
      password: await hash(password, 12),
    })
    .onConflictDoNothing({ target: users.email })
    .returning({ id: users.id })

  if (created.length === 0) {
    return {
      ok: false,
      errors: { email: 'An account with this email already exists.' },
    }
  }
  return { ok: true }
}

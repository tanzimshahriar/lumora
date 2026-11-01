import { db } from '@/db'
import { users } from '@/db/schema'
import { compare } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { z } from 'zod'
import { DEMO_EMAIL } from '@/lib/site'

const credentialsSchema = z.object({
  email: z.email().transform((email) => email.toLowerCase()),
  password: z.string().min(1),
})

async function getOrCreateDemoUser() {
  await db
    .insert(users)
    .values({ id: crypto.randomUUID(), name: 'Guest', email: DEMO_EMAIL })
    .onConflictDoNothing({ target: users.email })
  const [user] = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(eq(users.email, DEMO_EMAIL))
  return user ?? null
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: '/signin' },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, parsed.data.email))
          .limit(1)

        // Same response for unknown email and wrong password, so the form
        // can't be used to discover which emails have accounts.
        if (!user?.password) return null
        if (!(await compare(parsed.data.password, user.password))) return null

        return { id: user.id, email: user.email, name: user.name }
      },
    }),
    CredentialsProvider({
      id: 'demo',
      name: 'Guest',
      credentials: {},
      authorize: getOrCreateDemoUser,
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id
      return session
    },
  },
}

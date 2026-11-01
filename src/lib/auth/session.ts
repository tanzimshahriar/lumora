import 'server-only'
import { authOptions } from '@/lib/auth/auth-options'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { cache } from 'react'

export const getSession = cache(() => getServerSession(authOptions))

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user?.id ? session.user : null
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) redirect('/signin')
  return user
}

export async function redirectIfSignedIn() {
  if (await getCurrentUser()) redirect('/browse')
}

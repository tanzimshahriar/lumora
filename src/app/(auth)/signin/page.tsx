import { AuthCard } from '@/components/auth/AuthCard'
import { SignInForm } from '@/components/auth/SignInForm'
import { redirectIfSignedIn } from '@/lib/auth/session'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sign in' }

export default async function SignInPage() {
  await redirectIfSignedIn()
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to pick up where you left off."
      footer={{
        prompt: 'New here?',
        href: '/signup',
        label: 'Create an account',
      }}
    >
      <SignInForm />
    </AuthCard>
  )
}

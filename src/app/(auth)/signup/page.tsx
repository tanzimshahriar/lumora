import { AuthCard } from '@/components/auth/AuthCard'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { redirectIfSignedIn } from '@/lib/auth/session'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Create account' }

type Props = { searchParams: Promise<{ email?: string | string[] }> }

export default async function SignUpPage({ searchParams }: Props) {
  await redirectIfSignedIn()
  const { email } = await searchParams

  return (
    <AuthCard
      title="Create your account"
      subtitle="Free forever. Save titles and pick up on any device."
      footer={{
        prompt: 'Already have an account?',
        href: '/signin',
        label: 'Sign in',
      }}
    >
      <SignUpForm
        defaultEmail={typeof email === 'string' ? email : undefined}
      />
    </AuthCard>
  )
}

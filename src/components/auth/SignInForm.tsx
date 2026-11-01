'use client'

import { buttonStyles } from '@/components/ui/button'
import { Spinner } from '@/components/ui/Spinner'
import { CircleAlert } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useTransition, type FormEvent } from 'react'
import { Field } from './Field'

export function SignInForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    startTransition(async () => {
      setError(null)
      const result = await signIn('credentials', {
        redirect: false,
        email: data.get('email'),
        password: data.get('password'),
      })
      if (result?.ok && !result.error) {
        router.replace('/browse')
        router.refresh()
      } else {
        setError(
          result?.error === 'CredentialsSignin'
            ? "That email and password don't match. Check them and try again."
            : 'Something went wrong signing you in. Please try again.',
        )
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && (
        <p
          role="alert"
          className="flex gap-3 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200 ring-1 ring-rose-400/30"
        >
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
      <Field
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        required
      />
      <Field
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        required
      />
      <button
        type="submit"
        disabled={pending}
        className={buttonStyles({ size: 'lg', className: 'w-full' })}
      >
        {pending && <Spinner />}
        Sign in
      </button>
    </form>
  )
}

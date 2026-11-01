'use client'

import { buttonStyles } from '@/components/ui/button'
import { Spinner } from '@/components/ui/Spinner'
import { signUp, type SignUpField } from '@/lib/actions'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useTransition, type FormEvent } from 'react'
import { Field } from './Field'

export function SignUpForm({ defaultEmail }: { defaultEmail?: string }) {
  const router = useRouter()
  const [errors, setErrors] = useState<Partial<Record<SignUpField, string>>>({})
  const [pending, startTransition] = useTransition()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const input = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      password: String(data.get('password') ?? ''),
    }

    startTransition(async () => {
      const result = await signUp(input)
      if (!result.ok) {
        setErrors(result.errors)
        return
      }
      setErrors({})
      await signIn('credentials', {
        redirect: false,
        email: input.email,
        password: input.password,
      })
      router.replace('/browse')
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field
        id="name"
        label="Name"
        autoComplete="name"
        placeholder="Alex Morgan"
        error={errors.name}
        required
      />
      <Field
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        defaultValue={defaultEmail}
        error={errors.email}
        required
      />
      <Field
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        hint="At least 8 characters."
        error={errors.password}
        required
      />
      <button
        type="submit"
        disabled={pending}
        className={buttonStyles({ size: 'lg', className: 'w-full' })}
      >
        {pending && <Spinner />}
        Create account
      </button>
    </form>
  )
}

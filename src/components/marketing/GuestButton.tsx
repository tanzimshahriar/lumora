'use client'

import { buttonStyles } from '@/components/ui/button'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/cn'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

/** One-click sign-in to the shared demo account. */
export function GuestButton({
  className,
  variant = 'outline',
  size = 'lg',
}: {
  className?: string
  variant?: 'outline' | 'glass' | 'ghost'
  size?: 'md' | 'lg'
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [failed, setFailed] = useState(false)

  const start = () =>
    startTransition(async () => {
      setFailed(false)
      const result = await signIn('demo', { redirect: false })
      if (result?.ok && !result.error) {
        router.replace('/browse')
        router.refresh()
      } else {
        setFailed(true)
      }
    })

  return (
    <button
      type="button"
      onClick={start}
      disabled={pending}
      className={cn(buttonStyles({ variant, size }), className)}
    >
      {pending && <Spinner />}
      {failed ? 'Guest sign-in failed, retry' : 'Explore as guest'}
    </button>
  )
}

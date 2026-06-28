'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setLocale } from '@/actions/locale'
import type { Locale } from '@/i18n/request'

interface LocaleSwitcherProps {
  currentLocale: Locale
  className?: string
}

export function LocaleSwitcher({ currentLocale, className = '' }: LocaleSwitcherProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const next: Locale = currentLocale === 'es' ? 'en' : 'es'

  function handleSwitch() {
    startTransition(async () => {
      await setLocale(next)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleSwitch}
      disabled={isPending}
      aria-label="Switch language"
      className={[
        'btn-press rounded-full border border-outline-variant px-3 py-1.5 text-label-sm text-on-surface-variant transition-colors duration-200 hover:bg-surface-variant disabled:opacity-50',
        className,
      ].join(' ')}
    >
      {currentLocale === 'es' ? 'EN' : 'ES'}
    </button>
  )
}

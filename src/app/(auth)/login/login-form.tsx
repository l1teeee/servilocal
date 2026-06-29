'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { login } from '@/actions/auth'
import type { AuthState } from '@/actions/auth'
import { SubmitButton } from '@/components/ui/submit-button'

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10'

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const t = useTranslations('Auth')
  const [state, formAction] = useActionState<AuthState | null, FormData>(login, null)

  return (
    <div>
      {/* Logo */}
      <p className="mb-10 text-sm font-bold tracking-tight text-primary">ServiLocal</p>

      <h1 className="text-3xl font-bold text-gray-900">{t('login.title')}</h1>
      <p className="mt-2 text-sm text-gray-500">{t('login.subtitle')}</p>

      {state?.error && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t('fields.email')}
          </label>
          <input id="email" name="email" type="email" autoComplete="email" required placeholder="tu@correo.com" className={inputClass} />
          {state?.fieldErrors?.email && (
            <p className="text-xs text-red-500">{state.fieldErrors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t('fields.password')}
          </label>
          <input id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••" className={inputClass} />
          {state?.fieldErrors?.password && (
            <p className="text-xs text-red-500">{state.fieldErrors.password}</p>
          )}
        </div>

        <div className="mt-2">
          <SubmitButton label={t('login.button')} />
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        {t('login.noAccount')}{' '}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          {t('login.registerLink')}
        </Link>
      </p>
    </div>
  )
}

'use client'

import { useActionState, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { AlertCircle, Wrench, GraduationCap, Truck, Sparkles, Palette, Monitor, Briefcase, HardHat } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { registerAndLogin } from '@/actions/auth'
import type { AuthState } from '@/actions/auth'
import { SubmitButton } from '@/components/ui/submit-button'

type Skill = 'PLUMBING' | 'TEACHING' | 'DELIVERY' | 'CLEANING' | 'DESIGN' | 'DIGITAL'

const SKILLS: { value: Skill; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { value: 'PLUMBING', label: 'Fontanería',    Icon: Wrench },
  { value: 'TEACHING', label: 'Enseñanza',      Icon: GraduationCap },
  { value: 'DELIVERY', label: 'Delivery',       Icon: Truck },
  { value: 'CLEANING', label: 'Limpieza',       Icon: Sparkles },
  { value: 'DESIGN',   label: 'Diseño',         Icon: Palette },
  { value: 'DIGITAL',  label: 'Digital / Tech', Icon: Monitor },
]

const COUNTRY_CODES = [
  { code: '+503', flag: '🇸🇻', name: 'El Salvador' },
  { code: '+502', flag: '🇬🇹', name: 'Guatemala' },
  { code: '+504', flag: '🇭🇳', name: 'Honduras' },
  { code: '+505', flag: '🇳🇮', name: 'Nicaragua' },
  { code: '+506', flag: '🇨🇷', name: 'Costa Rica' },
  { code: '+507', flag: '🇵🇦', name: 'Panamá' },
  { code: '+1',   flag: '🇺🇸', name: 'EE. UU.' },
  { code: '+52',  flag: '🇲🇽', name: 'México' },
  { code: '+34',  flag: '🇪🇸', name: 'España' },
]

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10'

const labelClass = 'text-xs font-semibold uppercase tracking-wider text-gray-400'

export function RegisterForm({ callbackUrl }: { callbackUrl: string }) {
  const t = useTranslations('Auth')
  const [state, formAction] = useActionState<AuthState | null, FormData>(registerAndLogin, null)
  const [role, setRole]               = useState<'CLIENT' | 'PROVIDER'>('CLIENT')
  const [skills, setSkills]           = useState<Skill[]>([])
  const [countryCode, setCountryCode] = useState('+503')
  const [phoneNumber, setPhoneNumber] = useState('')

  function toggleSkill(skill: Skill) {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    )
  }

  return (
    <div>
      {/* Logo */}
      <p className="mb-8 text-sm font-bold tracking-tight text-primary">ServiLocal</p>

      <h1 className="text-3xl font-bold text-gray-900">{t('register.title')}</h1>
      <p className="mt-2 text-sm text-gray-500">{t('register.subtitle')}</p>

      {state?.error && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <form action={formAction} className="mt-7 flex flex-col gap-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <input type="hidden" name="role" value={role} />
        {skills.map((s) => (
          <input key={s} type="hidden" name="skills" value={s} />
        ))}

        {/* Role toggle */}
        <div className="flex flex-col gap-2">
          <span className={labelClass}>{t('register.roleLabel')}</span>
          <div className="relative flex border-b border-gray-100">
            {([
              { value: 'CLIENT',   Icon: Briefcase, label: t('register.roleClient') },
              { value: 'PROVIDER', Icon: HardHat,   label: t('register.roleProvider') },
            ] as const).map(({ value: r, Icon, label }) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`inline-flex flex-1 items-center justify-center gap-2 pb-3 text-sm font-semibold transition-colors duration-200 ${
                  role === r ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            ))}
            <motion.div
              className="absolute bottom-0 h-0.5 w-1/2 bg-primary"
              animate={{ x: role === 'CLIENT' ? '0%' : '100%' }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
        </div>

        {/* Full name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className={labelClass}>{t('fields.fullName')}</label>
          <input id="name" name="name" type="text" autoComplete="name" required placeholder="Juan Pérez" className={inputClass} />
          {state?.fieldErrors?.name && <p className="text-xs text-red-500">{state.fieldErrors.name}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className={labelClass}>{t('fields.email')}</label>
          <input id="email" name="email" type="email" autoComplete="email" required placeholder="tu@correo.com" className={inputClass} />
          {state?.fieldErrors?.email && <p className="text-xs text-red-500">{state.fieldErrors.email}</p>}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phoneNumber" className={labelClass}>Teléfono</label>
          <input type="hidden" name="phone" value={`${countryCode}${phoneNumber}`} />
          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="shrink-0 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            >
              {COUNTRY_CODES.map(({ code, flag, name }) => (
                <option key={code} value={code}>{flag} {code} {name}</option>
              ))}
            </select>
            <input
              id="phoneNumber"
              type="tel"
              inputMode="numeric"
              placeholder="7900 0000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\s/g, ''))}
              required
              className={`${inputClass} flex-1`}
            />
          </div>
          {state?.fieldErrors?.phone && <p className="text-xs text-red-500">{state.fieldErrors.phone}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className={labelClass}>{t('fields.password')}</label>
          <input id="password" name="password" type="password" autoComplete="new-password" required placeholder="••••••••" className={inputClass} />
          {state?.fieldErrors?.password && <p className="text-xs text-red-500">{state.fieldErrors.password}</p>}
        </div>

        {/* Skills — PROVIDER only */}
        {role === 'PROVIDER' && (
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <span className={labelClass}>
              Mis habilidades
              <span className="ml-1 normal-case tracking-normal text-gray-300">(elige las que apliquen)</span>
            </span>
            <div className="grid grid-cols-2 gap-2">
              {SKILLS.map(({ value, label, Icon }) => {
                const active = skills.includes(value)
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleSkill(value)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-all duration-200 ${
                      active
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-primary/40 hover:text-primary'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="font-medium">{label}</span>
                  </button>
                )
              })}
            </div>
            {skills.length === 0 && (
              <p className="text-xs text-gray-400">Selecciona al menos una habilidad.</p>
            )}
            {state?.fieldErrors?.skills && <p className="text-xs text-red-500">{state.fieldErrors.skills}</p>}
          </motion.div>
        )}

        <div className="mt-2">
          <SubmitButton label={t('register.button')} />
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        {t('register.haveAccount')}{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          {t('register.loginLink')}
        </Link>
      </p>
    </div>
  )
}

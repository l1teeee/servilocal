'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { setLocale } from '@/actions/locale'
import type { Locale } from '@/i18n/request'

type Labels = {
  findWork: string
  postJob:  string
  about:    string
  login:    string
}

type User = {
  name:          string
  dashboardHref: string
} | null

type Props = {
  labels: Labels
  user:   User
  locale: Locale
}

function LocaleToggle({ locale }: { locale: Locale }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const next: Locale = locale === 'es' ? 'en' : 'es'

  function handle() {
    startTransition(async () => {
      await setLocale(next)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handle}
      disabled={isPending}
      aria-label="Switch language"
      className="btn-press rounded-full px-3 py-1.5 text-label-sm text-on-surface-variant transition-colors duration-200 hover:bg-white hover:text-primary disabled:opacity-40"
    >
      {locale === 'es' ? 'EN' : 'ES'}
    </button>
  )
}

export function SiteHeaderClient({ labels, user, locale }: Props) {
  const pathname = usePathname()
  const [visible, setVisible]           = useState(false)
  const [inHowItWorks, setInHowItWorks] = useState(false)

  const navItems = [
    { href: '/jobs',               label: labels.findWork },
    { href: '/dashboard/jobs/new', label: labels.postJob  },
    { href: '/about',              label: labels.about    },
  ]

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.85)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function onEnter() { setInHowItWorks(true) }
    function onLeave() { setInHowItWorks(false) }
    window.addEventListener('hiw:enter', onEnter)
    window.addEventListener('hiw:leave', onLeave)
    return () => {
      window.removeEventListener('hiw:enter', onEnter)
      window.removeEventListener('hiw:leave', onLeave)
    }
  }, [])

  const shown = visible && !inHowItWorks

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4',
        'transition-[opacity,transform] duration-500 ease-out',
        shown
          ? 'translate-y-0 opacity-100'
          : '-translate-y-2 pointer-events-none opacity-0',
      ].join(' ')}
    >
      {/* Island */}
      <div className="mx-auto max-w-7xl rounded-2xl border border-black/10 bg-white/80 shadow-sm backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between gap-4 px-4 md:px-5">

          {/* Logo — icon gray, no colored box */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2"
            aria-label="ServiLocal"
          >
            <span
              className="material-symbols-outlined text-[22px] text-on-surface-variant"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              handshake
            </span>
            <span className="text-sm font-semibold text-on-surface">ServiLocal</span>
          </Link>

          {/* Nav — no inner pill, plain links */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {navItems.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    'rounded-full px-4 py-2 text-label-md transition-colors duration-200',
                    active
                      ? 'bg-white text-primary'
                      : 'text-on-surface-variant hover:bg-white hover:text-primary',
                  ].join(' ')}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1.5">
            <LocaleToggle locale={locale} />

            {user ? (
              <Link
                href={user.dashboardHref}
                className="btn-press flex items-center gap-1.5 rounded-full px-4 py-2 text-label-md text-on-surface-variant transition-colors duration-200 hover:bg-white hover:text-primary"
              >
                <span
                  className="material-symbols-outlined text-[17px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  account_circle
                </span>
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="btn-press rounded-full px-5 py-2 text-label-md text-on-surface-variant transition-colors duration-200 hover:bg-white hover:text-primary"
              >
                {labels.login}
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}

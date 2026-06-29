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
    document.documentElement.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    document.documentElement.style.opacity = '0'

    startTransition(async () => {
      await setLocale(next)
      router.refresh()
    })
  }

  useEffect(() => {
    if (!isPending) {
      document.documentElement.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      document.documentElement.style.opacity = '1'
    }
  }, [isPending])

  return (
    <button
      onClick={handle}
      disabled={isPending}
      aria-label="Switch language"
      className="text-xs font-medium text-gray-400 transition-colors duration-200 hover:text-gray-900 disabled:opacity-40"
    >
      {locale === 'es' ? 'EN' : 'ES'}
    </button>
  )
}

export function SiteHeaderClient({ labels, user, locale }: Props) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  const navItems = [
    { href: '/jobs',               label: labels.findWork },
    { href: '/dashboard/jobs/new', label: labels.postJob  },
    { href: '/about',              label: labels.about    },
  ]

  useEffect(() => {
    let lastY = window.scrollY

    function onScroll() {
      const currentY = window.scrollY
      const pastHero = currentY > window.innerHeight * 0.5

      if (!pastHero) {
        setVisible(false)
      } else if (currentY < lastY) {
        setVisible(true)
      } else if (currentY > lastY + 4) {
        setVisible(false)
      }

      lastY = currentY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 px-4 pt-4',
        'transition-[opacity,transform] duration-500 ease-out',
        visible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-3 pointer-events-none opacity-0',
      ].join(' ')}
    >
      <div className="mx-auto max-w-6xl rounded-2xl border border-gray-200/60 bg-white/90 shadow-sm shadow-black/4 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between gap-6 px-5">

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="ServiLocal">
            <span
              className="material-symbols-outlined text-[20px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              handshake
            </span>
            <span className="text-sm font-bold tracking-tight text-primary">ServiLocal</span>
          </Link>

          {/* Nav — centered */}
          <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {navItems.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    'rounded-lg px-4 py-2 text-sm transition-colors duration-200',
                    active
                      ? 'font-semibold text-primary'
                      : 'font-medium text-gray-500 hover:text-primary',
                  ].join(' ')}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-4">
            <LocaleToggle locale={locale} />

            {user ? (
              <Link
                href={user.dashboardHref}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900"
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  account_circle
                </span>
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary/85"
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

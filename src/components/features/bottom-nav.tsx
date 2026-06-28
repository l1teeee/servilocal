'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

const NAV_ITEMS = [
  { href: '/', icon: 'home', key: 'home', fill: true },
  { href: '/jobs', icon: 'work', key: 'jobs', fill: false },
  { href: '/dashboard/jobs/new', icon: 'add_circle', key: 'postJob', fill: false },
  { href: '/about', icon: 'info', key: 'about', fill: false },
] as const

function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function BottomNav() {
  const t = useTranslations('BottomNav')
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-2xl border-t border-outline-variant bg-surface-container-lowest px-gutter pb-4 pt-2 shadow-[0_-12px_30px_-22px_rgb(29_78_216_/_0.45)] md:hidden">
      {NAV_ITEMS.map(({ href, icon, key, fill }) => {
        const isActive = isActivePath(pathname, href)
        return (
          <Link
            key={href}
            href={href}
            className={[
              'flex flex-col items-center justify-center px-4 py-1 rounded-full transition-colors duration-200',
              isActive
                ? 'bg-primary-container text-on-primary-container'
                : 'text-on-surface-variant hover:bg-surface-variant',
            ].join(' ')}
          >
            <span
              className="material-symbols-outlined mb-1 text-2xl"
              style={
                isActive && fill
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
              {icon}
            </span>
            <span className="text-label-sm">{t(key)}</span>
          </Link>
        )
      })}
    </nav>
  )
}

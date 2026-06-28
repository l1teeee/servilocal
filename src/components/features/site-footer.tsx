import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export async function SiteFooter() {
  const t = await getTranslations('Footer')

  const links = [
    { key: 'jobs' as const, href: '/jobs' },
    { key: 'postJob' as const, href: '/dashboard/jobs/new' },
    { key: 'about' as const, href: '/about' },
    { key: 'login' as const, href: '/login' },
  ]

  return (
    <footer className="mt-app-xl border-t border-outline-variant bg-surface-container-lowest">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-margin-mobile py-app-lg md:flex-row md:items-center md:justify-between md:px-margin-desktop">
        <div className="flex flex-col items-center md:items-start">
          <span className="mb-2 flex items-center gap-2 text-headline-md text-primary">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              handshake
            </span>
            ServiLocal
          </span>
          <p className="max-w-sm text-center text-body-md text-on-surface-variant md:text-left">
            {t('tagline')}
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-3 md:justify-end">
          {links.map(({ key, href }) => (
            <Link
              key={href}
              href={href}
              className="btn-press rounded-full border border-outline-variant bg-surface px-4 py-2 text-label-md text-on-surface-variant transition-colors duration-200 hover:border-primary/50 hover:text-primary"
            >
              {t(key)}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export async function SiteFooter() {
  const t = await getTranslations('Footer')

  const columns = [
    {
      label: t('colPlatform'),
      links: [
        { label: t('jobs'),       href: '/jobs' },
        { label: t('postJob'),    href: '/dashboard/jobs/new' },
        { label: t('howItWorks'), href: '/#how-it-works' },
        { label: t('categories'), href: '/jobs?view=categories' },
      ],
    },
    {
      label: t('colCompany'),
      links: [
        { label: t('about'),   href: '/about' },
        { label: t('blog'),    href: '/blog' },
        { label: t('contact'), href: '/contact' },
      ],
    },
    {
      label: t('colSupport'),
      links: [
        { label: t('help'),    href: '/help' },
        { label: t('safety'),  href: '/safety' },
        { label: t('terms'),   href: '/terms' },
        { label: t('privacy'), href: '/privacy' },
      ],
    },
  ]

  return (
    <footer className="border-t border-gray-100 bg-white">
      {/* Main grid */}
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 md:px-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2" aria-label="ServiLocal">
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1", color: '#1d4ed8' }}
              >
                handshake
              </span>
              <span className="text-base font-bold" style={{ color: '#1d4ed8' }}>ServiLocal</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500">
              {t('tagline')}
            </p>
            {/* Social icons */}
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: 'language',  href: '#', label: 'Web' },
                { icon: 'chat',      href: '#', label: 'WhatsApp' },
                { icon: 'mail',      href: '#', label: 'Email' },
              ].map(({ icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors duration-200 hover:border-gray-900 hover:text-gray-900"
                >
                  <span
                    className="material-symbols-outlined text-[17px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {icon}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {columns.map((col) => (
            <div key={col.label}>
              <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-wider text-gray-400">
                {col.label}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-gray-500 transition-colors duration-200 hover:text-gray-900"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 md:flex-row md:px-14">
          <p className="text-xs text-gray-400">{t('copyright')}</p>
          <div className="flex items-center gap-1">
            <span
              className="material-symbols-outlined text-[14px] text-gray-300"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lock
            </span>
            <p className="text-xs text-gray-400">Pagos seguros vía Tkiero</p>
          </div>
          <p className="text-xs text-gray-400">
            Developed by{' '}
            <a
              href="https://www.delta-numen.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Numen Agency
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

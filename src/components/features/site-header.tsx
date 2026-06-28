import { getTranslations, getLocale } from 'next-intl/server'
import { auth } from '@/lib/auth'
import type { Locale } from '@/i18n/request'
import { SiteHeaderClient } from './site-header-client'

export async function SiteHeader() {
  const [t, locale, session] = await Promise.all([
    getTranslations('Header'),
    getLocale(),
    auth(),
  ])

  const labels = {
    findWork: t('findWork'),
    postJob: t('postJob'),
    about: t('about'),
    login: t('login'),
  }

  const user = session
    ? {
        name: session.user.name ?? '',
        dashboardHref:
          session.user.role === 'PROVIDER' ? '/dashboard/applications' : '/dashboard/jobs',
      }
    : null

  return <SiteHeaderClient labels={labels} user={user} locale={locale as Locale} />
}

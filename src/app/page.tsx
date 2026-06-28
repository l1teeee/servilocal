import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import { db } from '@/lib/db'
import { SiteHeader } from '@/components/features/site-header'
import { SiteFooter } from '@/components/features/site-footer'
import { BottomNav } from '@/components/features/bottom-nav'
import { HeroVideoBackground } from '@/components/features/hero-video-background'
import { HeroScrollFocus } from '@/components/features/hero-scroll-focus'
import { HeroSearchForm } from '@/components/features/hero-search-form'
import { CategoriesSection } from '@/components/features/categories-section'
import { CategoriesSkeleton } from '@/components/features/categories-skeleton'
import { HowItWorksScroll } from '@/components/features/how-it-works-scroll'
import type { ServiceCategory } from '@/types'

type JobPostListing = {
  id: string
  title: string
  description: string
  budget: number
  category: ServiceCategory
  deadline: Date
  createdAt: Date
  applicationsCount: number
  client: { name: string }
}

const CATEGORY_ORDER: ServiceCategory[] = [
  'PLUMBING',
  'CLEANING',
  'TEACHING',
  'DELIVERY',
  'DESIGN',
  'DIGITAL',
]

const DEFAULT_CATEGORY_ICONS: Record<ServiceCategory, string> = {
  PLUMBING: 'plumbing',
  TEACHING: 'school',
  DELIVERY: 'local_shipping',
  CLEANING: 'cleaning_services',
  DESIGN: 'brush',
  DIGITAL: 'computer',
}

function secondsAgo(date: Date): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / 1000)
}

async function getActiveJobPosts(): Promise<JobPostListing[]> {
  try {
    const rows = await db.jobPost.findMany({
      where: { status: 'OPEN' },
      include: {
        client: { select: { name: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    })

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      budget: Number(row.budget),
      category: row.category as ServiceCategory,
      deadline: row.deadline,
      createdAt: row.createdAt,
      applicationsCount: row._count.applications,
      client: { name: row.client.name },
    }))
  } catch {
    return []
  }
}

async function getActiveJobCount(): Promise<number> {
  try {
    return await db.jobPost.count({ where: { status: 'OPEN' } })
  } catch {
    return 0
  }
}

export default async function HomePage() {
  const [jobs, activeJobCount, t, locale] = await Promise.all([
    getActiveJobPosts(),
    getActiveJobCount(),
    getTranslations('HomePage'),
    getLocale(),
  ])

  const featuredJob = jobs[0]
  const secondaryJobs = jobs.slice(1)
  const dateFormatter = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-SV', {
    day: 'numeric',
    month: 'short',
  })

  const timeAgo = (date: Date) => {
    const secs = Math.max(0, secondsAgo(date))
    if (secs < 3600) {
      return t('timeAgo.minutesAgo', { count: Math.max(1, Math.floor(secs / 60)) })
    }
    if (secs < 86400) {
      return t('timeAgo.hoursAgo', { count: Math.max(1, Math.floor(secs / 3600)) })
    }
    return t('timeAgo.daysAgo', { count: Math.max(1, Math.floor(secs / 86400)) })
  }

  const howItWorks = [
    {
      title: t('howItWorksStep1Title'),
      desc:  t('howItWorksStep1Desc'),
      image: '/servilocal-hero-repair.png',
    },
    {
      title: t('howItWorksStep2Title'),
      desc:  t('howItWorksStep2Desc'),
      image: '/servilocal-hero-cleaning.png',
    },
    {
      title: t('howItWorksStep3Title'),
      desc:  t('howItWorksStep3Desc'),
      image: '/servilocal-hero-delivery.png',
    },
  ]

  return (
    <div className="pb-20 md:pb-0">
      <SiteHeader />

      {/* ── Hero — full-screen background image ── */}
      <HeroScrollFocus className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Subtle vertical grid overlay */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="grid h-full w-full grid-cols-12 divide-x divide-white/[0.07]">
            <div className="col-span-1" />
            <div className="col-span-3" />
            <div className="col-span-4" />
            <div className="col-span-3" />
            <div className="col-span-1" />
          </div>
        </div>

        {/* Video background — loops through 4 clips, pauses when off-screen */}
        <HeroVideoBackground />
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/75" />

        {/* Content */}
        <div className="relative z-20 mx-auto max-w-4xl px-6 py-24 text-center text-white">
          {/* Kicker badge */}
          <p className="hero-item hero-item-1 mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm">
            <span
              className="material-symbols-outlined text-[16px] text-blue-300"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            {t('heroKicker')}
          </p>

          {/* Main headline */}
          <h1 className="hero-item hero-item-2 text-[2.6rem] font-bold leading-tight tracking-tight md:text-[4.5rem] md:leading-[1.1]">
            {t('heroTitle')}
          </h1>

          {/* Subtitle */}
          <p className="hero-item hero-item-3 mx-auto mt-6 max-w-2xl text-lg font-light text-white/80 md:text-xl">
            {t('heroProof')}
          </p>

          {/* Search form */}
          <div className="hero-item hero-item-4 relative z-10">
            <HeroSearchForm
              searchLabel={t('searchLabel')}
              searchHint={t('searchHint')}
              searchButton={t('searchButton')}
            />
          </div>

          {/* CTAs */}
          <div className="hero-item hero-item-5 mt-8 flex flex-wrap items-center justify-center gap-4">
            {/* Animated pill — "Post a Job" */}
            <Link
              href="/dashboard/jobs/new"
              className="hero-cta-pill group inline-flex cursor-pointer items-center gap-0"
            >
              <span className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 ease-out group-hover:bg-white group-hover:text-primary">
                {t('postJob')}
              </span>
              <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-primary text-white transition-colors duration-300 ease-out group-hover:bg-white group-hover:text-primary">
                <ArrowUpRight className="absolute h-4.5 w-4.5 transition-transform duration-300 ease-out group-hover:translate-x-[200%] group-hover:translate-y-[-200%]" />
                <ArrowUpRight className="absolute h-4.5 w-4.5 translate-x-[-200%] translate-y-[200%] transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
              </div>
            </Link>

            {/* Ghost CTA — "Find Work" */}
            <Link
              href="/jobs"
              className="hero-cta-ghost inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3 text-sm font-medium text-white/80 transition-colors duration-300 ease-out active:scale-[0.97] hover:border-white hover:bg-white hover:text-primary"
            >
              {t('findWork')}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-14 flex flex-wrap justify-center gap-3">
            <div className="cursor-default rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-center backdrop-blur-sm transition-colors duration-300 ease-out hover:border-white/25 hover:bg-white/15">
              <p className="text-2xl font-bold text-white">
                {CATEGORY_ORDER.length}
              </p>
              <p className="mt-0.5 text-xs font-medium text-white/70">
                {t('heroStatCategories')}
              </p>
            </div>
            <div className="cursor-default rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-center backdrop-blur-sm transition-colors duration-300 ease-out hover:border-white/25 hover:bg-white/15">
              <p className="text-2xl font-bold text-white">
                El Salvador
              </p>
              <p className="mt-0.5 text-xs font-medium text-white/70">
                {t('heroStatCoverage')}
              </p>
            </div>
            <div className="cursor-default rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-center backdrop-blur-sm transition-colors duration-300 ease-out hover:border-white/25 hover:bg-white/15">
              <p className="text-2xl font-bold text-white">
                {activeJobCount}
              </p>
              <p className="mt-0.5 text-xs font-medium text-white/70">
                {t('activeJobsTitle')}
              </p>
            </div>
          </div>
        </div>
      </HeroScrollFocus>

      {/* ── Categories — fullscreen pinned scroll ── */}
      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesSection />
      </Suspense>

      {/* ── How it works — pinned horizontal scroll ── */}
      <HowItWorksScroll
        steps={howItWorks}
        eyebrow={t('howItWorksEyebrow')}
      />

      <main className="mx-auto max-w-7xl">
        {/* ── Active jobs ── */}
        <section className="px-margin-mobile py-14 md:px-margin-desktop md:py-16">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-label-md uppercase text-on-surface-variant">
                {t('activeJobsEyebrow')}
              </p>
              <h2 className="text-headline-lg-mobile text-primary md:text-headline-lg">
                {t('activeJobsTitle')}
              </h2>
              <p className="mt-2 max-w-xl text-body-md text-on-surface-variant">
                {t('activeJobsSubtitle')}
              </p>
            </div>
            <Link
              href="/jobs"
              className="btn-press inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-label-md text-on-primary transition-opacity hover:opacity-90"
            >
              {t('viewAllJobs')}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

          {featuredJob ? (
            <div
              className={
                secondaryJobs.length > 0
                  ? 'grid gap-5 lg:grid-cols-[1.06fr_0.94fr]'
                  : 'max-w-3xl'
              }
            >
              <article className="card-enter card-enter-1 card-hover flex min-h-[25rem] flex-col rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm md:p-7">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary-container px-3 py-1.5 text-label-sm text-on-primary-container">
                    <span className="material-symbols-outlined text-[16px]">
                      {DEFAULT_CATEGORY_ICONS[featuredJob.category] ?? 'work'}
                    </span>
                    {t(`serviceCategory.${featuredJob.category}`)}
                  </span>
                  <span className="rounded-full border border-outline-variant px-3 py-1.5 text-label-sm text-on-surface-variant">
                    {t('featuredJob')}
                  </span>
                </div>

                <h3 className="max-w-xl text-headline-lg-mobile text-on-surface md:text-headline-lg">
                  {featuredJob.title}
                </h3>
                <p className="mt-4 max-w-2xl flex-grow text-body-lg text-on-surface-variant">
                  {featuredJob.description}
                </p>

                <dl className="mt-8 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-surface-container p-4">
                    <dt className="text-label-sm text-on-surface-variant">
                      {t('clientLabel')}
                    </dt>
                    <dd className="mt-1 text-label-md text-on-surface">
                      {featuredJob.client.name}
                    </dd>
                  </div>
                  <div className="rounded-2xl bg-surface-container p-4">
                    <dt className="text-label-sm text-on-surface-variant">
                      {t('deadlineLabel')}
                    </dt>
                    <dd className="mt-1 text-label-md text-on-surface">
                      {dateFormatter.format(featuredJob.deadline)}
                    </dd>
                  </div>
                  <div className="rounded-2xl bg-surface-container p-4">
                    <dt className="text-label-sm text-on-surface-variant">
                      {t('proposalCount', { count: featuredJob.applicationsCount })}
                    </dt>
                    <dd className="mt-1 text-label-md text-on-surface">
                      {t('protectedPayment')}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex flex-col gap-4 border-t border-outline-variant pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-label-sm text-on-surface-variant">
                      {t('heroRequestBudget')}
                    </p>
                    <p className="text-[2rem] font-bold leading-10 text-primary">
                      ${featuredJob.budget.toFixed(2)}
                    </p>
                  </div>
                  <Link
                    href={`/jobs/${featuredJob.id}`}
                    className="btn-press inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-label-md text-on-primary transition-opacity hover:opacity-90"
                  >
                    {t('viewJob')}
                  </Link>
                </div>
              </article>

              {secondaryJobs.length > 0 && (
                <div className="grid gap-4">
                  {secondaryJobs.map((job, index) => {
                    const delayIndex = Math.min(index + 2, 6)
                    return (
                      <article
                        key={job.id}
                        className={`card-enter card-enter-${delayIndex} card-hover rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm`}
                      >
                        <div className="mb-3 flex items-start justify-between gap-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 text-label-sm text-on-surface-variant">
                            <span className="material-symbols-outlined text-[15px]">
                              {DEFAULT_CATEGORY_ICONS[job.category] ?? 'work'}
                            </span>
                            {t(`serviceCategory.${job.category}`)}
                          </span>
                          <span className="shrink-0 text-label-sm text-on-surface-variant">
                            {timeAgo(job.createdAt)}
                          </span>
                        </div>

                        <h3 className="text-headline-md text-on-surface">{job.title}</h3>
                        <p className="mt-2 line-clamp-2 text-body-md text-on-surface-variant">
                          {job.description}
                        </p>

                        <div className="mt-5 flex items-end justify-between gap-4 border-t border-outline-variant pt-4">
                          <div>
                            <p className="text-label-sm text-on-surface-variant">
                              {job.client.name}
                            </p>
                            <p className="mt-1 text-headline-md text-primary">
                              ${job.budget.toFixed(2)}
                            </p>
                          </div>
                          <Link
                            href={`/jobs/${job.id}`}
                            className="btn-press rounded-full border border-primary px-4 py-2 text-label-sm text-primary transition-colors hover:bg-primary-container"
                          >
                            {t('viewJob')}
                          </Link>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              title={t('noJobsTitle')}
              subtitle={t('noJobsSubtitle')}
              cta={t('postJob')}
            />
          )}
        </section>
      </main>

      <SiteFooter />
      <BottomNav />
    </div>
  )
}

function EmptyState({
  title,
  subtitle,
  cta,
}: {
  title: string
  subtitle: string
  cta: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container text-primary">
        <span className="material-symbols-outlined text-[30px]">work</span>
      </span>
      <p className="mt-5 text-headline-md text-on-surface">{title}</p>
      <p className="mt-2 max-w-md text-body-md text-on-surface-variant">{subtitle}</p>
      <Link
        href="/dashboard/jobs/new"
        className="btn-press mt-6 rounded-full bg-primary px-8 py-3 text-label-md text-on-primary hover:opacity-90"
      >
        {cta}
      </Link>
    </div>
  )
}

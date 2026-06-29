import { getTranslations } from 'next-intl/server'
import { db } from '@/lib/db'
import type { ServiceCategory } from '@/types'
import {
  CategoriesScrollSection,
  type CategoryPanel,
} from './categories-scroll-section'

const CATEGORY_ORDER: ServiceCategory[] = [
  'PLUMBING',
  'CLEANING',
  'TEACHING',
  'DELIVERY',
  'DESIGN',
  'DIGITAL',
]

const DEFAULT_ICONS: Record<ServiceCategory, string> = {
  PLUMBING: 'plumbing',
  TEACHING: 'school',
  DELIVERY: 'local_shipping',
  CLEANING: 'cleaning_services',
  DESIGN: 'brush',
  DIGITAL: 'computer',
}

const CATEGORY_META: Record<string, { from: string; tag: string }> = {
  PLUMBING: { from: '$25/hr',     tag: 'Más solicitado' },
  CLEANING: { from: '$20/sesión', tag: 'Alta disponibilidad' },
  TEACHING: { from: '$15/hr',     tag: 'Clases en casa' },
  DELIVERY: { from: '$8/envío',   tag: 'Mismo día' },
  DESIGN:   { from: '$30/hr',     tag: 'Freelance' },
  DIGITAL:  { from: '$20/hr',     tag: 'Trabajo remoto' },
}

async function getCategories() {
  try {
    const jobs = await db.jobPost.findMany({
      where: { status: 'OPEN' },
      select: { category: true },
    })

    const counts = new Map<ServiceCategory, number>()
    for (const job of jobs) {
      const cat = job.category as ServiceCategory
      counts.set(cat, (counts.get(cat) ?? 0) + 1)
    }

    const active = CATEGORY_ORDER.filter((c) => counts.has(c))
    const toRender = CATEGORY_ORDER

    const configs = await db.categoryConfig.findMany({
      where: { category: { in: CATEGORY_ORDER } },
    })

    const iconMap = new Map(configs.map((c) => [c.category as ServiceCategory, c.icon]))

    return toRender.map((category) => ({
      category,
      icon: iconMap.get(category) ?? DEFAULT_ICONS[category],
      count: counts.get(category) ?? 0,
    }))
  } catch {
    return CATEGORY_ORDER.map((category) => ({
      category,
      icon: DEFAULT_ICONS[category],
      count: 0,
    }))
  }
}

export async function CategoriesSection() {
  const [raw, t] = await Promise.all([getCategories(), getTranslations('HomePage')])

  const categories: CategoryPanel[] = raw.map(({ category, icon, count }) => ({
    category,
    icon,
    count,
    countLabel: count > 0 ? t('categoryCount', { count }) : '',
    name: t(`serviceCategory.${category}`),
    hint: t(`categoryHint.${category}`),
    ...CATEGORY_META[category] ?? { from: '$15/hr', tag: '' },
  }))

  return (
    <CategoriesScrollSection
      categories={categories}
      seeAllLabel={t('seeAll')}
      viewJobsLabel={t('viewAllJobs')}
    />
  )
}

import type React from 'react'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Search, Wrench, GraduationCap, Truck, Sparkles, Palette, Monitor, Briefcase, SlidersHorizontal } from 'lucide-react'
import { JobCard } from '@/components/ui/job-card'
import type { ServiceCategory } from '@/types/index'

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  PLUMBING: 'Fontanería',
  TEACHING: 'Enseñanza',
  DELIVERY: 'Delivery',
  CLEANING: 'Limpieza',
  DESIGN:   'Diseño',
  DIGITAL:  'Digital',
}

const CATEGORY_ICONS_MAT: Record<ServiceCategory, string> = {
  PLUMBING: 'plumbing',
  TEACHING: 'school',
  DELIVERY: 'local_shipping',
  CLEANING: 'cleaning_services',
  DESIGN:   'palette',
  DIGITAL:  'computer',
}

const CATEGORY_ICONS_LUCIDE = {
  PLUMBING: Wrench,
  TEACHING: GraduationCap,
  DELIVERY: Truck,
  CLEANING: Sparkles,
  DESIGN:   Palette,
  DIGITAL:  Monitor,
} satisfies Record<ServiceCategory, (props: { className?: string }) => React.JSX.Element>

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ServiceCategory[]

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const { category, q } = await searchParams

  const validCategory = CATEGORIES.includes(category as ServiceCategory)
    ? (category as ServiceCategory)
    : undefined

  const searchQuery = q?.trim() || undefined

  const jobs = await db.jobPost.findMany({
    where: {
      status: 'OPEN',
      ...(validCategory ? { category: validCategory } : {}),
      ...(searchQuery
        ? {
            OR: [
              { title:       { contains: searchQuery, mode: 'insensitive' } },
              { description: { contains: searchQuery, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: {
      client: { select: { name: true } },
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  function catHref(cat?: ServiceCategory) {
    const params = new URLSearchParams()
    if (cat) params.set('category', cat)
    if (searchQuery) params.set('q', searchQuery)
    const qs = params.toString()
    return qs ? `/jobs?${qs}` : '/jobs'
  }

  return (
    <div>
      {/* Page header row */}
      <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Proyectos disponibles
          </h1>
          <p className="mt-0.5 text-sm text-gray-400">
            {jobs.length} trabajo{jobs.length !== 1 ? 's' : ''} abiertos en El Salvador
          </p>
        </div>

        {/* Search */}
        <form method="GET" action="/jobs" className="w-full md:w-72">
          {validCategory && <input type="hidden" name="category" value={validCategory} />}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              name="q"
              defaultValue={searchQuery}
              placeholder="Buscar trabajos…"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-20 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-200 focus:border-gray-400 focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-gray-700"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Filters row */}
      <div className="mb-8 flex items-center gap-2 border-b border-gray-100 pb-5">
        <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-gray-300" />
        <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <Link
            href={catHref()}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-medium transition-colors duration-200 ${
              !validCategory
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700'
            }`}
          >
            Todos
          </Link>
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS_LUCIDE[cat]
            const active = validCategory === cat
            return (
              <Link
                key={cat}
                href={catHref(cat)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-medium transition-colors duration-200 ${
                  active
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700'
                }`}
              >
                <Icon className="h-3 w-3" />
                {CATEGORY_LABELS[cat]}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Active filter info */}
      {(searchQuery || validCategory) && (
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <span>
            {jobs.length} resultado{jobs.length !== 1 ? 's' : ''}
            {searchQuery && <> para <strong className="text-gray-700">&ldquo;{searchQuery}&rdquo;</strong></>}
            {validCategory && <> en <strong className="text-gray-700">{CATEGORY_LABELS[validCategory]}</strong></>}
          </span>
          <span className="text-gray-200">·</span>
          <Link href="/jobs" className="text-blue-700 hover:underline">
            Limpiar filtros
          </Link>
        </div>
      )}

      {/* Grid */}
      {jobs.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
            <Briefcase className="h-7 w-7 text-gray-300" />
          </div>
          <p className="text-xl font-semibold text-gray-900">No hay proyectos disponibles</p>
          <p className="max-w-xs text-sm text-gray-400">
            Intenta con otra categoría o cambia los términos de búsqueda.
          </p>
          <Link
            href="/jobs"
            className="mt-2 rounded-full bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-800"
          >
            Ver todos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {jobs.map((job, i) => {
            const cat = job.category as ServiceCategory
            const daysLeft = Math.max(
              0,
              Math.ceil((new Date(job.deadline).getTime() - Date.now()) / 86_400_000),
            )
            return (
              <JobCard
                key={job.id}
                id={job.id}
                title={job.title}
                description={job.description}
                category={CATEGORY_LABELS[cat]}
                categoryKey={cat}
                categoryIcon={CATEGORY_ICONS_MAT[cat]}
                client={job.client.name ?? 'Cliente'}
                budget={`$${Number(job.budget).toFixed(0)}`}
                stats={[
                  { label: 'Presupuesto',    value: `$${Number(job.budget).toFixed(0)}` },
                  { label: 'Propuestas',     value: job._count.applications },
                  { label: 'Días restantes', value: daysLeft },
                ]}
                viewLabel="Ver trabajo"
                featured={i === 0}
                featuredLabel={i === 0 ? 'Destacado' : undefined}
                delayIndex={i}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

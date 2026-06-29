import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export type CategoryPanel = {
  category:   string
  icon:       string
  count:      number
  countLabel: string
  name:       string
  hint:       string
  from:       string
  tag:        string
}

type Props = {
  categories:    CategoryPanel[]
  seeAllLabel:   string
  viewJobsLabel: string
}

const CATEGORY_IMAGES: Record<string, string> = {
  PLUMBING: '/cat-plomero.jpg',
  CLEANING: '/cat-limpieza.jpg',
  TEACHING: '/cat-maestro.jpg',
  DELIVERY: '/servilocal-hero-delivery.png',
  DESIGN:   '/servilocal-workers-hero.png',
  DIGITAL:  '/servilocal-hero-digital.png',
}

export function CategoriesScrollSection({
  categories,
  seeAllLabel,
  viewJobsLabel,
}: Props) {
  const featured = categories.slice(0, 3)

  return (
    <section className="bg-white px-5 pb-20 pt-28 md:px-14 md:pb-24 md:pt-32">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Categorías
        </p>
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Encuentra el servicio que necesitas
        </h2>
      </div>

      {/* 3 cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {featured.map((cat) => {
          const img = CATEGORY_IMAGES[cat.category] ?? '/servilocal-workers-hero.png'
          return (
            <Link
              key={cat.category}
              href={`/jobs?category=${cat.category}`}
              className="group relative aspect-3/4 overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/15"
            >
              {/* Full-bleed image with soft filter */}
              <Image
                src={img}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover brightness-90 saturate-[0.88] transition-transform duration-500 group-hover:scale-105"
              />
              {/* Warm soft overlay */}
              <div className="absolute inset-0 bg-white/5 mix-blend-soft-light" />

              {/* Badges row — aligned top, same height */}
              <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/35 backdrop-blur-md">
                  <span
                    className="material-symbols-outlined text-[20px] text-white"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {cat.icon}
                  </span>
                </div>
                <div className="flex h-10 items-center rounded-full bg-black/35 px-4 backdrop-blur-md">
                  <span className="text-[0.65rem] font-semibold text-white/90">
                    Desde {cat.from}
                  </span>
                </div>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />

              {/* Text — bottom */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
                <span className="mb-2 inline-block rounded-full bg-primary/80 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white">
                  {cat.tag}
                </span>
                <h3 className="text-xl font-bold leading-tight text-white">
                  {cat.name}
                </h3>
                <p className="mt-1 text-sm text-white/60">
                  {cat.hint}
                </p>
                {cat.countLabel && (
                  <p className="mt-1.5 text-xs text-white/45">{cat.countLabel}</p>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Ver más button */}
      <div className="mt-10 flex justify-center">
        <Link
          href="/jobs"
          className="group inline-flex items-center gap-2 rounded-full border border-primary bg-primary px-7 py-3 text-sm font-semibold text-white transition-colors duration-300 ease-out hover:bg-white hover:text-primary active:scale-[0.97]"
        >
          {seeAllLabel}
          <span className="relative inline-flex h-4 w-4 overflow-hidden">
            <ArrowRight className="absolute h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-[200%]" />
            <ArrowRight className="absolute h-4 w-4 translate-x-[-200%] transition-transform duration-300 ease-out group-hover:translate-x-0" />
          </span>
        </Link>
      </div>
    </section>
  )
}

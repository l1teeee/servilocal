'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface JobStat {
  label: string
  value: string | number
}

export interface JobCardProps {
  id: string
  title: string
  description: string
  category: string
  categoryKey: string
  categoryIcon: string
  client: string
  budget: string
  stats: JobStat[]
  viewLabel: string
  featured?: boolean
  featuredLabel?: string
  className?: string
  delayIndex?: number
}

export function JobCard({
  id,
  title,
  description,
  category,
  categoryIcon,
  client,
  budget,
  stats,
  viewLabel,
  featuredLabel,
  className,
  delayIndex = 0,
}: JobCardProps) {
  return (
    <motion.article
      className={cn(
        'relative flex w-full flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm',
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: delayIndex * 0.1, ease: 'easeOut' }}
    >
      {/* Featured badge — top-right corner */}
      {featuredLabel && (
        <span className="absolute right-5 top-5 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-wide text-blue-700">
          {featuredLabel}
        </span>
      )}

      {/* Header: icon + name + handle */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100">
          <span
            className="material-symbols-outlined text-[24px] text-gray-500"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {categoryIcon}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold leading-snug text-gray-900">{title}</h3>
          <p className="mt-0.5 text-sm text-gray-400">{category}</p>
        </div>
      </div>

      {/* Bio / description */}
      <p className="grow text-sm leading-relaxed text-gray-500 line-clamp-3">{description}</p>

      {/* Stats row — ProfileCard style with dividers */}
      {stats.length > 0 && (
        <div className="flex items-stretch justify-between border-t border-b border-gray-100 py-4 text-center">
          {stats.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div className="w-px self-stretch bg-gray-100" />}
              <div className="flex flex-1 flex-col items-center px-1">
                <span className="text-sm font-bold text-gray-900">{s.value}</span>
                <span className="mt-0.5 text-[0.6rem] uppercase tracking-wider text-gray-400">
                  {s.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Footer: client + CTA */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-gray-400">{client}</p>
        <Link
          href={`/jobs/${id}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-blue-700 hover:text-blue-700"
        >
          {viewLabel}
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'wght' 200" }}>arrow_forward</span>
        </Link>
      </div>
    </motion.article>
  )
}

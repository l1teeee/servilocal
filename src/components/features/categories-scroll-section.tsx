'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
  categories:   CategoryPanel[]
  seeAllLabel:  string
  viewJobsLabel: string
}

export function CategoriesScrollSection({
  categories,
  seeAllLabel,
  viewJobsLabel,
}: Props) {
  const outerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const track = trackRef.current!

      const mainTween = gsap.to(track, {
        x:    () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
      })

      ScrollTrigger.create({
        id:                  'cat-main',
        animation:           mainTween,
        trigger:             outerRef.current,
        pin:                 true,
        scrub:               0.9,
        start:               'top top',
        end:                 () => `+=${track.scrollWidth - window.innerWidth}`,
        invalidateOnRefresh: true,
      })
    }, outerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={outerRef} className="relative h-screen w-full overflow-hidden">
      <div
        ref={trackRef}
        className="flex h-full will-change-transform"
        style={{ width: `${categories.length * 100}vw` }}
      >
        {categories.map((cat, i) => (
          <div
            key={cat.category}
            className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-primary"
          >
            {/* Subtle vertical grid — same as hero */}
            <div className="pointer-events-none absolute inset-0 z-10">
              <div className="grid h-full w-full grid-cols-12 divide-x divide-white/[0.04]">
                {Array.from({ length: 12 }).map((_, c) => (
                  <div key={c} />
                ))}
              </div>
            </div>

            {/* Top bar */}
            <div className="absolute left-0 right-0 top-8 z-20 flex items-center justify-between px-8">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/40">
                {String(i + 1).padStart(2, '0')}&ensp;/&ensp;{String(categories.length).padStart(2, '0')}
              </p>
              <Link
                href="/jobs"
                className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-white/70"
              >
                {seeAllLabel} →
              </Link>
            </div>

            {/* Content */}
            <div className="relative z-20 mx-auto w-full max-w-2xl px-6 text-center">
              {/* Icon */}
              <span
                className="material-symbols-outlined mb-6 block text-[72px] text-white/75"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {cat.icon}
              </span>

              {/* Tag badge */}
              <span className="mb-6 inline-block rounded-full bg-white/15 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/70">
                {cat.tag}
              </span>

              {/* Name */}
              <h2 className="text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl">
                {cat.name}
              </h2>

              {/* Hint + price */}
              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/55 sm:text-lg">
                {cat.hint}&ensp;·&ensp;Desde {cat.from}
              </p>

              {/* CTA */}
              <div className="mt-10 flex items-center justify-center gap-4">
                {cat.countLabel && (
                  <span className="text-sm text-white/35">
                    {cat.countLabel}
                  </span>
                )}
                <Link
                  href={`/jobs?category=${cat.category}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary transition-opacity hover:opacity-90"
                >
                  {viewJobsLabel}
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Progress dots */}
            <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
              {categories.map((_, j) => (
                <span
                  key={j}
                  className={`rounded-full transition-all ${
                    j === i
                      ? 'h-[3px] w-7 bg-white/70'
                      : 'h-[3px] w-3 bg-white/25'
                  }`}
                />
              ))}
            </div>

            {i === 0 && (
              <p className="absolute bottom-[2.6rem] right-8 z-20 text-[0.65rem] font-medium uppercase tracking-widest text-white/30">
                scroll →
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type Step = {
  title: string
  desc:  string
  image: string
}

type Props = {
  steps:   Step[]
  eyebrow: string
}

export function HowItWorksScroll({ steps, eyebrow }: Props) {
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
        id:                  'hiw-main',
        animation:           mainTween,
        trigger:             outerRef.current,
        pin:                 true,
        scrub:               0.9,
        start:               'top top',
        end:                 () => `+=${track.scrollWidth - window.innerWidth}`,
        invalidateOnRefresh: true,
        onEnter:     () => window.dispatchEvent(new CustomEvent('hiw:enter')),
        onLeave:     () => window.dispatchEvent(new CustomEvent('hiw:leave')),
        onEnterBack: () => window.dispatchEvent(new CustomEvent('hiw:enter')),
        onLeaveBack: () => window.dispatchEvent(new CustomEvent('hiw:leave')),
      })
    }, outerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={outerRef} className="relative h-screen w-full overflow-hidden">
      <div
        ref={trackRef}
        className="flex h-full will-change-transform"
        style={{ width: `${steps.length * 100}vw` }}
      >
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="hiw-panel relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden"
          >
            {/* Background image */}
            <Image
              src={step.image}
              alt=""
              fill
              className="object-cover object-center"
              priority={i === 0}
              sizes="100vw"
            />

            {/* Dark overlay — same pattern as hero */}
            <div className="absolute inset-0 bg-black/62" />

            {/* Subtle vertical grid — same as hero */}
            <div className="pointer-events-none absolute inset-0 z-10">
              <div className="grid h-full w-full grid-cols-12 divide-x divide-white/[0.04]">
                {Array.from({ length: 12 }).map((_, c) => <div key={c} />)}
              </div>
            </div>

            {/* Content */}
            <div className="relative z-20 mx-auto w-full max-w-2xl px-6 text-center">
              {/* Step counter */}
              <p className="mb-5 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/40">
                {eyebrow}&ensp;{String(i + 1).padStart(2, '0')}&ensp;/&ensp;{String(steps.length).padStart(2, '0')}
              </p>

              {/* Title */}
              <h2 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
                {step.title}
              </h2>

              {/* Description */}
              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
                {step.desc}
              </p>
            </div>

            {/* Progress dots */}
            <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
              {steps.map((_, j) => (
                <span
                  key={j}
                  className={`rounded-full ${
                    j === i
                      ? 'h-[3px] w-7 bg-white/70'
                      : 'h-[3px] w-3 bg-white/25'
                  }`}
                />
              ))}
            </div>

            {i === 0 && (
              <p className="absolute bottom-[2.6rem] right-8 z-20 text-[0.65rem] font-medium tracking-widest text-white/30 uppercase">
                scroll →
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

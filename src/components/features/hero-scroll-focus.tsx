'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

type HeroScrollFocusProps = {
  children: ReactNode
  className?: string
}

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

function smoothstep(value: number) {
  const progress = clamp(value)
  return progress * progress * (3 - 2 * progress)
}

function setFocusProgress(element: HTMLElement, progress: number) {
  const eased = smoothstep(progress)

  element.style.setProperty('--hero-focus-blur', `${(eased * 32).toFixed(2)}px`)
  element.style.setProperty('--hero-focus-opacity', `${(1 - eased * 0.98).toFixed(3)}`)
  element.style.setProperty('--hero-focus-veil', `${(eased * 0.94).toFixed(3)}`)
}

export function HeroScrollFocus({ children, className = '' }: HeroScrollFocusProps) {
  const heroRef = useRef<HTMLElement | null>(null)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    const element = heroRef.current
    if (!element) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frameId: number | null = null
    let viewportListenersBound = false

    const cancelFrame = () => {
      if (frameId === null) return
      window.cancelAnimationFrame(frameId)
      frameId = null
    }

    const update = () => {
      frameId = null

      if (motionQuery.matches) {
        setFocusProgress(element, 0)
        return
      }

      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollYRef.current) {
        element.dataset.scrollDirection = 'down'
      } else if (currentScrollY < lastScrollYRef.current) {
        element.dataset.scrollDirection = 'up'
      }
      lastScrollYRef.current = currentScrollY

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1
      const rect = element.getBoundingClientRect()
      const visibleRatio = clamp(rect.bottom / viewportHeight)
      const fadeStartVisibleRatio = 0.08
      const fadeEndVisibleRatio = 0.05

      setFocusProgress(
        element,
        (fadeStartVisibleRatio - visibleRatio) /
          Math.max(0.01, fadeStartVisibleRatio - fadeEndVisibleRatio)
      )
    }

    const scheduleUpdate = () => {
      if (frameId !== null) return
      frameId = window.requestAnimationFrame(update)
    }

    const bindViewportListeners = () => {
      if (viewportListenersBound || motionQuery.matches) return
      window.addEventListener('scroll', scheduleUpdate, { passive: true })
      window.addEventListener('resize', scheduleUpdate)
      viewportListenersBound = true
    }

    const unbindViewportListeners = () => {
      if (!viewportListenersBound) return
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      viewportListenersBound = false
      cancelFrame()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (motionQuery.matches) {
          setFocusProgress(element, 0)
          return
        }

        if (entry.isIntersecting) {
          bindViewportListeners()
          scheduleUpdate()
          return
        }

        unbindViewportListeners()

        const rect = element.getBoundingClientRect()
        setFocusProgress(element, rect.bottom <= 0 ? 1 : 0)
      },
      { threshold: 0 }
    )

    const handleMotionChange = () => {
      if (motionQuery.matches) {
        unbindViewportListeners()
        setFocusProgress(element, 0)
        return
      }

      bindViewportListeners()
      scheduleUpdate()
    }

    lastScrollYRef.current = window.scrollY
    observer.observe(element)
    handleMotionChange()

    motionQuery.addEventListener('change', handleMotionChange)

    return () => {
      observer.disconnect()
      motionQuery.removeEventListener('change', handleMotionChange)
      unbindViewportListeners()
      cancelFrame()
    }
  }, [])

  return (
    <section
      ref={heroRef}
      className={['hero-scroll-focus', className].filter(Boolean).join(' ')}
      style={
        {
          '--hero-focus-blur': '0px',
          '--hero-focus-opacity': '1',
          '--hero-focus-veil': '0',
        } as CSSProperties
      }
    >
      {children}
      <div
        className="hero-scroll-focus__veil pointer-events-none absolute inset-0 z-30 bg-white"
        aria-hidden="true"
      />
    </section>
  )
}

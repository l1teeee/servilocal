'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const EASE_OUT = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
const EASE_IN  = 'cubic-bezier(0.55, 0, 1, 0.45)'

export function PageTransition() {
  const pathname = usePathname()
  const router   = useRouter()

  // Animate IN on every route arrival
  useEffect(() => {
    document.documentElement.animate(
      [
        { opacity: '0', transform: 'translateY(8px)' },
        { opacity: '1', transform: 'translateY(0)' },
      ],
      { duration: 280, easing: EASE_OUT, fill: 'backwards' },
    )
  }, [pathname])

  // Intercept all anchor clicks — animate OUT, then navigate
  useEffect(() => {
    function onAnchorClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]')
      if (!anchor) return
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      if (anchor.target && anchor.target !== '_self') return

      let href: string
      try {
        const url = new URL(anchor.href, location.href)
        if (url.origin !== location.origin) return
        if (url.pathname === location.pathname && url.search === location.search) return
        href = url.pathname + url.search + url.hash
      } catch {
        return
      }

      e.preventDefault()

      const anim = document.documentElement.animate(
        [
          { opacity: '1', transform: 'translateY(0)' },
          { opacity: '0', transform: 'translateY(-6px)' },
        ],
        { duration: 150, easing: EASE_IN, fill: 'forwards' },
      )

      anim.onfinish = () => router.push(href)
    }

    document.addEventListener('click', onAnchorClick)
    return () => document.removeEventListener('click', onAnchorClick)
  }, [router])

  return null
}

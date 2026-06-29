'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function PageTransition() {
  const pathname = usePathname()

  useEffect(() => {
    document.documentElement.animate(
      [
        { opacity: '0', transform: 'translateY(10px)' },
        { opacity: '1', transform: 'translateY(0)' },
      ],
      {
        duration: 320,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'backwards',
      },
    )
  }, [pathname])

  return null
}

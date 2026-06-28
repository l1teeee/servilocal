'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const VIDEOS = ['/work1.mp4', '/work2.mp4', '/work3.mp4', '/work4.mp4']
const FADE_MS = 1200

export function HeroVideoBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [current, setCurrent] = useState(0)
  const currentRef = useRef(0)
  const visibleRef = useRef(false)
  const lockRef = useRef(false)

  // Keep currentRef in sync for use inside event handlers (avoids stale closures)
  useEffect(() => {
    currentRef.current = current
  })

  // Pause / resume all videos based on viewport visibility
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
        if (entry.isIntersecting) {
          videoRefs.current[currentRef.current]?.play().catch(() => {})
        } else {
          videoRefs.current.forEach(v => v?.pause())
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Advance to the next video
  const advance = useCallback(() => {
    if (lockRef.current) return
    lockRef.current = true
    setCurrent(c => (c + 1) % VIDEOS.length)
  }, [])

  // When the active index changes: freeze inactive videos, play the new one,
  // release the transition lock after the crossfade completes
  useEffect(() => {
    // Freeze all videos except the incoming one (last frame shows during fade-out)
    videoRefs.current.forEach((v, i) => {
      if (i !== current) v?.pause()
    })

    // Start the new video from the beginning
    const v = videoRefs.current[current]
    if (v) {
      v.currentTime = 0
      if (visibleRef.current) v.play().catch(() => {})
    }

    const timer = setTimeout(() => {
      lockRef.current = false
    }, FADE_MS)

    return () => clearTimeout(timer)
  }, [current])

  return (
    <div ref={containerRef} className="absolute inset-0" aria-hidden="true">
      {VIDEOS.map((src, i) => (
        <video
          key={src}
          ref={el => { videoRefs.current[i] = el }}
          src={src}
          muted
          playsInline
          preload={i === 0 ? 'auto' : 'metadata'}
          onEnded={() => {
            if (i === currentRef.current) advance()
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDuration: `${FADE_MS}ms` }}
        />
      ))}
    </div>
  )
}

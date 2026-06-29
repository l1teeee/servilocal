import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { HeroVideoBackground } from '@/components/features/hero-video-background'

interface AuthShellProps {
  children: React.ReactNode
  videoSide: 'left' | 'right'
}

export function AuthShell({ children, videoSide }: AuthShellProps) {
  const formPanel = (
    <div className="relative flex w-full flex-col justify-center px-8 py-12 md:w-[46%] md:px-16">
      <div className="absolute left-6 top-6">
        <Link
          href="/"
          aria-label="Volver al inicio"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors duration-200 hover:border-gray-900 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
      <div className="mx-auto w-full max-w-sm">{children}</div>
    </div>
  )

  const videoPanel = (
    <div className="hidden items-center justify-center bg-white p-4 md:flex md:flex-1">
      <div className="relative h-full w-full overflow-hidden rounded-2xl">
        <HeroVideoBackground />
        <div className="absolute inset-0 bg-black/55" />
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen">
      {videoSide === 'left' ? (
        <>
          {videoPanel}
          {formPanel}
        </>
      ) : (
        <>
          {formPanel}
          {videoPanel}
        </>
      )}
    </div>
  )
}

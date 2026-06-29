import Link from 'next/link'
import { SiteFooter } from '@/components/features/site-footer'
import { BottomNav } from '@/components/features/bottom-nav'

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 md:px-10">
          <Link href="/" className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1", color: '#1d4ed8' }}
            >
              handshake
            </span>
            <span className="text-sm font-bold tracking-tight" style={{ color: '#1d4ed8' }}>ServiLocal</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/jobs/new"
              className="hidden rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:border-gray-900 hover:text-gray-900 sm:inline-flex"
            >
              Publicar trabajo
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary/85"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 md:px-10">
        {children}
      </main>

      <SiteFooter />
      <BottomNav />
    </div>
  )
}

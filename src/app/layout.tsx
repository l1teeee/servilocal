import type { Metadata } from 'next'
import { Montserrat, Plus_Jakarta_Sans } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { JsonLd } from '@/components/features/json-ld'
import './globals.css'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://servilocal.vercel.app'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'ServiLocal — Servicios locales de confianza en El Salvador',
    template: '%s | ServiLocal',
  },
  description:
    'Contrata plomeros, limpiadores, profesores, delivery y freelancers en El Salvador. Pagos protegidos con Tkiero. Rápido, seguro y local.',
  keywords: [
    'servicios locales El Salvador',
    'plomero El Salvador',
    'limpieza del hogar El Salvador',
    'clases particulares El Salvador',
    'delivery El Salvador',
    'diseñador freelance El Salvador',
    'trabajadores locales El Salvador',
    'contratar servicios El Salvador',
    'marketplace servicios El Salvador',
    'Tkiero pagos',
    'freelancer El Salvador',
    'trabajo local El Salvador',
  ],
  authors: [{ name: 'ServiLocal', url: BASE_URL }],
  creator: 'ServiLocal',
  publisher: 'ServiLocal',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_SV',
    url: BASE_URL,
    siteName: 'ServiLocal',
    title: 'ServiLocal — Servicios locales de confianza en El Salvador',
    description:
      'Contrata plomeros, limpiadores, profesores, delivery y freelancers en El Salvador. Pagos protegidos con Tkiero.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ServiLocal — Marketplace de servicios locales en El Salvador',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ServiLocal — Servicios locales de confianza en El Salvador',
    description:
      'Contrata plomeros, limpiadores, profesores, delivery y freelancers en El Salvador.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: 'marketplace',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${montserrat.variable} ${jakarta.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-background text-on-background font-sans antialiased">
        <JsonLd />
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ServiLocal — Servicios locales en El Salvador',
    short_name: 'ServiLocal',
    description:
      'Marketplace de servicios locales en El Salvador. Plomeros, limpieza, profesores, delivery y más.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b1120',
    theme_color: '#1d4ed8',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://servilocal.vercel.app'

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ServiLocal',
    url: BASE,
    logo: `${BASE}/logo.png`,
    description:
      'ServiLocal es un marketplace de servicios locales en El Salvador. Conecta clientes con plomeros, limpiadores, profesores, repartidores, diseñadores y freelancers digitales. Los pagos se realizan con Tkiero, una criptomoneda local que protege tanto al cliente como al proveedor.',
    areaServed: { '@type': 'Country', name: 'El Salvador' },
    foundingLocation: { '@type': 'Country', name: 'El Salvador' },
    knowsAbout: [
      'Servicios del hogar',
      'Plomería',
      'Limpieza del hogar',
      'Clases particulares',
      'Delivery',
      'Diseño gráfico',
      'Servicios digitales',
      'Tkiero',
      'Criptomonedas El Salvador',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ServiLocal',
    url: BASE,
    inLanguage: 'es',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE}/jobs?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Qué es ServiLocal?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ServiLocal es un marketplace de servicios locales en El Salvador. Permite a los clientes contratar plomeros, limpiadores, profesores particulares, repartidores, diseñadores gráficos y freelancers digitales de manera segura. Los pagos se realizan con Tkiero, una criptomoneda local.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cómo funciona el pago en ServiLocal?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ServiLocal utiliza Tkiero para los pagos. El cliente deposita el pago al contratar el servicio. Los fondos quedan retenidos de forma segura hasta que el trabajo se completa y el cliente lo confirma. Solo entonces el dinero se transfiere al proveedor, garantizando protección para ambas partes.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Qué servicios se pueden contratar en ServiLocal?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'En ServiLocal puedes contratar: plomeros y servicios de plomería, servicios de limpieza del hogar, profesores particulares y clases a domicilio, delivery y mensajería, diseñadores gráficos y creativos, y servicios digitales como programación y marketing digital.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Es seguro contratar servicios en ServiLocal?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, ServiLocal es seguro. Los pagos quedan retenidos con Tkiero hasta completar el trabajo. Todos los proveedores tienen perfil verificado con calificaciones de clientes anteriores. La plataforma cobra una pequeña comisión solo cuando el servicio se completa exitosamente.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cómo puedo ofrecer mis servicios en ServiLocal?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Para ofrecer servicios en ServiLocal: regístrate como proveedor, completa tu perfil con tu especialidad, experiencia y tarifas, y empieza a recibir solicitudes de clientes en El Salvador. La plataforma es gratuita para publicar tu perfil.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Qué es Tkiero?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tkiero es una criptomoneda local de El Salvador utilizada en ServiLocal para los pagos entre clientes y proveedores de servicios. Permite transacciones seguras, rápidas y sin intermediarios bancarios tradicionales.',
        },
      },
    ],
  },
]

export function JsonLd() {
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}

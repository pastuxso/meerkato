import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Minimarket Meerkato - Compra en línea',
    template: '%s | Minimarket Meerkato',
  },
  description: 'Tu minimarket de confianza. Compra en línea y recibe en casa.',
  keywords: ['minimarket', 'tienda', 'domicilio', 'Bogotá', 'abarrotes'],
  authors: [{ name: 'Minimarket Meerkato' }],
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://meerkato.co',
    siteName: 'Minimarket Meerkato',
    title: 'Minimarket Meerkato - Compra en línea',
    description: 'Tu minimarket de confianza. Compra en línea y recibe en casa.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Minimarket Meerkato',
    description: 'Tu minimarket de confianza. Compra en línea y recibe en casa.',
  },
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
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  )
}
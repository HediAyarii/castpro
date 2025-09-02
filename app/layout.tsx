import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { generateStructuredData } from "./structured-data"
import { ClientLayoutWrapper } from "@/components/client-layout-wrapper"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: {
    default: "CastPro - Agence de Casting Professionnelle",
    template: "%s | CastPro"
  },
  description: "CastPro - Votre partenaire pour tous vos besoins de casting cinématographique et télévisuel. Découvrez nos talents et services de casting professionnel.",
  keywords: ["casting", "agence casting", "cinéma", "télévision", "acteurs", "talents", "production"],
  authors: [{ name: "CastPro" }],
  creator: "CastPro",
  publisher: "CastPro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://castprov29.vercel.app'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/favicon-48x48.svg', sizes: '48x48', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://castprov29.vercel.app',
    title: 'CastPro - Agence de Casting Professionnelle',
    description: 'CastPro - Votre partenaire pour tous vos besoins de casting cinématographique et télévisuel',
    siteName: 'CastPro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CastPro - Agence de Casting Professionnelle',
    description: 'CastPro - Votre partenaire pour tous vos besoins de casting cinématographique et télévisuel',
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
    google: 'your-google-verification-code', // Remplacez par votre code de vérification Google
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/svg+xml" sizes="16x16" href="/favicon-16x16.svg" />
        <link rel="icon" type="image/svg+xml" sizes="48x48" href="/favicon-48x48.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData()),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
        <Toaster />
      </body>
    </html>
  )
}

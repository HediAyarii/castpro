import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { generateStructuredData } from "./structured-data"

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
    icon: '/images/castpro.png',
    shortcut: '/images/castpro.png',
    apple: '/images/castpro.png',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData()),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}

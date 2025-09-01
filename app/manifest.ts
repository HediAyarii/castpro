import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CastPro - Agence de Casting Professionnelle',
    short_name: 'CastPro',
    description: 'Votre partenaire pour tous vos besoins de casting cinématographique et télévisuel',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/images/castpro.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/images/castpro.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/castpro.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}


export const generateStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CastPro',
    alternateName: 'CastPro - Agence de Casting Professionnelle',
    url: 'https://castprov29.vercel.app',
    logo: 'https://castprov29.vercel.app/placeholder-logo.png',
    description: 'Votre partenaire pour tous vos besoins de casting cinématographique et télévisuel',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'French',
    },
    sameAs: [
      // Ajoutez vos réseaux sociaux ici
      // 'https://www.facebook.com/castpro',
      // 'https://www.instagram.com/castpro',
      // 'https://www.linkedin.com/company/castpro',
    ],
    serviceType: [
      'Casting Cinématographique',
      'Casting Télévisuel',
      'Recrutement d\'Acteurs',
      'Gestion de Talents',
    ],
  }
}

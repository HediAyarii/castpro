/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour servir les images dynamiques
  serverExternalPackages: ['pg'],
  
  // Configuration des images
  images: {
    // Permettre les images externes
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
    // Permettre les images locales
    unoptimized: true,
  },
  
  // Configuration des assets statiques
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/i,
      type: 'asset/resource',
    });
    return config;
  },
  
  // Configuration des headers pour servir les images
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Configuration pour servir les fichiers statiques
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/serve-image/:path*',
      },
    ];
  },
};

export default nextConfig;

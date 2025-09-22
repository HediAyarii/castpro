# 🚀 OPTIMISATION - Images lentes sur VPS

## 🔍 **Causes identifiées du chargement lent**

### 1. **Configuration Docker incorrecte**
```yaml
# PROBLÈME dans docker-compose.yml
volumes:
  - ./uploads:/app/uploads  # ❌ Mauvais chemin
```

### 2. **API de service d'images non optimisée**
- Lecture synchrone des fichiers
- Pas de compression
- Pas de cache efficace
- Pas de streaming

### 3. **Configuration Next.js en production**
- `unoptimized: true` désactive l'optimisation
- Pas de CDN configuré
- Headers de cache insuffisants

## 🛠️ **Solutions à implémenter**

### **Solution 1: Corriger la configuration Docker**

```yaml
# docker-compose.yml - CORRECTION
services:
  app:
    volumes:
      - ./public/uploads:/app/public/uploads  # ✅ Bon chemin
      - ./public:/app/public                  # ✅ Dossier public complet
```

### **Solution 2: Optimiser l'API de service d'images**

```typescript
// app/api/serve-image/[...path]/route.ts - VERSION OPTIMISÉE
import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const filePath = join(process.cwd(), 'public', 'uploads', ...path);
    
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 });
    }
    
    // Vérifier les paramètres de requête pour l'optimisation
    const url = new URL(request.url);
    const width = url.searchParams.get('w');
    const quality = url.searchParams.get('q') || '85';
    
    let optimizedBuffer: Buffer;
    let contentType = 'image/jpeg';
    
    if (width || quality !== '85') {
      // Optimiser avec Sharp
      const image = sharp(filePath);
      
      if (width) {
        image.resize(parseInt(width), null, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }
      
      optimizedBuffer = await image
        .jpeg({ quality: parseInt(quality) })
        .toBuffer();
    } else {
      // Lire le fichier original
      optimizedBuffer = await readFile(filePath);
      const ext = path[path.length - 1].split('.').pop()?.toLowerCase();
      
      switch (ext) {
        case 'png': contentType = 'image/png'; break;
        case 'webp': contentType = 'image/webp'; break;
        case 'gif': contentType = 'image/gif'; break;
        default: contentType = 'image/jpeg';
      }
    }
    
    return new Response(optimizedBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': optimizedBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'ETag': `"${Buffer.from(filePath).toString('base64')}"`,
        'Access-Control-Allow-Origin': '*',
      },
    });
    
  } catch (error) {
    console.error('Erreur serve-image:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
```

### **Solution 3: Configuration Next.js optimisée**

```javascript
// next.config.mjs - VERSION OPTIMISÉE
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['pg'],
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
    // ✅ Activer l'optimisation en production
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 an
  },
  
  // ✅ Headers de cache optimisés
  async headers() {
    return [
      {
        source: '/api/serve-image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Vary',
            value: 'Accept',
          },
        ],
      },
    ];
  },
  
  // ✅ Compression gzip
  compress: true,
};

export default nextConfig;
```

### **Solution 4: Configuration Nginx (Recommandé)**

```nginx
# nginx.conf - Configuration optimisée
server {
    listen 80;
    server_name votre-domaine.com;
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types image/jpeg image/png image/webp text/css application/javascript;
    
    # Cache des images
    location /api/serve-image/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        proxy_cache_key "$scheme$request_method$host$request_uri";
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    
    # Proxy vers l'application Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🚀 **Actions immédiates à effectuer**

### **1. Sur votre VPS, exécutez le diagnostic :**
```bash
chmod +x scripts/diagnose-vps-images.sh
./scripts/diagnose-vps-images.sh
```

### **2. Corrigez la configuration Docker :**
```bash
# Arrêter les conteneurs
docker-compose down

# Modifier docker-compose.yml (voir Solution 1)
# Puis redémarrer
docker-compose up -d
```

### **3. Testez les performances :**
```bash
# Test de chargement d'image
curl -w "@-" -o /dev/null -s "http://localhost:3000/api/serve-image/test.jpg" <<< "
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
"
```

## 📊 **Métriques à surveiller**

### **Temps de chargement acceptables :**
- **< 200ms** : Excellent
- **200-500ms** : Bon
- **500ms-1s** : Acceptable
- **> 1s** : Problématique

### **Taille des images :**
- **< 100KB** : Excellent
- **100-500KB** : Bon
- **500KB-1MB** : Acceptable
- **> 1MB** : Problématique

## 🎯 **Optimisations avancées**

### **1. CDN (Cloudflare)**
- Configuration automatique
- Cache global
- Compression automatique
- Réduction de 60-80% du temps de chargement

### **2. Cache Redis**
```javascript
// Cache des images optimisées
const redis = require('redis');
const client = redis.createClient();

// Cache des images avec TTL
await client.setex(`image:${filename}:${width}:${quality}`, 86400, buffer);
```

### **3. Compression WebP automatique**
```javascript
// Conversion automatique en WebP
const webpBuffer = await sharp(filePath)
  .webp({ quality: 85 })
  .toBuffer();
```

## 🔧 **Commandes de maintenance**

```bash
# Nettoyer le cache Docker
docker system prune -a

# Vérifier l'espace disque
df -h

# Monitorer les performances
htop
iostat -x 1

# Logs en temps réel
docker logs -f castprov29-app-1
```

---

## ✅ **Résultats attendus après optimisation**

- **Temps de chargement** : Réduction de 70-80%
- **Taille des images** : Réduction de 50-60%
- **Charge serveur** : Réduction de 60-70%
- **Expérience utilisateur** : Amélioration significative

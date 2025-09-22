import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';

// Cache en mémoire pour les images optimisées
const imageCache = new Map<string, { buffer: Buffer; contentType: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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
    
    // Vérifier la sécurité du chemin
    const normalizedPath = filePath.replace(/\\/g, '/');
    if (!normalizedPath.includes('/public/uploads/')) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }
    
    // Récupérer les paramètres d'optimisation
    const url = new URL(request.url);
    const width = url.searchParams.get('w');
    const quality = url.searchParams.get('q') || '85';
    const format = url.searchParams.get('f') || 'auto';
    
    // Clé de cache
    const cacheKey = `${path.join('/')}_${width || 'original'}_${quality}_${format}`;
    
    // Vérifier le cache
    const cached = imageCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      return new Response(Buffer.from(cached.buffer), {
        status: 200,
        headers: {
          'Content-Type': cached.contentType,
          'Content-Length': cached.buffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
          'X-Cache': 'HIT',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    // Lire le fichier original
    const originalBuffer = await readFile(filePath);
    const fileStats = await stat(filePath);
    
    let optimizedBuffer: Buffer;
    let contentType = 'image/jpeg';
    
    // Optimiser avec Sharp si nécessaire
    if (width || quality !== '85' || format !== 'auto') {
      try {
        const image = sharp(originalBuffer);
        
        // Redimensionner si demandé
        if (width) {
          image.resize(parseInt(width), null, {
            fit: 'inside',
            withoutEnlargement: true
          });
        }
        
        // Optimiser selon le format
        if (format === 'webp') {
          optimizedBuffer = await image.webp({ quality: parseInt(quality) }).toBuffer();
          contentType = 'image/webp';
        } else if (format === 'avif') {
          optimizedBuffer = await image.avif({ quality: parseInt(quality) }).toBuffer();
          contentType = 'image/avif';
        } else {
          optimizedBuffer = await image.jpeg({ quality: parseInt(quality) }).toBuffer();
          contentType = 'image/jpeg';
        }
      } catch (sharpError) {
        console.warn('Erreur Sharp, utilisation du fichier original:', sharpError);
        optimizedBuffer = originalBuffer;
        contentType = 'image/jpeg';
      }
    } else {
      // Utiliser le fichier original
      optimizedBuffer = originalBuffer;
      const ext = path[path.length - 1].split('.').pop()?.toLowerCase();
      switch (ext) {
        case 'png': contentType = 'image/png'; break;
        case 'webp': contentType = 'image/webp'; break;
        case 'gif': contentType = 'image/gif'; break;
        default: contentType = 'image/jpeg';
      }
    }
    
    // Mettre en cache
    imageCache.set(cacheKey, {
      buffer: optimizedBuffer,
      contentType,
      timestamp: Date.now()
    });
    
    // Nettoyer le cache si trop volumineux
    if (imageCache.size > 100) {
      const oldestKey = imageCache.keys().next().value;
      if (oldestKey) {
        imageCache.delete(oldestKey);
      }
    }
    
    return new Response(Buffer.from(optimizedBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': optimizedBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'ETag': `"${Buffer.from(filePath).toString('base64')}"`,
        'X-Cache': 'MISS',
        'Access-Control-Allow-Origin': '*',
      },
    });
    
  } catch (error) {
    console.error('Erreur serve-image optimisé:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

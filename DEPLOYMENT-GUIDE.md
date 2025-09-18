# Guide de déploiement Vercel + Base de données externe

## 1. Préparer la base de données externe

### Option A: Neon (Recommandé - Gratuit)
1. Aller sur https://neon.tech
2. Créer un compte et un nouveau projet
3. Copier la connection string (DATABASE_URL)

### Option B: Supabase
1. Aller sur https://supabase.com
2. Créer un nouveau projet
3. Aller dans Settings > Database
4. Copier la connection string

## 2. Configurer Vercel

### Variables d'environnement à ajouter dans Vercel:
```
DATABASE_URL=postgresql://username:password@host:port/database_name
JWT_SECRET=your-super-secure-jwt-secret-key
UPLOAD_SECRET=your-super-secure-upload-secret-key
NODE_ENV=production
```

### Commandes de déploiement:
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer
vercel --prod
```

## 3. Initialiser la base de données externe

### Via Neon/Supabase dashboard:
1. Aller dans l'éditeur SQL
2. Copier le contenu de scripts/00-init-database.sql
3. Exécuter le script

### Via CLI (si disponible):
```bash
# Avec psql installé
psql "postgresql://username:password@host:port/database_name" -f scripts/00-init-database.sql
```

## 4. Vérification

1. Vérifier que l'application Vercel fonctionne
2. Tester la création de rendez-vous
3. Vérifier les logs dans Vercel dashboard


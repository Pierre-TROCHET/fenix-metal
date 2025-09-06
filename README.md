# Phenix Ferronnier - Site de Ferronnerie d'Art

Site web pour Phenix Ferronnier, ferronnier d'art spécialisé dans les créations métalliques et aménagements.

## Configuration de la base de données

Le projet utilise Prisma avec support pour SQLite (développement) et PostgreSQL (production).

### Variables d'environnement requises

Créez un fichier `.env.local` avec les variables suivantes :

```env
# Base de données
# Pour le développement local (SQLite)
DATABASE_URL="file:./dev.db"

# Pour la production (PostgreSQL)
# DATABASE_URL="postgresql://username:password@localhost:5432/fenix_metal"

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Authentification admin
AUTH_LOGIN=admin
AUTH_SECRET=your-admin-password

# Vercel Blob (pour l'upload d'images)
BLOB_READ_WRITE_TOKEN=your-blob-token
```

### Schémas de base de données

- `prisma/schema.prisma` : Configuration pour SQLite (développement)
- `prisma/schema.postgresql.prisma` : Configuration pour PostgreSQL (production)

## Getting Started

1. Installez les dépendances :
```bash
npm install
```

2. Configurez les variables d'environnement (voir section ci-dessus)

3. Générez le client Prisma :
```bash
npm run db:generate
```

4. Exécutez les migrations :
```bash
npm run db:push
```

5. Lancez le serveur de développement :
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Déploiement

### Sur Vercel

1. **Configurez les variables d'environnement sur Vercel :**
   - `DATABASE_URL` = votre URL PostgreSQL (ex: `postgresql://user:password@host:port/database`)
   - `NEXTAUTH_SECRET` = une clé secrète forte
   - `NEXTAUTH_URL` = l'URL de votre site (ex: `https://votre-site.vercel.app`)
   - `AUTH_LOGIN` = nom d'utilisateur admin
   - `AUTH_SECRET` = mot de passe admin
   - `BLOB_READ_WRITE_TOKEN` = token Vercel Blob

2. **Déployez :**
   ```bash
   npx vercel
   ```

3. **Après le déploiement, exécutez les migrations PostgreSQL :**
   ```bash
   npm run db:push:postgres
   ```

4. **Optionnel - Seed la base de données :**
   ```bash
   npm run seed
   ```

### Base de données PostgreSQL

Pour la production, utilisez une base de données PostgreSQL :
- **Vercel Postgres** (recommandé)
- **Supabase**
- **PlanetScale**
- **Railway**
- **Neon**

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

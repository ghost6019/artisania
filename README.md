# Artisania

Plateforme SaaS de gestion et de mise en relation des artisans (CRM, agenda, interventions, devis, factures, annuaire public).

Stack : **Next.js (App Router)** · **TypeScript strict** · **Tailwind CSS** · **Prisma** · **PostgreSQL** · **Auth.js** · **Zod**.

## Prérequis

- Node.js 20+
- npm
- Une base **PostgreSQL** : [Neon](https://console.neon.tech) (recommandé, gratuit) ou Docker Compose

## Installation

```bash
# 1. Dépendances
npm install

# 2. Variables d'environnement
cp .env.example .env
# Sous Windows PowerShell :
# Copy-Item .env.example .env

# 3. Base de données Neon (recommandé)
#    neon login
#    neon init -y --org-id <org> --project-id <project> --branch production --services postgres
#    neon deploy
#    (écrit DATABASE_URL + DATABASE_URL_UNPOOLED dans .env)

# 3bis. Alternative Docker local (nécessite la virtualisation CPU)
# docker compose up -d

# 4. Migrations + client Prisma
npx prisma generate
npx prisma migrate deploy

# 5. Données de démonstration (optionnel mais recommandé)
npm run db:seed

# 6. Lancer l'application
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Comptes de démonstration

Mot de passe commun : `Demo2026!`

| Rôle | E-mail |
|------|--------|
| Artisan | `artisan@artisania.local` |
| Particulier | `particulier@artisania.local` |
| Admin plateforme | `admin@artisania.local` |
| Second artisan | `plombier@artisania.local` |

Les données seed sont préfixées `[DÉMO]` et le bandeau démo s’affiche si `NEXT_PUBLIC_DEMO_MODE=true`.

## Variables d'environnement

Voir `.env.example`. Avec Neon (`neon deploy` / `neon env pull`) :

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Postgres **pooled** (app Next.js / Prisma Client) |
| `DATABASE_URL_UNPOOLED` | Postgres **direct** (migrations Prisma) |
| `NEON_BRANCH` | Branche Neon active (`production`) |
| `AUTH_SECRET` | Secret Auth.js (`openssl rand -base64 32`) |
| `AUTH_URL` | URL publique de l’app |
| `NEXT_PUBLIC_APP_NAME` | Nom affiché |
| `NEXT_PUBLIC_APP_URL` | URL publique |
| `NEXT_PUBLIC_DEMO_MODE` | Affiche les aides démo |

Fichiers Neon : `neon.ts` (politique), `.neon` (lien local, gitignored).

## Déploiement Vercel

1. Connectez le repo GitHub à [vercel.com](https://vercel.com) (région **Frankfurt / fra1** recommandée, proche de Neon).
2. Ajoutez les variables d’environnement (Production + Preview) :
   - `DATABASE_URL`, `DATABASE_URL_UNPOOLED` (depuis Neon)
   - `AUTH_SECRET` (nouvelle clé forte)
   - `AUTH_URL` = `https://votre-domaine.vercel.app`
   - `NEXT_PUBLIC_APP_URL` = même URL
   - `NEXT_PUBLIC_APP_NAME=Artisania`
   - `NEXT_PUBLIC_DEMO_MODE=true` (ou `false` en prod commerciale)
3. Build : `prisma generate && prisma migrate deploy && next build` (déjà dans `npm run build`).
4. Après le premier deploy, mettez à jour `AUTH_URL` / `NEXT_PUBLIC_APP_URL` si l’URL Vercel diffère, puis redéployez.

CLI : `npx vercel` puis `npx vercel --prod`.

## Scripts npm

| Script | Description |
|--------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production |
| `npm run start` | Serveur production |
| `npm run lint` | ESLint |
| `npm run test` | Tests Vitest |
| `npm run db:migrate` | Migrations Prisma |
| `npm run db:seed` | Seed démo |
| `npm run db:studio` | Prisma Studio |

## Architecture

```
src/
  app/                 # Pages App Router + API /api/v1
  components/          # UI et formulaires
  lib/                 # auth, prisma, validations, utils
  services/            # Logique métier
  types/               # Types Auth.js
prisma/
  schema.prisma        # Modèle de données
  seed.ts              # Données de démonstration
```

### Espaces

- **Public** : accueil, annuaire, profils, inscription/connexion
- **Artisan** (`/dashboard`) : CRM clients, agenda, demandes, devis/factures (lecture), paramètres
- **Admin** (`/admin`) : statistiques et utilisateurs (rôle `PLATFORM_ADMIN`)
- **Particulier** (`/compte`) : suivi des demandes

### API REST v1

Préfixe : `/api/v1`

| Méthode | Route | Auth |
|---------|-------|------|
| POST | `/auth/register` | Public |
| GET/POST | `/customers` | Entreprise |
| GET/PATCH/DELETE | `/customers/:id` | Entreprise |
| GET/POST | `/appointments` | Entreprise |
| PATCH/DELETE | `/appointments/:id` | Entreprise |
| GET/POST | `/service-requests` | Mixte |
| GET/PATCH | `/company` | Entreprise |
| GET | `/artisans` | Public |
| GET | `/admin/overview` | Admin |

L’isolation multi-entreprises repose sur `activeCompanyId` + `CompanyMembership` (côté serveur).

## Sécurité (v1)

- Sessions Auth.js (JWT) + hash bcrypt des mots de passe
- Middleware de protection `/dashboard` et `/admin`
- Validation Zod sur les entrées API
- Contrôle d’appartenance à l’entreprise avant toute lecture/écriture privée
- Pas de secrets dans le dépôt (`.env` ignoré)

## Limitations actuelles

- Devis / factures / interventions : **lecture** + modèle prêt ; éditeurs CRUD complets à venir
- Upload de photos sur les demandes : non implémenté (signalé dans l’UI)
- E-mails / SMS / paiements / IA : non branchés
- Pas encore de tests E2E

## Prochaines étapes recommandées

1. CRUD complet interventions + devis + factures
2. Messagerie client ↔ artisan
3. Notifications e-mail (Resend / SMTP)
4. Paiements (Stripe)
5. Modération avis / signalements côté admin
6. Assistant IA administratif

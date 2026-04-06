@AGENTS.md

# CRM Posicionarte — Estado del Proyecto

## Qué es esto

CRM interno para la agencia de marketing digital **Posicionarte**. Acceso para 5 miembros del equipo con login email/contraseña. Diseño "Digital Architect" (dark mode premium).

**Spec completa:** `../docs/superpowers/specs/2026-03-31-crm-posicionarte-design.md`  
**Plan de implementación:** `../docs/superpowers/plans/2026-03-31-crm-posicionarte.md`

---

## Stack Técnico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js App Router | 16.2.2 |
| Lenguaje | TypeScript | 5.x |
| Estilos | Tailwind CSS | **v4** (CSS-first, sin tailwind.config.ts) |
| ORM | Prisma | **7.x** |
| Auth | NextAuth | v5 beta |
| DB Dev | SQLite | via Prisma |
| DB Prod | Neon (PostgreSQL serverless) | - |
| Deploy | Vercel | - |
| Icons | Material Symbols Outlined | Google CDN |
| Font | Plus Jakarta Sans | Variable font via next/font/google |

---

## Decisiones Técnicas Críticas

### Tailwind v4 — NO hay tailwind.config.ts
- Config 100% en CSS: `app/globals.css` usa `@theme {}` para colores y `@layer components {}` para clases personalizadas
- Colores se definen como `--color-primary: #b8c4ff;` → generan automáticamente `bg-primary`, `text-primary`, etc.
- **NO usar** `tailwind.config.ts` — rompe v4

### Prisma 7 — Import path diferente, driver adapters, y schema simplificado
- El cliente Prisma se genera en `app/generated/prisma/` (no en `node_modules/@prisma/client`)
- **Import correcto:** `import { PrismaClient } from "@/app/generated/prisma/client"` (el archivo es `client.ts`, NO un index)
- **NO usar:** `import { PrismaClient } from "@prisma/client"` — eso es Prisma 5 y anteriores
- **Prisma 7 requiere driver adapter:** el constructor `new PrismaClient()` sin args NO compila — necesita `{ adapter }` obligatoriamente
- Para SQLite dev: `npm install @prisma/adapter-better-sqlite3 better-sqlite3 @types/better-sqlite3` y pasar `new PrismaBetterSqlite3({ url: absolutePath })`
- La `url` para el adapter se obtiene de `process.env.DATABASE_URL` (formato `file:./prisma/dev.db`) — quitar el prefijo `file:` y resolver path absoluto
- Config CLI en `prisma.config.ts` (raíz del proyecto) — ahí va la `url` de conexión para migraciones
- **Prisma 7 breaking change:** `provider` debe ser literal en `schema.prisma`, NO `env("DATABASE_PROVIDER")`
- **Prisma 7 breaking change:** `url = env("DATABASE_URL")` NO va en `schema.prisma` — solo en `prisma.config.ts`
- Para dev (SQLite): `datasource db { provider = "sqlite" }` — sin url en el schema
- Para prod (Neon): cambiar `provider = "postgresql"` en schema + actualizar `prisma.config.ts` + usar `@prisma/adapter-neon`

### Next.js 16 — Diferencias con v14
- Server Actions, App Router, Server Components: funcionan igual
- `params` en page components puede requerir `await params` en algunos casos — leer docs en `node_modules/next/dist/docs/`
- `<link>` tags en layout.tsx van fuera del `<head>` manual (React 19 los hoist automáticamente)

### NextAuth v5
- Config completa en `auth.ts` (raíz) — incluye Credentials provider con Prisma
- Export: `{ handlers, auth, signIn, signOut }`
- **Edge Runtime split:** El middleware NO puede importar `auth.ts` (usa Prisma/better-sqlite3 = Node.js nativo)
  - `auth.config.ts` — config "thin" sin imports Node.js (solo JWT callbacks + pages)
  - `middleware.ts` importa de `auth.config.ts`: `export default NextAuth(authConfig).auth`
  - `auth.ts` hace spread de `authConfig` y agrega el provider de Credentials con Prisma

### Whitelist de emails
- `ALLOWED_EMAILS` en `.env.local` (separados por coma, sin espacios)
- Se verifica en `auth.ts` antes de consultar la DB

---

## Estructura de Archivos (target final)

```
crm-posicionarte/
├── app/
│   ├── generated/prisma/         ← Cliente Prisma generado (NO editar)
│   ├── (auth)/login/page.tsx     ← Login page
│   ├── (dashboard)/
│   │   ├── layout.tsx            ← Shell: Sidebar + Topbar
│   │   ├── page.tsx              ← Dashboard
│   │   ├── clients/
│   │   │   ├── page.tsx          ← Client List
│   │   │   ├── new/page.tsx      ← Nuevo cliente
│   │   │   └── [id]/page.tsx     ← Client Details
│   │   └── meetings/
│   │       ├── page.tsx          ← Meetings Panel
│   │       └── new/page.tsx      ← Nueva reunión
│   ├── api/auth/[...nextauth]/route.ts
│   ├── globals.css               ← ✅ COMPLETO — Design system
│   └── layout.tsx                ← ✅ COMPLETO — Root layout
├── components/
│   ├── ui/button.tsx
│   ├── ui/badge.tsx
│   ├── ui/modal.tsx
│   ├── sidebar.tsx
│   ├── topbar.tsx
│   ├── stat-card.tsx
│   ├── pipeline-chart.tsx
│   ├── service-donut.tsx
│   ├── client-table.tsx
│   ├── client-form.tsx
│   ├── client-tabs.tsx
│   ├── delete-client-button.tsx
│   ├── notes-form.tsx
│   ├── meeting-form.tsx
│   └── meetings-client.tsx
├── lib/
│   ├── auth.ts                   ← NextAuth config
│   ├── db.ts                     ← Prisma singleton
│   ├── utils.ts                  ← cn() helper
│   ├── constants.ts              ← Status/service enums y labels
│   └── actions/
│       ├── clients.ts            ← Server Actions: clientes
│       └── meetings.ts           ← Server Actions: reuniones
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── auth.ts                       ← NextAuth v5 root config
├── middleware.ts                 ← Route protection
├── prisma.config.ts              ← Prisma 7 config
├── .env.local                    ← Secrets (git-ignored)
└── .env.example                  ← Template (commitado)
```

---

## Estado de Implementación

### ✅ Completado

| Task | Descripción | Commit |
|------|-------------|--------|
| Task 1 | Project Initialization (Next.js 16, deps, git) | 398570f |
| Task 2 | Tailwind v4 Design System + globals.css + layout.tsx | 768435a |
| Task 3 | Prisma Schema (modelos User, Client, ClientService, Meeting) | — |
| Task 4 | Prisma Client singleton (`lib/db.ts`) + `lib/constants.ts` | — |
| Task 5 | NextAuth v5 (`auth.ts`, `middleware.ts`, API route, types) | — |
| Task 6 | Login page | — |
| Task 7 | Seed script + usuarios/clientes/reuniones de muestra | — |

| Task 8 | App layout shell (Sidebar, Topbar, dashboard layout) | — |
| Task 9 | UI primitives (Button, Badge, ConfirmModal) + lib/utils.ts | — |
| Task 10 | Server Actions — Clientes (create, update, delete, notes, status) | — |
| Task 11 | Server Actions — Reuniones (create, update, delete) | — |
| Task 12 | Dashboard (KPIs, PipelineChart, ServiceDonut, tabla recientes) | — |
| Task 13 | Client List page + ClientTable (search + filter) | — |
| Task 14 | New Client form (ClientForm) | — |
| Task 15 | Client Details (tabs: info, billing, meetings, notes) | — |
| Task 16 | Meetings Panel (grouped, filter, inline status update) | — |
| Task 17 | Production config (Neon + Vercel) | — |

### ✅ PROYECTO COMPLETO — 17/17 tasks

---

## Variables de Entorno

### Dev (`.env.local`)
```env
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="genera con: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
ALLOWED_EMAILS="email1@dominio.com,email2@dominio.com"
SEED_USER_1_NAME="Nombre"
SEED_USER_1_EMAIL="email@dominio.com"
SEED_USER_1_PASSWORD="password-seguro"
```

### Producción (Vercel env vars) — ver `.env.production.example`
```env
DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require"
AUTH_SECRET="..."
NEXTAUTH_URL="https://tu-app.vercel.app"
ALLOWED_EMAILS="..."
SEED_USER_*="..."
```

---

## Guía de Deploy en Producción (Neon + Vercel)

### Paso 1 — Crear base de datos en Neon
1. Ir a [neon.tech](https://neon.tech) → Crear cuenta gratuita
2. New Project → elegir región más cercana (us-east-2 o eu-central-1)
3. Copiar el **Connection string** (formato `postgresql://...`)

### Paso 2 — Subir código a GitHub
```bash
git add .
git commit -m "feat: production ready CRM"
git remote add origin https://github.com/TU_USUARIO/crm-posicionarte.git
git push -u origin main
```

### Paso 3 — Deploy en Vercel
1. [vercel.com](https://vercel.com) → New Project → Import desde GitHub
2. Framework: Next.js (auto-detectado)
3. En **Environment Variables**, agregar todas las vars de `.env.production.example`
   - `DATABASE_URL` = connection string de Neon
   - `AUTH_SECRET` = `openssl rand -base64 32`
   - `NEXTAUTH_URL` = URL de Vercel (la muestra después del primer deploy)
   - `ALLOWED_EMAILS`, `SEED_USER_*`
4. Deploy

### Paso 4 — Ejecutar seed en producción (una sola vez)
```bash
DATABASE_URL="postgresql://...tu-url-neon..." npm run db:seed
```

### Cómo funciona el dual-adapter (SQLite dev / Neon prod)
- `lib/db.ts` detecta el prefijo de `DATABASE_URL`:
  - `file:` → usa `@prisma/adapter-better-sqlite3` (local)
  - `postgresql://` → usa `@prisma/adapter-neon` (producción)
- `prisma.config.ts` selecciona el schema correcto automáticamente
- `vercel.json` incluye `prisma migrate deploy` en el build command

---

## Comandos Útiles

```bash
npm run dev          # Dev server en localhost:3000
npm run build        # Build de producción
npm run db:seed      # Poblar DB con usuarios y datos de ejemplo
npm run db:reset     # Reset completo de DB + re-seed
npx prisma migrate dev --name <nombre>   # Nueva migración
npx prisma studio    # UI visual de la DB
```

---

## Diseño Visual

El sistema visual "Digital Architect" está definido en `app/globals.css`:
- **Fondo base:** `bg-surface` (#131313)
- **Cards:** `bg-surface-container-low` (#1C1B1B)
- **Cards anidadas:** `bg-surface-container-high` (#2A2A2A)
- **Acento primario:** `text-primary` / `bg-primary` (#B8C4FF)
- **CTA/botones:** clase `.cta-gradient` (azul eléctrico)
- **Métricas positivas:** `text-secondary` (#41E575, verde neón)
- **Error/negativo:** `text-error` (#FFB4AB)
- **Topbar:** clase `.glass-panel` (blur backdrop)
- **Nav activo:** clase `.nav-active` (borde izquierdo azul)

Fuente exclusiva: **Plus Jakarta Sans** (variable font).  
Iconos: **Material Symbols Outlined** (usar `<span className="material-symbols-outlined">nombre_icono</span>`).

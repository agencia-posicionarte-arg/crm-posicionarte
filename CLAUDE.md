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

### Prisma 7 — Import path diferente
- El cliente Prisma se genera en `app/generated/prisma/` (no en `node_modules/@prisma/client`)
- **Import correcto:** `import { PrismaClient } from "@/app/generated/prisma"`
- **NO usar:** `import { PrismaClient } from "@prisma/client"` — eso es Prisma 5 y anteriores
- Config en `prisma.config.ts` (raíz del proyecto), no solo en `schema.prisma`
- `DATABASE_PROVIDER` es env var (para switching SQLite↔PostgreSQL)

### Next.js 16 — Diferencias con v14
- Server Actions, App Router, Server Components: funcionan igual
- `params` en page components puede requerir `await params` en algunos casos — leer docs en `node_modules/next/dist/docs/`
- `<link>` tags en layout.tsx van fuera del `<head>` manual (React 19 los hoist automáticamente)

### NextAuth v5
- Config en `auth.ts` en la raíz del proyecto
- Export: `{ handlers, auth, signIn, signOut }`
- Middleware usa `auth` directamente como handler

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

### 🔄 Pendiente

| Task | Descripción |
|------|-------------|
| Task 3 | Prisma Schema (modelos User, Client, ClientService, Meeting) |
| Task 4 | Prisma Client singleton + lib/constants.ts |
| Task 5 | NextAuth v5 setup (auth.ts, middleware, API route) |
| Task 6 | Login page |
| Task 7 | Seed script + usuarios iniciales |
| Task 8 | App layout shell (Sidebar + Topbar) |
| Task 9 | UI primitives (Button, Badge, Modal) |
| Task 10 | Server Actions — Clientes |
| Task 11 | Server Actions — Reuniones |
| Task 12 | Dashboard page (KPIs, charts, recent clients) |
| Task 13 | Client List page |
| Task 14 | New Client form |
| Task 15 | Client Details page (tabs) |
| Task 16 | Meetings Panel |
| Task 17 | Production config (Neon + Vercel) |

---

## Variables de Entorno Requeridas

```env
# Dev — copiar de .env.example y completar
DATABASE_URL="file:./prisma/dev.db"
DATABASE_PROVIDER="sqlite"
AUTH_SECRET="genera con: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
ALLOWED_EMAILS="email1@dominio.com,email2@dominio.com"
SEED_USER_1_NAME="Nombre"
SEED_USER_1_EMAIL="email@dominio.com"
SEED_USER_1_PASSWORD="password-seguro"
```

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

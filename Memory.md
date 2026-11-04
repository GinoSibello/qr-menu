# Memory.md

> Leer SIEMPRE antes de empezar cualquier tarea. Resumen comprimido del estado
> más reciente. Máx. 70 líneas. Se reescribe al cerrar cada iteración.

## Estado actual (última iteración)
- MVP funcional de punta a punta. Monorepo npm workspaces: `client/` (PWA React+Vite+TS) y `server/` (Express+Prisma+SQLite).
- Sin tests automatizados. Git inicializado (sin commits).

## Cómo correr
- `npm install` · `npm run seed` · `npm run dev` (server 4000 + client 5173).
- DB: SQLite en `server/prisma/dev.db` (no hay Docker). Migrable a PostgreSQL.
- Credenciales: admin `admin/admin123`, cocina `cocina/cocina123`.
- Flujo: `/mesa/:number` (QR) → carrito → checkout (pago demo) → `/mesa/:number/pedido/:id`.
- Otras rutas: `/cocina`, `/admin`, `/styles` (muestras A/B/C), `/` (home demo).

## Decisiones tomadas
- UX/UI: **C (Minimal Tech)** elegida. A/B conservadas como referencia y en `/styles`.
- Stack: React+TS+Vite (PWA) · Node+Express · Prisma · JWT (bcryptjs) · Socket.IO (realtime).
- Estados del pedido (RN-04): recibido → en preparación → listo → entregado.
- Pago 100% demo (sin pasarela real).

## Implementado (relevante)
- server: routes en `server/src/routes/` (menu, tables, orders, admin, auth); ws en `src/ws.ts` (Socket.IO); seed en `prisma/seed.ts`.
- client: páginas en `client/src/pages/`; design tokens en `src/index.css` (variables CSS); API client en `src/lib/api.ts` (usa proxy Vite `/api` y `/socket.io`).
- Admin CRUD: categorías, platos (activar/desactivar), maridajes. Cocina: ver pedidos + avanzar estado.

## Pendientes (no asumir)
1. Definir hosting y tiempo real (Socket.IO vs SSE) — `03-SDD.md` §10 (se usó Socket.IO de momento).
2. Sin tests: no hay suite configurada.

## Reglas rápidas
- Docs/comunicación en español; código, tablas y endpoints en inglés.
- No tocar backlog (voz IA, pago real, reservas, delivery, app nativa) sin pedirlo.
- Tras cambios en `.opencode/` reiniciar opencode.

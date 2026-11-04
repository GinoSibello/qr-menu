# Memory.md

> Leer SIEMPRE antes de empezar cualquier tarea. Resumen comprimido del estado
> más reciente. Máx. 70 líneas. Se reescribe al cerrar cada iteración.

## Estado actual (última iteración)
- MVP funcional de punta a punta. Monorepo npm workspaces: `client/` (PWA React+Vite+TS) y `server/` (Express+Prisma+PostgreSQL).
- PostgreSQL 16 vía Docker (`docker-compose.yml`). Sin tests automatizados. Repo en GitHub: `GinoSibello/qr-menu`.

## Cómo correr
- `docker compose up -d` → `npm install` → `npm run seed` → `npm run dev` (server 4000 + client 5173).
- DB: PostgreSQL (`postgresql://qrmenu:qrmenu@localhost:5432/qrmenu`). Precios `Decimal(10,2)`.
- Credenciales: admin `admin/admin123`, cocina `cocina/cocina123`.
- Flujo: `/mesa/:number` (QR) → carrito → checkout (pago demo) → `/mesa/:number/pedido/:id`.
- Otras rutas: `/cocina`, `/admin`, `/styles` (muestras A/B/C), `/` (home demo).

## Decisiones tomadas
- UX/UI: **C (Minimal Tech)** elegida. A/B conservadas como referencia y en `/styles`.
- Stack: React+TS+Vite (PWA) · Node+Express · Prisma+PostgreSQL · JWT (bcryptjs) · Socket.IO (realtime).
- Estados del pedido (RN-04): recibido → en preparación → listo → entregado. Pago 100% demo.

## Implementado (relevante)
- server: routes en `server/src/routes/`; ws en `src/ws.ts` (Socket.IO); seed `prisma/seed.ts`; migración `prisma/migrations/*_init`.
- `src/db.ts` parchea `Prisma.Decimal.prototype.toJSON` para serializar precios como número (no string).
- client: páginas en `client/src/pages/`; tokens en `src/index.css`; API client `src/lib/api.ts` (proxy Vite `/api` y `/socket.io`).
- Admin CRUD (categorías, platos, maridajes). Cocina: ver pedidos + avanzar estado.

## Pendientes (no asumir)
1. Definir hosting y tiempo real (Socket.IO vs SSE) — `03-SDD.md` §10 (se usó Socket.IO).
2. Sin tests: no hay suite configurada.

## Reglas rápidas
- Docs/comunicación en español; código, tablas y endpoints en inglés.
- No tocar backlog (voz IA, pago real, reservas, delivery, app nativa) sin pedirlo.
- Tras cambios en `.opencode/` reiniciar opencode.

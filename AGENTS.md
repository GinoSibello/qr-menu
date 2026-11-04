# AGENTS.md

> **Lee `Memory.md` ANTES de cualquier otra cosa** — tiene el estado más reciente del proyecto.

## Subagentes disponibles

El desarrollo se divide en subagentes (`.opencode/agents/`). Despáchalos con la herramienta `task` usando su `subagent_type`:

- `frontend-pwa` — scaffold del client PWA (manifest, service worker, routing, API client).
- `frontend-menu` — menú público: categorías, platos, maridajes.
- `frontend-ordering` — carrito, checkout, pago demo.
- `frontend-kitchen` — vista de cocina, cambio de estado.
- `frontend-admin` — panel CRUD de admin.
- `backend-api` — rutas/controllers/middleware/auth del server.
- `database-prisma` — schema, modelo de datos, migraciones, seed.
- `realtime` — WebSockets/SSE para estado de pedidos.
- `apply-ux-ui` — aplicar la opción visual elegida (design system).

## Estado del proyecto

MVP funcional de punta a punta. Monorepo npm workspaces: `client/` (PWA React+Vite+TS) y `server/` (Express+Prisma+PostgreSQL). Sin tests automatizados aún.

## Comandos de desarrollo

```bash
docker compose up -d    # levanta PostgreSQL 16 (puerto 5432)
npm install             # instala ambos workspaces
npm run seed            # crea datos de ejemplo en PostgreSQL
npm run dev             # levanta server (4000) y client (5173) en paralelo
npm run typecheck       # typecheck de server y client
npm run build           # build de producción
```

- Base de datos: **PostgreSQL 16** vía Docker (`docker-compose.yml`). Credenciales dev: `qrmenu/qrmenu` en `server/.env` (ver `.env.example`). Precios en `Decimal(10,2)`.
- Credenciales seed: admin `admin/admin123`, cocina `cocina/cocina123`.
- Flujo cliente: `/mesa/:number` (QR) → carrito → checkout (pago demo) → `/mesa/:number/pedido/:id`.
- Migraciones Prisma en `server/prisma/migrations/`; usar `npx prisma migrate dev` para cambios de schema.

## Fuente de verdad: `docs/`

Leé estos archivos antes de escribir cualquier código:

- `docs/01-PRD.md` — visión, personas, flujo QR→menú→pago→cocina, alcance MVP vs. backlog.
- `docs/02-SRS.md` — requisitos funcionales (RF-xx) y no funcionales (RNF-xx), reglas de negocio (RN-xx), casos de uso.
- `docs/03-SDD.md` — stack, arquitectura, modelo de datos, endpoints, estructura del proyecto.
- `docs/04-UX-UI.md` — 3 propuestas visuales (A/B/C). **Elegida: C (Minimal Tech)**; A y B se conservan como referencia y se muestran en páginas de muestra.

## Decisiones ya tomadas (no reinventar)

- Producto: menú digital por QR de mesa (monorestaurante), PWA, pago demo (sin pasarela real), cocina ve pedidos y cambia estado.
- Stack definido en `03-SDD.md`: React + TypeScript + Vite (frontend PWA), Node + Express (backend), PostgreSQL + Prisma, JWT para admin/cocina.
- Estados del pedido (RN-04): `recibido → en preparación → listo → entregado`.
- Opción visual elegida: **C (Minimal Tech)**. Todo el desarrollo se hace con ese estilo. Las opciones A y B se conservan en `04-UX-UI.md` y se exponen como páginas de muestra (no borrar).

## Convenciones

- Documentación y comunicación en **español**; identificadores de código, tablas y endpoints en **inglés** (ver modelo de datos en `03-SDD.md`).
- No agregar funcionalidades del backlog (voz IA, pago real, reservas, delivery, app nativa) al MVP sin pedirlo explícitamente.

## Próximos pasos pendientes (no asumir hechos)

- Definir hosting y mecanismo de tiempo real (Socket.IO vs. SSE) — abiertos en `03-SDD.md` §10.

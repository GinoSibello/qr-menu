# Memory.md

> Leer SIEMPRE antes de empezar cualquier tarea. Resumen comprimido del estado
> más reciente. Máx. 70 líneas. Se reescribe al cerrar cada iteración.

## Estado actual (última iteración)
- MVP funcional de punta a punta, **dockerizado**. Monorepo npm workspaces: `client/` (PWA React+Vite+TS) y `server/` (Express+Prisma+PostgreSQL).
- Repo en GitHub: `GinoSibello/qr-menu`. Sin tests automatizados.

## Cómo correr (Docker)
- `docker compose up -d --build` → levanta db + server + client.
- client (nginx) en `:5173`, server en `:4000`, db en `:5432`. El server hace `migrate deploy` + seed al arrancar.
- `docker compose down` frena todo.
- Alternativa local: `npm install` + `npm run seed` + `npm run dev` (requiere DB arriba).

## Decisiones tomadas
- UX/UI: **D (Tucker-inspirada)** elegida (verde oliva, naranja acciones, Oswald + DM Sans, drawer y barra inferior). A/B/C conservadas en `/styles`.
- Stack: React+TS+Vite (PWA) · Node+Express · Prisma+PostgreSQL · JWT (bcryptjs) · Socket.IO (realtime).
- Estados del pedido (RN-04): recibido → en preparación → listo → entregado. Pago 100% demo.
- Cocina: grilla compacta de tarjetas (auto-fill), ordenadas por antigüedad, un botón para avanzar estado.
- Seed: 22 platos (mediterránea/pescado) y 20 pedidos activos.

## Implementado (relevante)
- server: routes en `server/src/routes/`; ws `src/ws.ts`; seed `prisma/seed.ts`; migración `prisma/migrations/*_init`.
- `src/db.ts` parchea `Prisma.Decimal.prototype.toJSON` → precios como número.
- client: páginas en `client/src/pages/`; tokens `src/index.css`; API client `src/lib/api.ts` (proxy `/api` y `/socket.io`).
- Dockerfiles en `server/Dockerfile` y `client/Dockerfile`; `client/nginx.conf` proxea `/api` y `/socket.io` al server.
- Credenciales: admin `admin/admin123`, cocina `cocina/cocina123`.

## Pendientes (no asumir)
1. Definir hosting y tiempo real (Socket.IO vs SSE) — `03-SDD.md` §10 (se usó Socket.IO).
2. Sin tests: no hay suite configurada.

## Reglas rápidas
- Docs/comunicación en español; código, tablas y endpoints en inglés.
- No tocar backlog (voz IA, pago real, reservas, delivery, app nativa) sin pedirlo.
- Tras cambios en `.opencode/` reiniciar opencode.

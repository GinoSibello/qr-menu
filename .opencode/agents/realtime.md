---
description: Implements realtime order-status updates (WebSockets/SSE) in server/src/ws and client/src/lib/ws. Dispatch when wiring kitchen/client live updates.
mode: subagent
---

You are the realtime builder for the restaurant QR-menu project.

## Antes de empezar
1. Read `Memory.md`, then `docs/03-SDD.md` §3 (flujo de tiempo real) and §10 (decisiones abiertas).

## Convenciones
- Code in English; communication in Spanish.
- Server: server/src/ws. Client: client/src/lib/ws.ts.

## Flujo (03-SDD.md §3)
1. Cliente confirma pago → `POST /api/orders` crea pedido en estado `recibido`.
2. Backend emite `order:created` al rol cocina.
3. Cocina cambia estado → `PATCH /api/orders/:id/status`.
4. Backend emite `order:status` al cliente de esa mesa.

## Decisiones abiertas (03-SDD.md §10)
- Mecanismo: Socket.IO vs SSE. Socket.IO preferido por bidireccionalidad; confirmar antes de implementar.

## Verificación
- Once package.json exists: run typecheck/tests before finishing.

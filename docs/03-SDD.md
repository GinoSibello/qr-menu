# SDD — Software Design Document

**Producto:** Menú digital con pedido por QR para restaurantes
**Versión:** 1.0 (MVP)
**Estado:** Borrador aprobado
**Fecha:** Noviembre 2026

---

## 1. Propósito

Describir cómo se implementará técnicamente el sistema definido en `02-SRS.md`: stack tecnológico, arquitectura, modelo de datos, API, estructura del proyecto y despliegue.

## 2. Stack tecnológico propuesto

Se elige un stack moderno, ampliamente soportado y apto para PWA con capacidades offline y tiempo real.

| Capa | Tecnología | Justificación |
|---|---|---|
| **Frontend** | React + TypeScript + Vite | Componentes reutilizables, tipado seguro, build rápido. |
| **UI** | Tailwind CSS (o CSS Modules) | Estilos rápidos y consistentes con la opción visual elegida. |
| **PWA** | `vite-plugin-pwa` + Workbox | Manifest, service worker y estrategias de cache listas. |
| **Backend** | Node.js + Express (o Fastify) | Mismo lenguaje que el frontend, ligero y con ecosistema amplio. |
| **Base de datos** | PostgreSQL (con Prisma ORM) | Relacional, consistente para pedidos y catálogo; Prisma facilita migraciones. |
| **Tiempo real** | WebSockets (Socket.IO) o SSE | Actualizar el estado del pedido en cocina y cliente sin recargar. |
| **Autenticación** | JWT + bcrypt | Sesiones para el panel admin. |

> **Alternativa simplificada** (si se prioriza velocidad de entrega): frontend React + backend con **SQLite** y Prisma, migrable a PostgreSQL en producción. Se recomienda PostgreSQL desde el inicio para evitar migraciones posteriores.

## 3. Arquitectura

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│   Cliente (PWA)             │  HTTP/ │   Backend (API REST + WS)    │
│  - Menú y carrito           │  WS    │  - Catálogo y pedidos        │
│  - Pantalla de pago demo    │───────▶│  - Autenticación admin       │
│  - Vista de estado de pedido│        │  - WebSockets (estado)       │
└─────────────────────────────┘        └──────────────┬───────────────┘
                                                       │
                                                       ▼
                                              ┌────────────────┐
                                              │  Base de datos │
                                              │   PostgreSQL   │
                                              └────────────────┘
```

- **Frontend (PWA):** app de cliente (menú/carrito/pago) y vistas internas (cocina y admin).
- **Backend:** API REST para catálogo, pedidos y autenticación; WebSockets/SSE para empujar estados en tiempo real.
- **Service Worker:** cachea el menú para consulta offline; los pedidos requieren conexión.

### Flujo de tiempo real (estado del pedido)
1. El cliente confirma el pago → `POST /orders` crea el pedido en estado `recibido`.
2. El backend emite un evento al rol `cocina` (WebSocket).
3. La cocina cambia estado → `PATCH /orders/:id/status`.
4. El backend emite el nuevo estado al cliente de esa mesa (WebSocket/SSE).

## 4. Modelo de datos

Entidades principales (nombres en inglés por convención):

```
Restaurant (futuro multi-restaurante; MVP: implícito/singleton)
  ├── Table        (mesa): id, number, qrCode
  ├── Category     (categoría): id, name, order
  ├── Dish         (plato): id, name, description, price, imageUrl,
  │                         available, categoryId
  ├── Pairing      (maridaje): id, dishId, title, description, suggestedItem
  ├── Order        (pedido): id, tableId, status, total, createdAt
  ├── OrderItem    (ítem): id, orderId, dishId, quantity, unitPrice
  └── User         (usuario admin/cocina): id, username, passwordHash, role
```

### Campos clave

| Entidad | Campos relevantes | Notas |
|---|---|---|
| `Dish` | `name`, `description`, `price` (decimal), `imageUrl`, `available` (bool), `categoryId` | `price` en centavos o decimal(10,2). |
| `Pairing` | `dishId`, `title`, `description`, `suggestedItem` | Relación N→1 con `Dish`. |
| `Order` | `tableId`, `status`, `total` | `status` ∈ `received`, `preparing`, `ready`, `delivered`. |
| `OrderItem` | `orderId`, `dishId`, `quantity`, `unitPrice` | Congela el precio al momento del pedido. |
| `Table` | `number`, `qrCode` | El QR apunta a `/mesa/{id}`. |
| `User` | `username`, `passwordHash`, `role` | `role` ∈ `admin`, `kitchen`. |

## 5. API (endpoints principales)

| Método | Ruta | Descripción | Rol |
|---|---|---|---|
| `GET` | `/api/menu` | Menú completo (categorías, platos, maridajes). | Público |
| `GET` | `/api/tables/:id` | Valida existencia de la mesa. | Público |
| `POST` | `/api/orders` | Crea pedido (mesa, ítems). | Público |
| `GET` | `/api/orders?status=active` | Lista pedidos activos para cocina. | Cocina |
| `PATCH` | `/api/orders/:id/status` | Actualiza estado del pedido. | Cocina |
| `GET` | `/api/orders/:id` | Estado de un pedido (para el cliente). | Público |
| `POST` | `/api/auth/login` | Inicia sesión (admin/cocina). | Público |
| `POST` | `/api/categories` | Crea categoría. | Admin |
| `PUT` | `/api/categories/:id` | Edita categoría. | Admin |
| `DELETE` | `/api/categories/:id` | Elimina categoría. | Admin |
| `POST` | `/api/dishes` | Crea plato. | Admin |
| `PUT` | `/api/dishes/:id` | Edita plato. | Admin |
| `DELETE` | `/api/dishes/:id` | Elimina plato. | Admin |
| `POST` | `/api/dishes/:id/pairings` | Agrega maridaje. | Admin |
| `DELETE` | `/api/pairings/:id` | Elimina maridaje. | Admin |

**WebSocket / SSE:**
- Evento `order:created` → notifica a cocina.
- Evento `order:status` → notifica al cliente de la mesa afectada.

## 6. PWA

| Aspecto | Implementación |
|---|---|
| Manifest | `public/manifest.webmanifest` (nombre, iconos, colores, `display: standalone`). |
| Service Worker | Workbox (`vite-plugin-pwa`). |
| Estrategia de cache | Menú (`/api/menu`) con `stale-while-revalidate`; assets estáticos `precache`. |
| Offline | Consulta del menú sin conexión; pedido y cocina requieren red. |
| Iconos | 192×192 y 512×512 px. |

## 7. Estructura del proyecto (monorepo)

```
Restaurante-web/
├── docs/                # PRD, SRS, SDD, UX-UI
├── client/              # PWA (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── pages/       # menu, checkout, payment, kitchen, admin
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/         # api, ws, auth
│   │   └── styles/
│   └── vite.config.ts
├── server/              # Backend (Node + Express + Prisma)
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── ws/          # WebSocket handlers
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
└── package.json         # scripts de workspace (opcional)
```

## 8. Seguridad

- Autenticación JWT para admin/cocina; contraseñas hasheadas con bcrypt.
- Roles verificados por middleware en rutas protegidas.
- Validación de entradas (Zod) en todos los endpoints.
- Sin datos reales de pago; el pago demo no persiste información sensible.
- Variables de entorno para secretos (`JWT_SECRET`, `DATABASE_URL`).

## 9. Despliegue

| Entorno | Frontend | Backend | DB |
|---|---|---|---|
| **Desarrollo** | Vite dev server | Node + nodemon/tsx | Docker PostgreSQL o SQLite |
| **Producción** | Build estático servido por CDN/Vercel/Netlify | Node en Render/Fly/VM | PostgreSQL gestionado (Supabase/RDS) |

Requisitos mínimos: Node 20+, PostgreSQL 15+ (o Docker Compose local con `docker-compose.yml`).

## 10. Decisiones abiertas

- Proveedor de hosting final (se resuelve antes del despliegue).
- Mecanismo de tiempo real: Socket.IO vs. SSE (se define en la implementación; ambos son válidos).
- Estrategia de imágenes de platos (URL externa vs. almacenamiento local) en el MVP.

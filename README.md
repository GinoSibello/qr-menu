# Menú Digital por QR

Carta digital por mesa para restaurantes: el cliente escanea un QR, ve el menú con maridajes, pide y paga (demo), y la cocina recibe y avanza los pedidos en tiempo real.

Estado actual: **MVP funcional de punta a punta, dockerizado**. Sin tests automatizados aún.

## Contexto y motivación

**Problema:** en un restaurante el pedido depende del mozo, hay demoras para tomar la comanda y se pierden detalles al pasarla a cocina. Además, la carta no sugiere combinaciones (por ejemplo, qué vino acompaña a un pescado).

**Solución:** una PWA que se abre desde un QR ubicado en cada mesa. El QR identifica la mesa, así el pedido llega asociado sin preguntar. El menú muestra descripción, precio, imagen y maridajes sugeridos. La cocina ve los pedidos en una grilla y avanza su estado con un toque.

**Beneficio esperado:** menos fricción para el comensal, pedidos sin errores de transcripción, más ventas por maridaje y menos tiempo de mozos en toma de pedidos.

## Objetivos y alcance

**Objetivo principal:** digitalizar el flujo QR → menú → pedido → pago demo → cocina → mesa para un solo restaurante.

**Objetivos secundarios:**
- Diseño móvil-first para el cliente, y adaptado a pantallas grandes para cocina y administración.
- Pantallas de cocina pensadas para pocos toques, para evitar ensuciar la pantalla.
- Base lista para iteraciones futuras (voz con IA, pago real, reservas, delivery).

**Incluye:**
- Menú por categorías con platos, imágenes y maridajes.
- Identificación de mesa vía URL del QR (`/mesa/:number`).
- Carrito, checkout y pago simulado.
- Vista de cocina con cambio de estado (`recibido → en preparación → listo → entregado`).
- Panel de administración (CRUD de categorías, platos y maridajes).
- PWA instalable con caché del menú.

**No incluye (backlog):** pago real, asistente de voz con IA, reservas, delivery, app nativa y soporte multi-restaurante.

## Funcionalidades principales

Resumen por bloques; el detalle funcional está en [docs/01-PRD.md](docs/01-PRD.md) y [docs/02-SRS.md](docs/02-SRS.md).

- **Cliente (mesa):** navegación por categorías, detalle de platos con maridajes, carrito con cantidades y pago demo.
- **Seguimiento:** el cliente ve el estado de su pedido en vivo.
- **Cocina:** grilla de pedidos activos ordenados por antigüedad, con un botón para avanzar cada pedido.
- **Administración:** alta, edición de disponibilidad y eliminación de categorías, platos y maridajes.
- **Infraestructura:** Docker Compose con base de datos, API y frontend; migraciones y seed al iniciar.

## Arquitectura y funcionamiento

```mermaid
flowchart LR
    Cliente["Celular del comensal<br/>(PWA)"] -->|"HTTP :5173"| Nginx
    Cocina["Pantalla de cocina<br/>/ administración"] -->|"HTTP :5173"| Nginx

    subgraph Docker Compose
        Nginx["client<br/>nginx + build de React"] -->|"/api/*"| API
        Nginx -->|"/socket.io (WebSocket)"| API
        API["server<br/>Express + Socket.IO"] -->|"Prisma"| DB[("db<br/>PostgreSQL 16")]
    end
```

**Componentes principales:**
- **client/** — React + TypeScript + Vite. Páginas de cliente, cocina, admin y muestras de estilo. En Docker se sirve como build estático con nginx, que redirige `/api` y `/socket.io` al servidor.
- **server/** — Express con rutas de menú, mesas, pedidos, autenticación y administración. Socket.IO emite `order:created` y `order:status`.
- **db** — PostgreSQL 16. El esquema está en `server/prisma/schema.prisma` y las migraciones en `server/prisma/migrations/`.

Detalle de diseño y decisiones: [docs/03-SDD.md](docs/03-SDD.md). Los criterios visuales están en [docs/04-UX-UI.md](docs/04-UX-UI.md).

## Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| React 18 + TypeScript | Interfaz de cliente, cocina y administración |
| Vite + vite-plugin-pwa | Build, dev server y PWA (manifest + service worker) |
| React Router | Navegación entre pantallas |
| Socket.IO (cliente y servidor) | Actualización de estado de pedidos en tiempo real |
| Node.js + Express | API REST |
| Prisma ORM | Acceso a datos y migraciones |
| PostgreSQL 16 | Base de datos |
| Zod | Validación de entrada de la API |
| JWT + bcryptjs | Autenticación de administración y cocina |
| Docker + Docker Compose | Ejecución de los tres servicios |
| nginx | Sirve el frontend y hace proxy de la API |

## Requisitos previos

- **Docker Desktop** (Windows/macOS) o Docker Engine + Compose v2 (Linux). Es la vía recomendada.
- **Node.js 20 o superior** y npm, solo si se ejecuta sin Docker.
- Puertos libres: `5173` (cliente), `4000` (API), `5432` (PostgreSQL).
- Conexión a internet para cargar las imágenes de los platos (Unsplash) y las fuentes (Google Fonts).

## Instalación y configuración

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/GinoSibello/qr-menu.git
   cd qr-menu
   ```
2. Revisar las variables de entorno del servidor. Para Docker no hace falta crear `.env`, porque `docker-compose.yml` ya define `DATABASE_URL`, `JWT_SECRET` y `PORT`.
3. Para ejecutar sin Docker, copiar el archivo de ejemplo:
   ```bash
   cp server/.env.example server/.env
   ```
4. Instalar dependencias (solo sin Docker):
   ```bash
   npm install
   ```

### Variables de entorno (`server/.env`)

| Variable | Descripción | Valor de ejemplo |
|---|---|---|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL | `postgresql://qrmenu:qrmenu@localhost:5432/qrmenu?schema=public` |
| `JWT_SECRET` | Clave para firmar los tokens de administración y cocina | `dev-secret-cambiar-en-produccion` |
| `PORT` | Puerto de la API | `4000` |

En Docker, `DATABASE_URL` apunta al host `db` (no a `localhost`).

## Cómo ejecutar el proyecto

### Opción recomendada: todo en Docker

```bash
docker compose up -d --build   # levanta db, server y client
docker compose ps              # db debe figurar como "healthy"
docker compose logs server     # verificar migraciones y seed
docker compose down            # detiene los contenedores
```

Al iniciar, el servidor aplica las migraciones (`prisma migrate deploy`) y ejecuta el seed. **El seed borra y recrea los datos en cada arranque** (menú, mesas, usuarios y 20 pedidos de ejemplo).

Accesos:
- Cliente: http://localhost:5173/mesa/5
- Cocina: http://localhost:5173/cocina
- Administración: http://localhost:5173/admin
- Muestras de estilo: http://localhost:5173/styles

Credenciales de ejemplo: admin `admin` / `admin123`; cocina `cocina` / `cocina123`.

### Opción alternativa: desarrollo local

Requiere solo la base de datos en Docker:

```bash
docker compose up -d db
npm run seed     # datos de ejemplo
npm run dev      # API en :4000 y cliente en :5173 (con recarga en caliente)
```

No ejecutar esta opción con el stack completo de Docker levantado: ambos usan los puertos 4000 y 5173.

### Otros comandos

```bash
npm run typecheck   # verifica tipos de server y client
npm run build       # compila server (tsc) y client (vite build)
```

### Verificación

- Salud de la API:
  ```bash
  curl http://localhost:4000/api/health
  # {"ok":true}
  ```
- Menú a través de nginx (debe devolver categorías con platos):
  ```bash
  curl http://localhost:5173/api/menu
  ```
- Base de datos: `docker compose ps` debe mostrar `qr-menu-db` como `healthy`.

## Estructura del repositorio

```
restaurante-web/
├── client/                 # PWA (React + Vite + TS)
│   ├── src/
│   │   ├── components/     # DishCard, SiteHeader (drawer), BottomNav, RequireRole...
│   │   ├── lib/            # api.ts, ws.ts (Socket.IO), cart.tsx, auth.ts
│   │   ├── pages/          # Menu, Checkout, OrderStatus, Kitchen, Admin, StyleSamples
│   │   ├── index.css       # Tokens de diseño (tema D)
│   │   └── types.ts
│   ├── Dockerfile          # build + nginx
│   └── nginx.conf          # sirve el build y hace proxy de /api y /socket.io
├── server/                 # API (Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts         # datos de ejemplo
│   ├── src/
│   │   ├── routes/         # menu, tables, orders, admin, auth
│   │   ├── auth.ts         # JWT y control de roles
│   │   ├── ws.ts           # eventos de Socket.IO
│   │   └── index.ts        # arranque de Express + Socket.IO
│   ├── .env.example
│   └── Dockerfile
├── docs/                   # PRD, SRS, SDD, UX/UI
├── .opencode/agents/       # subagentes de desarrollo
├── docker-compose.yml
├── AGENTS.md               # reglas para agentes de IA
└── Memory.md               # estado resumido de la última iteración
```

## Configuración y seguridad

- **Secretos:** `server/.env` está en `.gitignore`. Usar `server/.env.example` como plantilla. `JWT_SECRET` por defecto es solo para desarrollo y debe cambiarse en cualquier despliegue real.
- **Roles:** los endpoints de administración requieren rol `admin` y los de cocina (`GET /api/orders`, `PATCH /api/orders/:id/status`) requieren `kitchen` o `admin`. Se verifican con JWT en `server/src/auth.ts`.
- **Contraseñas:** se guardan con bcrypt (`bcryptjs`), nunca en texto plano.
- **Pago:** es simulado. No se procesa dinero real ni se guardan datos de tarjeta.
- **Validación:** la entrada de la API se valida con Zod.
- **Imágenes externas:** los platos usan URLs de Unsplash. Revisar la política de uso antes de un despliegue público.

## Pruebas y validación

- **No hay suite de tests automatizados.** La validación actual es:
  - `npm run typecheck` (tipos de server y client).
  - `npm run build` (compilación de producción).
  - Verificación manual del flujo completo: menú → pedido → cocina → cambio de estado.
- Próximo paso sugerido: tests de API para las rutas de pedidos y de autenticación, y tests end-to-end del flujo de mesa.

## Limitaciones y problemas conocidos

- **Seed destructivo:** el contenedor del servidor ejecuta el seed en cada arranque, así que se pierden los pedidos y cambios hechos desde la app. Para conservar datos, quitar `node dist/prisma/seed.js` del `CMD` en `server/Dockerfile`.
- **Endpoints públicos:** `POST /api/orders` y `GET /api/orders/:id` no requieren autenticación. Los IDs de pedido son secuenciales y se pueden consultar.
- **Transiciones de estado sin validar:** la API acepta cualquier estado válido, no solo el siguiente en la secuencia.
- **Socket.IO** acepta cualquier origen (`cors: *`). Restringirlo antes de producción.
- **Caché de la PWA:** el service worker puede mostrar el menú anterior hasta recargar (Ctrl+F5) o desregistrar el worker.
- **Imágenes:** dependen de internet. Sin conexión no se muestran.
- **Estilo de referencia:** el tema D es una propuesta inspirada en una marca existente, no una copia de sus estilos ni de su logo.
- **Sin tests automatizados.**

## Documentación relacionada

- [docs/01-PRD.md](docs/01-PRD.md): visión, personas, alcance MVP y backlog.
- [docs/02-SRS.md](docs/02-SRS.md): requisitos funcionales (RF), no funcionales (RNF) y reglas de negocio (RN).
- [docs/03-SDD.md](docs/03-SDD.md): stack, arquitectura, modelo de datos y endpoints.
- [docs/04-UX-UI.md](docs/04-UX-UI.md): propuestas visuales A, B, C y D (D elegida).
- [AGENTS.md](AGENTS.md) y [Memory.md](Memory.md): contexto para agentes de desarrollo.

## Créditos y licencia

- Desarrollado por **Gino Sibello**.
- Inspiración visual: tema D, basado en la estética de Tucker's (solo referencia de estilo).
- Imágenes de platos: [Unsplash](https://unsplash.com), sujetas a sus condiciones de uso.
- Fuentes: Oswald y DM Sans (Google Fonts, licencia SIL OFL).
- **Licencia:** no definida todavía. Hasta que se agregue un archivo `LICENSE`, todos los derechos están reservados.

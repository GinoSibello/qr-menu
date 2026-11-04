# PRD — Product Requirements Document

**Producto:** Menú digital con pedido por QR para restaurantes
**Versión:** 1.0 (MVP)
**Estado:** Borrador aprobado
**Fecha:** Noviembre 2026

---

## 1. Resumen ejecutivo

Una aplicación web progresiva (PWA) que permite a un restaurante ofrecer su menú a través de un código QR ubicado en cada mesa. El cliente escanea el QR con su celular, accede a la carta con descripciones de cada plato y **sugerencias de maridaje** (combinaciones que realzan la experiencia, por ejemplo, mariscos con un vino específico), selecciona los productos, paga de forma simulada y recibe la comida directamente en su mesa. Como el QR identifica la mesa, el pedido llega automáticamente asociado a ella.

## 2. Problema que resuelve

- **Fricción en el pedido:** el cliente no depende de llamar al mozo ni de esperar para ordenar.
- **Descubrimiento de maridajes:** el menú no solo lista platos, sino que sugiere combinaciones que aumentan el ticket promedio y mejoran la experiencia.
- **Errores de comunicación:** el pedido viaja directo desde el cliente a la cocina, sin intermediarios que puedan equivocarse.
- **Identificación de mesa automática:** se elimina la ambigüedad de "a qué mesa va este pedido".

## 3. Personas / usuarios

| Rol | Descripción | Necesidades principales |
|---|---|---|
| **Cliente final** | Comensal en una mesa. | Ver el menú, entender los platos, ver maridajes, pedir y pagar rápido desde su celular. |
| **Dueño / administrador** | Gestiona el contenido del restaurante. | Crear, editar y organizar platos, categorías, precios y maridajes. |
| **Cocina** | Recibe y prepara los pedidos. | Ver los pedidos entrantes en tiempo real y actualizar su estado. |
| **Personal de sala (mozo/cajero)** *(futuro)* | Atiende y cobra. | Ver pedidos, gestionar mesas y pagos (se incorpora en iteraciones posteriores). |

## 4. Visión de producto

Ser la herramienta de pedido más simple para el comensal: **escaneo, elección, pago y plato en la mesa**, sin fricciones y con una capa de recomendación (maridajes) que diferencia al restaurante.

### Principios de diseño
1. **Móvil primero:** todo se usa desde un celular escaneando un QR.
2. **Cero fricción:** mínimos pasos entre el escaneo y el pedido.
3. **Cero instalación:** PWA instalable pero usable sin instalar.
4. **Demo funcional:** el MVP debe recorrer el flujo completo de punta a punta, con pago simulado.

## 5. Flujo principal (happy path)

```
Cliente escanea QR de la mesa
        ↓
Accede al menú de ESA mesa (URL con identificador de mesa)
        ↓
Explora categorías y platos (descripción + maridajes sugeridos)
        ↓
Agrega platos al carrito
        ↓
Revisa el pedido y confirma
        ↓
Pago simulado (demo)
        ↓
Pedido se registra asociado a la mesa y aparece en cocina
        ↓
Cocina cambia estado: recibido → en preparación → listo → entregado
        ↓
Cliente ve el estado y recibe su comida en la mesa
```

## 6. Alcance

### 6.1 MVP (esta iteración)

- **Menú online:** listado de platos agrupados por categorías, con descripción, precio y foto (opcional).
- **Maridajes:** cada plato puede tener una o más sugerencias de maridaje con su explicación.
- **Identificación de mesa vía QR:** el enlace del QR incluye el identificador de mesa (`/mesa/{id}`).
- **Carrito de compras:** agregar/quitar productos y cantidades.
- **Pago simulado:** pantalla de pago demo sin pasarela real ni datos reales.
- **Panel de administración:** CRUD de platos, categorías y maridajes.
- **Vista de cocina:** ver pedidos entrantes y actualizar su estado.
- **PWA:** instalable, responsive y con arranque offline básico.
- **Selección de UX/UI:** elegir entre propuestas visuales (ver `04-UX-UI.md`).

### 6.2 Fuera del MVP (backlog)

| Funcionalidad | Prioridad | Notas |
|---|---|---|
| Asistente de voz con IA para pedir | Alta | Pedido por voz, el sistema arma el carrito y deja solo el pago. |
| Pago real (pasarela) | Alta | Integración con proveedor de pagos. |
| Reservas de mesa | Media | Elegir fecha, hora y cantidad de personas. |
| Delivery / para llevar | Media | Modalidad retiro o envío. |
| Gestión completa de personal | Media | Roles mozo/cajero, cierre de caja, etc. |
| App nativa (iOS/Android) | Baja | Se mantiene PWA como base. |
| Multi-restaurante (marketplace) | Baja | Actualmente diseñado para un solo restaurante. |

## 7. Requisitos de producto (resumen)

1. El comensal debe poder pedir sin crear una cuenta.
2. El QR debe identificar de forma inequívoca la mesa.
3. El pedido debe llegar a la cocina inmediatamente tras el pago.
4. La cocina debe poder ver y modificar el estado de cada pedido.
5. El administrador debe poder gestionar el menú completo sin tocar código.
6. La experiencia debe funcionar bien en móvil y permitir instalarse como PWA.
7. El pago del MVP es puramente demostrativo.

## 8. Criterios de éxito (MVP)

- Un cliente puede completar un pedido de principio a fin en menos de 2 minutos desde el escaneo del QR.
- El 100% de los pedidos llegan correctamente asociados a su mesa.
- La cocina puede ver y actualizar el estado de un pedido sin fricción.
- El administrador puede crear un plato con maridajes sin asistencia técnica.
- La PWA se instala y carga el menú sin conexión (datos cacheados).

## 9. Riesgos y consideraciones

- **Dependencia del QR:** si el QR es ilegible o está dañado, debe existir un fallback (URL directa con ingreso manual de mesa).
- **Datos offline:** en MVP el menú puede cachearse; el pedido requiere conexión para llegar a cocina.
- **Escalabilidad:** aunque el MVP es monorestaurante, el diseño debe permitir múltiples restaurantes en el futuro.

## 10. Documentos relacionados

- `02-SRS.md` — Requisitos funcionales y no funcionales.
- `03-SDD.md` — Diseño técnico y arquitectura.
- `04-UX-UI.md` — Propuestas visuales para elegir.

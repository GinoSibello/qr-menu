# SRS — Software Requirements Specification

**Producto:** Menú digital con pedido por QR para restaurantes
**Versión:** 1.0 (MVP)
**Estado:** Borrador aprobado
**Fecha:** Noviembre 2026

---

## 1. Propósito

Definir de manera formal los requisitos funcionales y no funcionales, las reglas de negocio y los casos de uso del sistema. Este documento es la base sobre la que se construye el diseño técnico (`03-SDD.md`) y se validan las funcionalidades del MVP.

## 2. Alcance

El MVP cubre cuatro áreas funcionales:

1. **Catálogo** (menú): categorías, platos y maridajes.
2. **Pedido**: QR por mesa, carrito y pago simulado.
3. **Cocina**: visualización y gestión del estado de los pedidos.
4. **Administración**: gestión del contenido del menú.

El sistema se entrega como **PWA** monorestaurante.

## 3. Definiciones y roles

| Término | Definición |
|---|---|
| **Plato** | Producto del menú que puede pedirse (plato principal, bebida, postre, etc.). |
| **Categoría** | Agrupación de platos (entradas, principales, postres, bebidas). |
| **Maridaje** | Sugerencia de combinación asociada a un plato (ej. "este plato combina con vino X"). |
| **Mesa** | Ubicación física identificada por QR. |
| **Pedido** | Conjunto de ítems solicitados por un cliente, asociados a una mesa. |
| **Ítem** | Línea de un pedido: un plato con su cantidad. |
| **Pago demo** | Pago simulado, sin transacción monetaria real. |

Roles: **Cliente**, **Administrador**, **Cocina**.

## 4. Requisitos funcionales

### 4.1 Catálogo / Menú

| ID | Requisito | Prioridad |
|---|---|---|
| RF-01 | El sistema debe mostrar los platos agrupados por categorías. | Alta |
| RF-02 | Cada plato debe mostrar nombre, descripción, precio y, opcionalmente, una imagen. | Alta |
| RF-03 | Cada plato debe poder tener cero o más maridajes asociados. | Alta |
| RF-04 | Cada maridaje debe mostrar un texto descriptivo (y opcionalmente una bebida/plato sugerido). | Alta |
| RF-05 | El cliente debe poder buscar o filtrar platos por categoría. | Media |
| RF-06 | El menú debe ser consultable sin conexión (datos cacheados) en la PWA. | Media |

### 4.2 Identificación de mesa vía QR

| ID | Requisito | Prioridad |
|---|---|---|
| RF-10 | El QR debe contener una URL que identifique la mesa de forma única (`/mesa/{id}`). | Alta |
| RF-11 | El sistema debe asociar automáticamente el pedido a la mesa identificada en la URL. | Alta |
| RF-12 | Si no se puede identificar la mesa, el sistema debe permitir ingresarla manualmente (fallback). | Media |

### 4.3 Carrito y pedido

| ID | Requisito | Prioridad |
|---|---|---|
| RF-20 | El cliente debe poder agregar platos al carrito con cantidad. | Alta |
| RF-21 | El cliente debe poder modificar cantidades o quitar ítems del carrito. | Alta |
| RF-22 | El carrito debe mostrar el subtotal y el total. | Alta |
| RF-23 | El cliente debe poder confirmar el pedido sin necesidad de crear una cuenta. | Alta |

### 4.4 Pago simulado

| ID | Requisito | Prioridad |
|---|---|---|
| RF-30 | El sistema debe mostrar una pantalla de pago de demostración. | Alta |
| RF-31 | El pago demo no debe procesar dinero real ni almacenar datos reales de tarjetas. | Alta |
| RF-32 | Al confirmar el pago, el sistema debe crear el pedido y enviarlo a cocina. | Alta |

### 4.5 Cocina

| ID | Requisito | Prioridad |
|---|---|---|
| RF-40 | La cocina debe poder ver la lista de pedidos entrantes (no entregados). | Alta |
| RF-41 | Cada pedido debe mostrar su mesa, los ítems con cantidades y la hora. | Alta |
| RF-42 | La cocina debe poder cambiar el estado de un pedido. | Alta |
| RF-43 | El cliente debe poder ver el estado actual de su pedido. | Media |

### 4.6 Administración

| ID | Requisito | Prioridad |
|---|---|---|
| RF-50 | El administrador debe poder crear, editar y eliminar categorías. | Alta |
| RF-51 | El administrador debe poder crear, editar y eliminar platos. | Alta |
| RF-52 | El administrador debe poder asignar maridajes a los platos. | Alta |
| RF-53 | El administrador debe poder activar/desactivar la disponibilidad de un plato. | Media |
| RF-54 | El acceso a la administración debe requerir autenticación. | Alta |

### 4.7 PWA

| ID | Requisito | Prioridad |
|---|---|---|
| RF-60 | La aplicación debe ser instalable en el dispositivo (manifest). | Alta |
| RF-61 | La aplicación debe funcionar sin conexión al menos para consultar el menú (service worker + cache). | Media |

## 5. Requisitos no funcionales

| ID | Categoría | Requisito |
|---|---|---|
| RNF-01 | Usabilidad | Diseñada para móvil; flujo pedido completo ≤ 2 minutos. |
| RNF-02 | Rendimiento | Carga inicial del menú ≤ 3 s en conexión 4G estándar. |
| RNF-03 | Responsive | Correcta visualización en pantallas ≥ 360 px de ancho. |
| RNF-04 | Seguridad | Autenticación para panel admin; el pago demo no expone datos sensibles. |
| RNF-05 | Compatibilidad | Navegadores modernos (Chrome, Safari, Firefox, Edge) en móvil y escritorio. |
| RNF-06 | Escalabilidad | El diseño debe permitir múltiples restaurantes en iteraciones futuras. |
| RNF-07 | Mantenibilidad | Código modular y documentado según `03-SDD.md`. |

## 6. Reglas de negocio

| ID | Regla |
|---|---|
| RN-01 | Todo pedido debe estar asociado exactamente a una mesa. |
| RN-02 | Un plato puede pertenecer a una o más categorías y tener cero o más maridajes. |
| RN-03 | Un maridaje pertenece a un plato (sugerencia dirigida), no es un ítem independiente del carrito. |
| RN-04 | El ciclo de estados del pedido es: `recibido → en preparación → listo → entregado`. |
| RN-05 | El estado avanza de forma secuencial; una vez `entregado` el pedido se considera cerrado. |
| RN-06 | El precio se calcula como la suma de (precio unitario × cantidad) de cada ítem. |
| RN-07 | El pago demo siempre se considera exitoso (no valida fondos ni datos reales). |

## 7. Casos de uso

### CU-01 — Pedir desde una mesa
1. El cliente escanea el QR de su mesa.
2. El sistema carga el menú y asocia la mesa.
3. El cliente selecciona platos y cantidades.
4. El cliente revisa el carrito y confirma.
5. El cliente realiza el pago demo.
6. El sistema crea el pedido en estado `recibido` y lo envía a cocina.

### CU-02 — Gestionar un pedido en cocina
1. La cocina abre la vista de pedidos.
2. Ve el pedido entrante con mesa e ítems.
3. Cambia el estado conforme avanza (`recibido → en preparación → listo → entregado`).
4. El cliente visualiza el estado actualizado.

### CU-03 — Administrar el menú
1. El administrador inicia sesión.
2. Crea/edita categorías, platos y maridajes.
3. El menú público refleja los cambios.

## 8. Restricciones

- MVP monorestaurante; no multi-tenant en esta iteración.
- Pago 100% simulado; no hay integración con pasarela real.
- Sin cuentas de cliente obligatorias para pedir.
- La cocina requiere conexión a red para recibir pedidos en tiempo real.
- App nativa queda fuera del MVP; la PWA es la base.

## 9. Trazabilidad

Los requisitos funcionales se implementan y verifican según el diseño de `03-SDD.md`. Las propuestas de interfaz que materializan RNF-01 se documentan en `04-UX-UI.md`.

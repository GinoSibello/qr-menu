import { useEffect, useState } from "react";
import type { Order, OrderStatus } from "../types";
import { formatPrice, STATUS_FLOW } from "../types";
import { getActiveOrders, updateOrderStatus } from "../lib/api";
import { getAuth, clearAuth } from "../lib/auth";
import { onOrderCreated, onOrderStatus } from "../lib/ws";
import { RequireRole } from "../components/RequireRole";
import { OrderStatusBadge } from "../components/OrderStatusBadge";

function KitchenDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const auth = getAuth()!;

  async function load() {
    try {
      const res = await getActiveOrders(auth.token);
      setOrders(res.orders);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  useEffect(() => {
    load();
    const offCreated = onOrderCreated(() => load());
    const offStatus = onOrderStatus(() => load());
    const interval = setInterval(load, 15000);
    return () => {
      offCreated();
      offStatus();
      clearInterval(interval);
    };
  }, []);

  async function changeStatus(order: Order, status: OrderStatus) {
    try {
      await updateOrderStatus(auth.token, order.id, status);
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function nextStatus(current: OrderStatus): OrderStatus | null {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx < 0 || idx >= STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[idx + 1];
  }

  return (
    <div>
      <header className="app-header">
        <div className="app-header__inner">
          <span className="app-title">Cocina</span>
          <button className="btn btn-secondary btn-sm" onClick={clearAuth}>
            Salir
          </button>
        </div>
      </header>

      <main className="container" style={{ paddingBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 className="section-title">Pedidos activos</h2>
          <span className="badge">{orders.length}</span>
        </div>

        {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

        {orders.length === 0 ? (
          <div className="empty">No hay pedidos activos.</div>
        ) : (
          <div className="kitchen-grid">
            {orders.map((order) => {
              const next = nextStatus(order.status);
              return (
                <div key={order.id} className="card kitchen-card">
                  <div className="kitchen-card__head">
                    <span className="kitchen-card__title">
                      Pedido #{order.id} · Mesa {order.table.number}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <ul className="cart-list">
                    {order.items.map((item) => (
                      <li key={item.id} className="cart-item">
                        <span className="cart-item__name">
                          {item.quantity} × {item.dish.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="checkout-total">
                    <span>Total</span>
                    <strong>{formatPrice(order.total)}</strong>
                  </div>

                  {next && (
                    <button
                      className="btn btn-primary btn-block"
                      style={{ marginTop: 12 }}
                      onClick={() => changeStatus(order, next)}
                    >
                      {next === "preparing"
                        ? "Marcar en preparación"
                        : next === "ready"
                          ? "Marcar listo"
                          : "Marcar entregado"}
                    </button>
                  )}
                  {!next && (
                    <span className="muted" style={{ fontSize: 13 }}>
                      Pedido entregado.
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export function KitchenPage() {
  return (
    <RequireRole role="kitchen">
      <KitchenDashboard />
    </RequireRole>
  );
}

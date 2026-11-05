import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Order } from "../types";
import { formatPrice } from "../types";
import { getOrder } from "../lib/api";
import { onOrderStatus } from "../lib/ws";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { SiteHeader } from "../components/SiteHeader";
import { BottomNav } from "../components/BottomNav";

export function OrderStatusPage() {
  const { number, id } = useParams();
  const tableNumber = Number(number);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getOrder(Number(id))
      .then((res) => {
        if (active) setOrder(res.order);
      })
      .catch((e) => {
        if (active) setError((e as Error).message);
      });

    const off = onOrderStatus((updated) => {
      if (active && updated.id === Number(id)) {
        setOrder(updated);
      }
    });

    return () => {
      active = false;
      off();
    };
  }, [id]);

  if (error) {
    return (
      <div>
        <SiteHeader tableNumber={tableNumber} />
        <div className="empty">{error}</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <SiteHeader tableNumber={tableNumber} />
        <div className="empty">Cargando tu pedido…</div>
      </div>
    );
  }

  return (
    <div>
      <SiteHeader tableNumber={tableNumber} />

      <main className="container has-bottom-nav">
        <h1 className="page-title">Pedido #{order.id}</h1>

        <div className="card" style={{ textAlign: "center", marginTop: 16 }}>
          <h2 className="section-title" style={{ margin: "0 0 12px" }}>
            ¡Pedido confirmado!
          </h2>
          <OrderStatusBadge status={order.status} />
          <p className="muted" style={{ marginTop: 12 }}>
            Tu comida será llevada a la mesa. El estado se actualiza en vivo.
          </p>
        </div>

        <h2 className="section-title">Detalle</h2>
        <ul className="cart-list">
          {order.items.map((item) => (
            <li key={item.id} className="cart-item">
              <div className="cart-item__info">
                <span className="cart-item__name">{item.dish.name}</span>
                <span className="muted">
                  {item.quantity} × {formatPrice(item.unitPrice)}
                </span>
              </div>
              <span>{formatPrice(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="checkout-total" style={{ marginTop: 16 }}>
          <span>Total</span>
          <strong>{formatPrice(order.total)}</strong>
        </div>
      </main>

      <BottomNav tableNumber={tableNumber} />
    </div>
  );
}

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatPrice } from "../types";
import { useCart } from "../lib/cart";
import { createOrder } from "../lib/api";

export function CheckoutPage() {
  const { number } = useParams();
  const tableNumber = Number(number);
  const { items, setQuantity, remove, total, clear } = useCart();
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    setPaying(true);
    setError("");
    try {
      const { order } = await createOrder(
        tableNumber,
        items.map((i) => ({ dishId: i.dish.id, quantity: i.quantity })),
      );
      clear();
      navigate(`/mesa/${tableNumber}/pedido/${order.id}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPaying(false);
    }
  }

  return (
    <div>
      <header className="app-header">
        <div className="app-header__inner">
          <span className="app-title">Tu pedido</span>
          <span className="badge">Mesa {tableNumber}</span>
        </div>
      </header>

      <main className="container" style={{ paddingBottom: 40 }}>
        {items.length === 0 ? (
          <div className="empty">Tu carrito está vacío.</div>
        ) : (
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.dish.id} className="cart-item">
                <div className="cart-item__info">
                  <span className="cart-item__name">{item.dish.name}</span>
                  <span className="muted">
                    {formatPrice(item.dish.price)} c/u
                  </span>
                </div>
                <div className="cart-item__actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setQuantity(item.dish.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="cart-item__qty">{item.quantity}</span>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setQuantity(item.dish.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => remove(item.dish.id)}
                  >
                    Quitar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="card" style={{ marginTop: 16 }}>
          <div className="checkout-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          <div className="payment-demo">
            <span className="muted" style={{ fontSize: 13 }}>
              Pago de demostración — no se procesa dinero real.
            </span>
            <div className="payment-demo__row">
              <input className="input" placeholder="Nombre en la tarjeta" />
              <input className="input" placeholder="0000 0000 0000 0000" />
            </div>
            <div className="payment-demo__row">
              <input className="input" placeholder="MM/AA" />
              <input className="input" placeholder="CVV" />
            </div>
          </div>

          {error && (
            <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>
          )}

          <button
            className="btn btn-primary btn-block"
            style={{ marginTop: 12 }}
            onClick={handlePay}
            disabled={paying || items.length === 0}
          >
            {paying ? "Procesando…" : `Pagar ${formatPrice(total)}`}
          </button>
        </div>
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Category } from "../types";
import { formatPrice } from "../types";
import { getMenu, getTable } from "../lib/api";
import { useCart } from "../lib/cart";
import { DishCard } from "../components/DishCard";
import { SiteHeader } from "../components/SiteHeader";
import { BottomNav } from "../components/BottomNav";

export function MenuPage() {
  const { number } = useParams();
  const tableNumber = Number(number);
  const { count, total } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [menu] = await Promise.all([getMenu(), getTable(tableNumber)]);
        if (!active) return;
        setCategories(menu.categories);
      } catch (e) {
        if (active) setError((e as Error).message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [tableNumber]);

  if (loading) {
    return (
      <div>
        <SiteHeader tableNumber={tableNumber} />
        <div className="empty">Cargando menú…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <SiteHeader tableNumber={tableNumber} />
        <div className="empty">
          <p>{error}</p>
          <p className="muted">
            Escaneá el QR de tu mesa o ingresá el número de mesa en la URL.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SiteHeader tableNumber={tableNumber} />

      <main className="container has-bottom-nav">
        <h1 className="page-title">La carta</h1>

        {categories.length > 0 && (
          <nav className="pill-nav" aria-label="Categorías">
            {categories.map((cat) => (
              <a key={cat.id} className="pill" href={`#cat-${cat.id}`}>
                {cat.name}
              </a>
            ))}
          </nav>
        )}

        {categories.map((cat) => (
          <section key={cat.id} id={`cat-${cat.id}`} className="menu-section">
            <h2 className="section-title">{cat.name}</h2>
            {cat.dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </section>
        ))}

        {categories.length === 0 && (
          <div className="empty">No hay platos disponibles.</div>
        )}
      </main>

      {count > 0 && (
        <div className="cart-bar">
          <div className="cart-bar__info">
            <span className="cart-bar__count">{count}</span>
            <span className="cart-bar__total">{formatPrice(total)}</span>
          </div>
          <Link to={`/mesa/${tableNumber}/checkout`} className="btn btn-primary">
            Ver pedido
          </Link>
        </div>
      )}

      <BottomNav tableNumber={tableNumber} />
    </div>
  );
}

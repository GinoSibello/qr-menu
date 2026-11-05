import { Link, useLocation } from "react-router-dom";
import { useCart } from "../lib/cart";

export function BottomNav({ tableNumber }: { tableNumber: number }) {
  const { pathname } = useLocation();
  const { count } = useCart();

  const menuPath = `/mesa/${tableNumber}`;
  const checkoutPath = `${menuPath}/checkout`;

  const items = [
    { label: "Menú", to: menuPath, active: pathname === menuPath, count: 0 },
    {
      label: "Carrito",
      to: checkoutPath,
      active: pathname === checkoutPath,
      count,
    },
    { label: "Inicio", to: "/", active: false, count: 0 },
  ];

  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          className={`bottom-nav__item${item.active ? " is-active" : ""}`}
          aria-current={item.active ? "page" : undefined}
        >
          {item.label}
          {item.count > 0 && (
            <span className="bottom-nav__count">{item.count}</span>
          )}
        </Link>
      ))}
    </nav>
  );
}

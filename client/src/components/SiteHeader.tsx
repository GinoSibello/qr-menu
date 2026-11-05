import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface SiteHeaderProps {
  tableNumber?: number;
}

export function SiteHeader({ tableNumber }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Cierra el drawer al navegar a otra pantalla.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Bloquea el scroll de fondo y cierra con Escape mientras el drawer está abierto.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const menuPath = tableNumber ? `/mesa/${tableNumber}` : "/";
  const checkoutPath = tableNumber ? `/mesa/${tableNumber}/checkout` : null;

  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <Link to="/" className="wordmark">
            Menú<span>Digital</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {tableNumber && <span className="badge">Mesa {tableNumber}</span>}
            <button
              className="menu-toggle"
              aria-label="Abrir menú"
              onClick={() => setOpen(true)}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="drawer" role="dialog" aria-modal="true" aria-label="Navegación">
          <div className="drawer__head">
            <span className="wordmark">
              Menú<span>Digital</span>
            </span>
            <button
              className="drawer__close"
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className="drawer__main" aria-label="Principal">
            <Link to={menuPath}>Menú</Link>
            {checkoutPath && <Link to={checkoutPath}>Carrito</Link>}
            <Link to="/">Inicio</Link>
          </nav>

          <nav className="drawer__sub" aria-label="Personal">
            <span className="drawer__label">Personal</span>
            <Link to="/cocina">Cocina</Link>
            <Link to="/admin">Administración</Link>
            <Link to="/styles">Muestras de estilo</Link>
          </nav>
        </div>
      )}
    </>
  );
}

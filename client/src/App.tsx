import { Link, Route, Routes } from "react-router-dom";
import { MenuPage } from "./pages/MenuPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderStatusPage } from "./pages/OrderStatusPage";
import { KitchenPage } from "./pages/KitchenPage";
import { AdminPage } from "./pages/AdminPage";
import { StyleSamplesPage } from "./pages/StyleSamplesPage";
import { SiteHeader } from "./components/SiteHeader";

function Home() {
  return (
    <div>
      <SiteHeader />
      <main className="container" style={{ paddingBottom: 40 }}>
        <h1 className="page-title" style={{ marginTop: 24 }}>
          Menú digital por QR
        </h1>
        <p className="muted">
          Escaneá el QR de tu mesa para ver la carta, pedir y pagar. Acá tenés
          los accesos de demostración:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link to="/mesa/5" className="btn btn-primary">
            Mesa demo (cliente)
          </Link>
          <Link to="/cocina" className="btn btn-secondary">
            Cocina
          </Link>
          <Link to="/admin" className="btn btn-secondary">
            Administración
          </Link>
          <Link to="/styles" className="btn btn-secondary">
            Muestras de estilo
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mesa/:number" element={<MenuPage />} />
      <Route path="/mesa/:number/checkout" element={<CheckoutPage />} />
      <Route path="/mesa/:number/pedido/:id" element={<OrderStatusPage />} />
      <Route path="/cocina" element={<KitchenPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/styles" element={<StyleSamplesPage />} />
    </Routes>
  );
}

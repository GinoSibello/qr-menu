import type { CSSProperties } from "react";
import type { Dish } from "../types";
import { formatPrice } from "../types";

const sampleDish: Dish = {
  id: 1,
  name: "Ceviche de mariscos",
  description:
    "Mariscos frescos marinados en cítricos, cebolla morada y cilantro.",
  price: 14.5,
  imageUrl: null,
  available: true,
  categoryId: 1,
  pairings: [
    {
      id: 1,
      dishId: 1,
      title: "Sauvignon Blanc",
      description:
        "Su acidez cítrica resalta la frescura del pescado y limpia el paladar.",
      suggestedItem: "Sauvignon Blanc, copa",
    },
  ],
};

// Cada muestra define sus variables; D (vacía) hereda el tema activo de :root.
const themes: Record<
  string,
  { vars: CSSProperties; name: string; active?: boolean }
> = {
  A: {
    name: "A — Alta Cocina",
    vars: {
      "--bg": "#121212",
      "--surface": "#1e1e1e",
      "--surface-2": "#262626",
      "--primary": "#c9a227",
      "--accent": "#c9a227",
      "--accent-2": "#c9a227",
      "--text": "#f5f5f0",
      "--text-muted": "#a8a29e",
      "--border": "#333333",
      "--font-heading": '"Playfair Display", serif',
      "--font-body": '"Inter", system-ui, sans-serif',
    } as CSSProperties,
  },
  B: {
    name: "B — Cálido Familiar",
    vars: {
      "--bg": "#fff8f0",
      "--surface": "#ffffff",
      "--surface-2": "#fdeee0",
      "--primary": "#e76f51",
      "--accent": "#e76f51",
      "--accent-2": "#f4a261",
      "--text": "#3d2c2e",
      "--text-muted": "#8a6d6a",
      "--border": "#f1d8c8",
      "--font-heading": '"Fredoka", system-ui, sans-serif',
      "--font-body": '"Nunito", system-ui, sans-serif',
    } as CSSProperties,
  },
  C: {
    name: "C — Minimal Tech (anterior)",
    vars: {
      "--bg": "#ffffff",
      "--surface": "#f7f7f7",
      "--surface-2": "#eef0f2",
      "--primary": "#0ea5e9",
      "--accent": "#0ea5e9",
      "--accent-2": "#10b981",
      "--text": "#111827",
      "--text-muted": "#6b7280",
      "--border": "#e5e7eb",
      "--font-heading": '"Space Grotesk", "Inter", system-ui, sans-serif',
      "--font-body": '"Inter", system-ui, sans-serif',
    } as CSSProperties,
  },
  D: {
    name: "D — Tucker-inspirada (elegida)",
    active: true,
    vars: {},
  },
};

function SampleCard() {
  return (
    <div className="dish-card">
      <div className="dish-card__body">
        <div className="dish-card__row">
          <h3 className="dish-card__name">{sampleDish.name}</h3>
          <span className="dish-card__price">{formatPrice(sampleDish.price)}</span>
        </div>
        <p className="dish-card__desc">{sampleDish.description}</p>
        <div className="pairings">
          <span className="pairings__label">Maridajes sugeridos</span>
          {sampleDish.pairings.map((p) => (
            <div key={p.id} className="pairing">
              <div className="pairing__head">
                <span className="pairing__title">{p.title}</span>
                {p.suggestedItem && (
                  <span className="pairing__item">{p.suggestedItem}</span>
                )}
              </div>
              <p className="pairing__desc">{p.description}</p>
            </div>
          ))}
        </div>
        <button className="btn btn-primary btn-sm">Agregar</button>
      </div>
    </div>
  );
}

export function StyleSamplesPage() {
  return (
    <div>
      <header className="app-header">
        <div className="app-header__inner">
          <span className="app-title">Muestras de estilo</span>
        </div>
      </header>

      <main className="container" style={{ paddingBottom: 40 }}>
        <p className="muted">
          Vista previa de las propuestas de <code>docs/04-UX-UI.md</code>. La
          opción D es la que se usa en toda la app; A, B y C quedan como
          referencia.
        </p>

        {Object.entries(themes).map(([key, theme]) => (
          <section
            key={key}
            style={
              {
                ...theme.vars,
                borderRadius: "var(--radius)",
                padding: 16,
                marginBottom: 20,
                border: "1px solid var(--border)",
                background: "var(--bg)",
              } as CSSProperties
            }
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 19 }}>
                {theme.name}
              </h3>
              {theme.active && <span className="badge">Elegida</span>}
            </div>

            <div
              style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}
            >
              {[
                { label: "bg", color: "var(--bg)" },
                { label: "surface", color: "var(--surface)" },
                { label: "primary", color: "var(--primary)" },
                { label: "accent", color: "var(--accent)" },
                { label: "text", color: "var(--text)" },
              ].map((swatch) => (
                <div key={swatch.label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: swatch.color,
                    }}
                  />
                  <span className="muted" style={{ fontSize: 11 }}>
                    {swatch.label}
                  </span>
                </div>
              ))}
            </div>

            <SampleCard />
          </section>
        ))}
      </main>
    </div>
  );
}

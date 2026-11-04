import { useEffect, useState } from "react";
import type { Category, Dish } from "../types";
import { formatPrice } from "../types";
import {
  getAdminCategories,
  getAdminDishes,
  createCategory,
  deleteCategory,
  createDish,
  updateDish,
  deleteDish,
  createPairing,
  deletePairing,
} from "../lib/api";
import { getAuth, clearAuth } from "../lib/auth";
import { RequireRole } from "../components/RequireRole";

function AdminDashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [error, setError] = useState("");
  const auth = getAuth()!;

  const [catName, setCatName] = useState("");
  const [dishForm, setDishForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
  });
  const [pairingForm, setPairingForm] = useState<{
    dishId: number | null;
    title: string;
    description: string;
    suggestedItem: string;
  }>({ dishId: null, title: "", description: "", suggestedItem: "" });

  async function load() {
    try {
      const [cats, ds] = await Promise.all([
        getAdminCategories(auth.token),
        getAdminDishes(auth.token),
      ]);
      setCategories(cats.categories);
      setDishes(ds.dishes);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!catName.trim()) return;
    try {
      await createCategory(auth.token, { name: catName.trim() });
      setCatName("");
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleCreateDish(e: React.FormEvent) {
    e.preventDefault();
    if (!dishForm.name || !dishForm.categoryId) return;
    try {
      await createDish(auth.token, {
        name: dishForm.name,
        description: dishForm.description,
        price: Number(dishForm.price) || 0,
        categoryId: Number(dishForm.categoryId),
      });
      setDishForm({ name: "", description: "", price: "", categoryId: "" });
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleToggleDish(dish: Dish) {
    try {
      await updateDish(auth.token, dish.id, {
        name: dish.name,
        description: dish.description,
        price: dish.price,
        categoryId: dish.categoryId,
        available: !dish.available,
      });
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleDeleteDish(id: number) {
    try {
      await deleteDish(auth.token, id);
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleCreatePairing(e: React.FormEvent) {
    e.preventDefault();
    if (!pairingForm.dishId || !pairingForm.title.trim()) return;
    try {
      await createPairing(auth.token, pairingForm.dishId, {
        title: pairingForm.title,
        description: pairingForm.description,
        suggestedItem: pairingForm.suggestedItem || undefined,
      });
      setPairingForm({ dishId: null, title: "", description: "", suggestedItem: "" });
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleDeletePairing(id: number) {
    try {
      await deletePairing(auth.token, id);
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div>
      <header className="app-header">
        <div className="app-header__inner">
          <span className="app-title">Administración</span>
          <button className="btn btn-secondary btn-sm" onClick={clearAuth}>
            Salir
          </button>
        </div>
      </header>

      <main className="container" style={{ paddingBottom: 40 }}>
        {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

        <h2 className="section-title">Categorías</h2>
        <form className="card" onSubmit={handleCreateCategory}>
          <div className="field">
            <label className="label">Nueva categoría</label>
            <input
              className="input"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="Ej. Entradas"
            />
          </div>
          <button className="btn btn-primary" type="submit">
            Agregar
          </button>
        </form>

        <h2 className="section-title">Platos</h2>
        <form className="card" onSubmit={handleCreateDish}>
          <div className="field">
            <label className="label">Nombre</label>
            <input
              className="input"
              value={dishForm.name}
              onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label className="label">Descripción</label>
            <input
              className="input"
              value={dishForm.description}
              onChange={(e) =>
                setDishForm({ ...dishForm, description: e.target.value })
              }
            />
          </div>
          <div className="field">
            <label className="label">Precio</label>
            <input
              className="input"
              type="number"
              step="0.01"
              value={dishForm.price}
              onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })}
            />
          </div>
          <div className="field">
            <label className="label">Categoría</label>
            <select
              className="input"
              value={dishForm.categoryId}
              onChange={(e) =>
                setDishForm({ ...dishForm, categoryId: e.target.value })
              }
            >
              <option value="">Seleccionar…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" type="submit">
            Agregar plato
          </button>
        </form>

        <div style={{ marginTop: 16 }}>
          {categories.map((cat) => {
            const catDishes = dishes.filter((d) => d.categoryId === cat.id);
            return (
              <div key={cat.id} style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: 17 }}>{cat.name}</h3>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={async () => {
                      await deleteCategory(auth.token, cat.id);
                      await load();
                    }}
                  >
                    Eliminar
                  </button>
                </div>

                {catDishes.map((dish) => (
                  <div key={dish.id} className="card admin-dish">
                    <div className="admin-dish__head">
                      <div>
                        <strong>{dish.name}</strong>
                        <span className="muted" style={{ marginLeft: 8 }}>
                          {formatPrice(dish.price)}
                        </span>
                        {!dish.available && (
                          <span className="badge" style={{ marginLeft: 8, background: "var(--text-muted)" }}>
                            No disponible
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleToggleDish(dish)}
                        >
                          {dish.available ? "Desactivar" : "Activar"}
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteDish(dish.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>

                    <div className="pairings" style={{ marginTop: 8 }}>
                      <span className="pairings__label">Maridajes</span>
                      {dish.pairings.map((p) => (
                        <div key={p.id} className="pairing">
                          <div className="pairing__head">
                            <span className="pairing__title">{p.title}</span>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeletePairing(p.id)}
                            >
                              Quitar
                            </button>
                          </div>
                          <p className="pairing__desc">{p.description}</p>
                        </div>
                      ))}
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() =>
                          setPairingForm({
                            dishId: dish.id,
                            title: "",
                            description: "",
                            suggestedItem: "",
                          })
                        }
                      >
                        + Agregar maridaje
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {pairingForm.dishId !== null && (
          <form className="card" style={{ marginTop: 16 }} onSubmit={handleCreatePairing}>
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>Nuevo maridaje</h3>
            <div className="field">
              <label className="label">Título (bebida/combinación)</label>
              <input
                className="input"
                value={pairingForm.title}
                onChange={(e) =>
                  setPairingForm({ ...pairingForm, title: e.target.value })
                }
              />
            </div>
            <div className="field">
              <label className="label">Descripción</label>
              <input
                className="input"
                value={pairingForm.description}
                onChange={(e) =>
                  setPairingForm({ ...pairingForm, description: e.target.value })
                }
              />
            </div>
            <div className="field">
              <label className="label">Ítem sugerido</label>
              <input
                className="input"
                value={pairingForm.suggestedItem}
                onChange={(e) =>
                  setPairingForm({ ...pairingForm, suggestedItem: e.target.value })
                }
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary" type="submit">
                Guardar
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => setPairingForm({ ...pairingForm, dishId: null })}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export function AdminPage() {
  return (
    <RequireRole role="admin">
      <AdminDashboard />
    </RequireRole>
  );
}

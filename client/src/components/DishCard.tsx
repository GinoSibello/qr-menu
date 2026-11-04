import type { Dish } from "../types";
import { formatPrice } from "../types";
import { useCart } from "../lib/cart";

export function DishCard({ dish }: { dish: Dish }) {
  const { add } = useCart();

  return (
    <article className="dish-card">
      {dish.imageUrl && (
        <img className="dish-card__img" src={dish.imageUrl} alt={dish.name} />
      )}
      <div className="dish-card__body">
        <div className="dish-card__row">
          <h3 className="dish-card__name">{dish.name}</h3>
          <span className="dish-card__price">{formatPrice(dish.price)}</span>
        </div>
        {dish.description && (
          <p className="dish-card__desc">{dish.description}</p>
        )}

        {dish.pairings.length > 0 && (
          <div className="pairings">
            <span className="pairings__label">Maridajes sugeridos</span>
            {dish.pairings.map((p) => (
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
        )}

        <button
          className="btn btn-primary btn-sm dish-card__add"
          onClick={() => add(dish)}
        >
          Agregar
        </button>
      </div>
    </article>
  );
}

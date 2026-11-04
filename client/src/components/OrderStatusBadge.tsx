import type { OrderStatus } from "../types";
import { STATUS_META } from "../types";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className="status-badge"
      style={{ background: meta.color, color: "#fff" }}
    >
      {meta.label}
    </span>
  );
}

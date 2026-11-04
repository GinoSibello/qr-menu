export interface Pairing {
  id: number;
  dishId: number;
  title: string;
  description: string;
  suggestedItem: string | null;
}

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  available: boolean;
  categoryId: number;
  pairings: Pairing[];
}

export interface Category {
  id: number;
  name: string;
  order: number;
  dishes: Dish[];
}

export interface Table {
  id: number;
  number: number;
  qrCode: string;
}

export type OrderStatus = "received" | "preparing" | "ready" | "delivered";

export interface OrderItem {
  id: number;
  orderId: number;
  dishId: number;
  quantity: number;
  unitPrice: number;
  dish: Dish;
}

export interface Order {
  id: number;
  tableId: number;
  status: OrderStatus;
  total: number;
  createdAt: string;
  items: OrderItem[];
  table: Table;
}

export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

export const STATUS_META: Record<OrderStatus, { label: string; color: string }> = {
  received: { label: "Recibido", color: "#0ea5e9" },
  preparing: { label: "En preparación", color: "#f59e0b" },
  ready: { label: "Listo", color: "#10b981" },
  delivered: { label: "Entregado", color: "#6b7280" },
};

export const STATUS_FLOW: OrderStatus[] = [
  "received",
  "preparing",
  "ready",
  "delivered",
];

export function formatPrice(n: number): string {
  return `$${n.toFixed(2)}`;
}

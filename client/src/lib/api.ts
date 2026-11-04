import type {
  Category,
  Dish,
  Order,
  OrderStatus,
  Table,
  AuthUser,
} from "../types";

const API_BASE = "/api";

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Error ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

export function getMenu(): Promise<{ categories: Category[] }> {
  return request("/menu");
}

export function getTable(number: number): Promise<{ table: Table }> {
  return request(`/tables/${number}`);
}

export function createOrder(
  tableNumber: number,
  items: { dishId: number; quantity: number }[],
): Promise<{ order: Order }> {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify({ tableNumber, items }),
  });
}

export function getActiveOrders(token: string): Promise<{ orders: Order[] }> {
  return request("/orders?status=active", {
    headers: authHeaders(token),
  });
}

export function getOrder(id: number): Promise<{ order: Order }> {
  return request(`/orders/${id}`);
}

export function updateOrderStatus(
  token: string,
  id: number,
  status: OrderStatus,
): Promise<{ order: Order }> {
  return request(`/orders/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
}

export function login(
  username: string,
  password: string,
): Promise<{ token: string; user: AuthUser }> {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function getAdminCategories(
  token: string,
): Promise<{ categories: Category[] }> {
  return request("/categories", { headers: authHeaders(token) });
}

export function getAdminDishes(token: string): Promise<{ dishes: Dish[] }> {
  return request("/dishes", { headers: authHeaders(token) });
}

export function createCategory(
  token: string,
  data: { name: string; order?: number },
): Promise<{ category: Category }> {
  return request("/categories", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export function deleteCategory(
  token: string,
  id: number,
): Promise<void> {
  return request(`/categories/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export function createDish(
  token: string,
  data: {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    available?: boolean;
    imageUrl?: string;
  },
): Promise<{ dish: Dish }> {
  return request("/dishes", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export function updateDish(
  token: string,
  id: number,
  data: {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    available?: boolean;
    imageUrl?: string;
  },
): Promise<{ dish: Dish }> {
  return request(`/dishes/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export function deleteDish(token: string, id: number): Promise<void> {
  return request(`/dishes/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export function createPairing(
  token: string,
  dishId: number,
  data: { title: string; description: string; suggestedItem?: string },
): Promise<{ pairing: unknown }> {
  return request(`/dishes/${dishId}/pairings`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export function deletePairing(token: string, id: number): Promise<void> {
  return request(`/pairings/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

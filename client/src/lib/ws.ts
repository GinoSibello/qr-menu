import { io, type Socket } from "socket.io-client";
import type { Order } from "../types";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io({ path: "/socket.io", transports: ["websocket", "polling"] });
  }
  return socket;
}

export function onOrderCreated(cb: (order: Order) => void): () => void {
  getSocket().on("order:created", cb);
  return () => getSocket().off("order:created", cb);
}

export function onOrderStatus(cb: (order: Order) => void): () => void {
  getSocket().on("order:status", cb);
  return () => getSocket().off("order:status", cb);
}

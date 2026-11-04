import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

let io: Server | null = null;

export function initWs(httpServer: HttpServer): Server {
  io = new Server(httpServer, { cors: { origin: "*" } });
  io.on("connection", (socket) => {
    console.log("cliente conectado:", socket.id);
  });
  return io;
}

export function emitOrderCreated(order: unknown) {
  io?.emit("order:created", order);
}

export function emitOrderStatus(order: unknown) {
  io?.emit("order:status", order);
}

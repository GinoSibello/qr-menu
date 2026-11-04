import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireRole } from "../auth";
import { emitOrderCreated, emitOrderStatus } from "../ws";

export const ordersRouter = Router();

const orderItemSchema = z.object({
  dishId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  tableNumber: z.number().int().positive(),
  items: z.array(orderItemSchema).min(1),
});

const statusSchema = z.object({
  status: z.enum(["received", "preparing", "ready", "delivered"]),
});

const orderInclude = {
  items: { include: { dish: true } },
  table: true,
} as const;

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

ordersRouter.post("/", async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.message });
  }

  const { tableNumber, items } = parsed.data;
  const table = await prisma.table.findUnique({ where: { number: tableNumber } });
  if (!table) {
    return res.status(404).json({ error: "Mesa no encontrada" });
  }

  const dishes = await prisma.dish.findMany({
    where: { id: { in: items.map((i) => i.dishId) } },
  });
  const dishMap = new Map(dishes.map((d) => [d.id, d]));

  for (const item of items) {
    const dish = dishMap.get(item.dishId);
    if (!dish || !dish.available) {
      return res.status(400).json({ error: `Plato no disponible: ${item.dishId}` });
    }
  }

  const total = items.reduce(
    (sum, item) => sum + dishMap.get(item.dishId)!.price * item.quantity,
    0,
  );

  const order = await prisma.order.create({
    data: {
      tableId: table.id,
      status: "received",
      total: round2(total),
      items: {
        create: items.map((item) => ({
          dishId: item.dishId,
          quantity: item.quantity,
          unitPrice: dishMap.get(item.dishId)!.price,
        })),
      },
    },
    include: orderInclude,
  });

  emitOrderCreated(order);
  res.status(201).json({ order });
});

ordersRouter.get("/", requireRole("kitchen", "admin"), async (req, res) => {
  const { status } = req.query;
  const where =
    status === "active" ? { status: { not: "delivered" as const } } : undefined;
  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: orderInclude,
  });
  res.json({ orders });
});

ordersRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Id inválido" });
  }
  const order = await prisma.order.findUnique({
    where: { id },
    include: orderInclude,
  });
  if (!order) {
    return res.status(404).json({ error: "Pedido no encontrado" });
  }
  res.json({ order });
});

ordersRouter.patch("/:id/status", requireRole("kitchen", "admin"), async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Id inválido" });
  }
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Estado inválido" });
  }
  const order = await prisma.order.update({
    where: { id },
    data: { status: parsed.data.status },
    include: orderInclude,
  });
  emitOrderStatus(order);
  res.json({ order });
});

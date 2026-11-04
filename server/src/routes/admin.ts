import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireRole } from "../auth";

export const adminRouter = Router();
adminRouter.use(requireRole("admin"));

const categorySchema = z.object({
  name: z.string().min(1),
  order: z.number().int().optional(),
});

const dishSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(""),
  price: z.number().positive(),
  imageUrl: z.string().optional(),
  available: z.boolean().optional(),
  categoryId: z.number().int().positive(),
});

const pairingSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(""),
  suggestedItem: z.string().optional(),
});

adminRouter.get("/categories", async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { dishes: { include: { pairings: true } } },
  });
  res.json({ categories });
});

adminRouter.get("/dishes", async (_req, res) => {
  const dishes = await prisma.dish.findMany({
    orderBy: { name: "asc" },
    include: { category: true, pairings: true },
  });
  res.json({ dishes });
});

adminRouter.post("/categories", async (req, res) => {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const category = await prisma.category.create({
    data: { name: parsed.data.name, order: parsed.data.order ?? 0 },
  });
  res.status(201).json({ category });
});

adminRouter.put("/categories/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const category = await prisma.category.update({
    where: { id },
    data: { name: parsed.data.name, order: parsed.data.order },
  });
  res.json({ category });
});

adminRouter.delete("/categories/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.category.delete({ where: { id } });
  res.status(204).end();
});

adminRouter.post("/dishes", async (req, res) => {
  const parsed = dishSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const dish = await prisma.dish.create({ data: parsed.data });
  res.status(201).json({ dish });
});

adminRouter.put("/dishes/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = dishSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const dish = await prisma.dish.update({ where: { id }, data: parsed.data });
  res.json({ dish });
});

adminRouter.delete("/dishes/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.dish.delete({ where: { id } });
  res.status(204).end();
});

adminRouter.post("/dishes/:id/pairings", async (req, res) => {
  const dishId = Number(req.params.id);
  const parsed = pairingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  const pairing = await prisma.pairing.create({
    data: { ...parsed.data, dishId },
  });
  res.status(201).json({ pairing });
});

adminRouter.delete("/pairings/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.pairing.delete({ where: { id } });
  res.status(204).end();
});

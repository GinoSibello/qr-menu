import { Router } from "express";
import { prisma } from "../db";

export const menuRouter = Router();

menuRouter.get("/", async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      dishes: {
        where: { available: true },
        include: { pairings: true },
        orderBy: { name: "asc" },
      },
    },
  });
  res.json({ categories });
});

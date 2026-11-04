import { Router } from "express";
import { prisma } from "../db";

export const tablesRouter = Router();

tablesRouter.get("/:number", async (req, res) => {
  const number = Number(req.params.number);
  if (Number.isNaN(number)) {
    return res.status(400).json({ error: "Número de mesa inválido" });
  }
  const table = await prisma.table.findUnique({ where: { number } });
  if (!table) {
    return res.status(404).json({ error: "Mesa no encontrada" });
  }
  res.json({ table });
});

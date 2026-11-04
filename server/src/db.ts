import { Prisma, PrismaClient } from "@prisma/client";

// Serializa Decimal como número (en lugar de string) en JSON.
(Prisma.Decimal.prototype as unknown as { toJSON: () => number }).toJSON =
  function (this: Prisma.Decimal) {
    return this.toNumber();
  };

export const prisma = new PrismaClient();

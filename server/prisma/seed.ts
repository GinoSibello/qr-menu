import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.pairing.deleteMany();
  await prisma.dish.deleteMany();
  await prisma.category.deleteMany();
  await prisma.table.deleteMany();
  await prisma.user.deleteMany();

  const tables = Array.from({ length: 12 }, (_, i) => i + 1).map((n) => ({
    number: n,
    qrCode: `/mesa/${n}`,
  }));
  for (const t of tables) {
    await prisma.table.create({ data: t });
  }

  const adminHash = await bcrypt.hash("admin123", 10);
  const kitchenHash = await bcrypt.hash("cocina123", 10);
  await prisma.user.createMany({
    data: [
      { username: "admin", passwordHash: adminHash, role: "admin" },
      { username: "cocina", passwordHash: kitchenHash, role: "kitchen" },
    ],
  });

  const entradas = await prisma.category.create({
    data: { name: "Entradas", order: 1 },
  });
  const principales = await prisma.category.create({
    data: { name: "Principales", order: 2 },
  });
  const postres = await prisma.category.create({
    data: { name: "Postres", order: 3 },
  });
  const bebidas = await prisma.category.create({
    data: { name: "Bebidas", order: 4 },
  });

  const ceviche = await prisma.dish.create({
    data: {
      name: "Ceviche de mariscos",
      description:
        "Mariscos frescos marinados en cítricos, cebolla morada y cilantro.",
      price: 14.5,
      categoryId: entradas.id,
      pairings: {
        create: [
          {
            title: "Sauvignon Blanc",
            description:
              "Su acidez cítrica resalta la frescura del pescado y limpia el paladar.",
            suggestedItem: "Sauvignon Blanc, botella",
          },
          {
            title: "Pisco Sour",
            description:
              "El contraste dulce-ácido del pisco acompaña la acidez del ceviche.",
            suggestedItem: "Pisco Sour clásico",
          },
        ],
      },
    },
  });

  const pulpo = await prisma.dish.create({
    data: {
      name: "Pulpo a la parrilla",
      description: "Pulpo tierno a la brasa con puré de papas y aceite de oliva.",
      price: 19.0,
      categoryId: principales.id,
      pairings: {
        create: [
          {
            title: "Albariño",
            description:
              "Vino blanco atlántico que potencia las notas ahumadas del pulpo.",
            suggestedItem: "Albariño, copa",
          },
        ],
      },
    },
  });

  await prisma.dish.create({
    data: {
      name: "Risotto de hongos",
      description: "Arroz cremoso con mix de hongos de temporada y parmesano.",
      price: 16.0,
      categoryId: principales.id,
      pairings: {
        create: [
          {
            title: "Pinot Noir",
            description:
              "Su cuerpo medio y notas terrosas dialogan con los hongos.",
            suggestedItem: "Pinot Noir, copa",
          },
        ],
      },
    },
  });

  await prisma.dish.create({
    data: {
      name: "Tiramisú",
      description: "Clásico italiano con café, mascarpone y cacao.",
      price: 7.5,
      categoryId: postres.id,
      pairings: {
        create: [
          {
            title: "Espresso",
            description: "El café refuerza el aroma del tiramisú.",
            suggestedItem: "Espresso doble",
          },
        ],
      },
    },
  });

  await prisma.dish.create({
    data: {
      name: "Agua mineral",
      description: "Agua con o sin gas, 500 ml.",
      price: 2.5,
      categoryId: bebidas.id,
    },
  });

  console.log("Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`;

const WINE = img("1510812431401-41d2bd2722f3");

type PairingSeed = {
  title: string;
  description: string;
  suggestedItem?: string;
};

type DishSeed = {
  name: string;
  description: string;
  price: number;
  image: string;
  pairings: PairingSeed[];
};

const menuData: { name: string; order: number; dishes: DishSeed[] }[] = [
  {
    name: "Entradas",
    order: 1,
    dishes: [
      {
        name: "Ceviche de mariscos",
        description:
          "Mariscos frescos marinados en cítricos, cebolla morada y cilantro.",
        price: 14.5,
        image: img("1563379926898-05f4575a45d8"),
        pairings: [
          {
            title: "Sauvignon Blanc",
            description:
              "Su acidez cítrica resalta la frescura del pescado y limpia el paladar.",
            suggestedItem: "Sauvignon Blanc, copa",
          },
        ],
      },
      {
        name: "Gambas al ajillo",
        description:
          "Gambas salteadas en aceite de oliva con ajo laminado y guindilla.",
        price: 12.0,
        image: img("1559339352-11d035aa65de"),
        pairings: [
          {
            title: "Albariño",
            description: "Blanco atlántico que equilibra el ajo y el aceite.",
            suggestedItem: "Albariño, copa",
          },
        ],
      },
      {
        name: "Boquerones en vinagre",
        description: "Boquerones marinados en vinagre con ajo y perejil.",
        price: 9.5,
        image: img("1519708227418-c8fd9a32b7a2"),
        pairings: [
          {
            title: "Manzanilla",
            description: "La salinidad de la manzanilla realza el vinagre.",
            suggestedItem: "Manzanilla, copa",
          },
        ],
      },
      {
        name: "Gazpacho andaluz",
        description: "Sopa fría de tomate, pimiento y pepino con AOVE.",
        price: 8.0,
        image: img("1546069901-ba9599a7e63c"),
        pairings: [],
      },
      {
        name: "Calamares a la romana",
        description: "Calamares tiernos rebozados, con limón y alioli.",
        price: 11.5,
        image: img("1504674900247-0877df9cc836"),
        pairings: [
          {
            title: "Verdejo",
            description: "Vino fresco que acompaña la fritura sin taparla.",
            suggestedItem: "Verdejo, copa",
          },
        ],
      },
    ],
  },
  {
    name: "Pescados y Mariscos",
    order: 2,
    dishes: [
      {
        name: "Paella de mariscos",
        description: "Arroz seco con mejillones, gambas, calamar y azafrán.",
        price: 24.0,
        image: img("1563379926898-05f4575a45d8"),
        pairings: [
          {
            title: "Rosado de Navarra",
            description: "Frutal y fresco, ideal para el arroz de marisco.",
            suggestedItem: "Rosado, copa",
          },
        ],
      },
      {
        name: "Bacalao al pil-pil",
        description:
          "Lomo de bacalao con su emulsión de aceite, ajo y guindilla.",
        price: 22.0,
        image: img("1519708227418-c8fd9a32b7a2"),
        pairings: [
          {
            title: "Txakoli",
            description: "Blanco ligero y ácido típico del País Vasco.",
            suggestedItem: "Txakoli, copa",
          },
        ],
      },
      {
        name: "Sardinas a la plancha",
        description: "Sardinas frescas a la brasa con sal gruesa y limón.",
        price: 13.5,
        image: img("1544025162-d76694265947"),
        pairings: [
          {
            title: "Verdejo",
            description: "Su frescura corta la grasa natural de la sardina.",
            suggestedItem: "Verdejo, copa",
          },
        ],
      },
      {
        name: "Merluza a la vasca",
        description: "Merluza en salsa verde con almejas y guisantes.",
        price: 18.5,
        image: img("1519708227418-c8fd9a32b7a2"),
        pairings: [
          {
            title: "Godello",
            description: "Blanco con cuerpo que acompaña la salsa verde.",
            suggestedItem: "Godello, copa",
          },
        ],
      },
      {
        name: "Dorada a la sal",
        description: "Dorada entera horneada en costra de sal, jugosa.",
        price: 21.0,
        image: img("1544025162-d76694265947"),
        pairings: [
          {
            title: "Chardonnay",
            description: "Estructura media para un pescado blanco al horno.",
            suggestedItem: "Chardonnay, copa",
          },
        ],
      },
      {
        name: "Arroz negro con sepia",
        description: "Arroz meloso teñido con tinta de calamar y alioli.",
        price: 19.5,
        image: img("1559339352-11d035aa65de"),
        pairings: [
          {
            title: "Cava Brut",
            description: "Las burbujas limpian la intensidad de la tinta.",
            suggestedItem: "Cava, copa",
          },
        ],
      },
    ],
  },
  {
    name: "Principales",
    order: 3,
    dishes: [
      {
        name: "Pulpo a la parrilla",
        description:
          "Pulpo tierno a la brasa con puré de papas y aceite de oliva.",
        price: 19.0,
        image: img("1559339352-11d035aa65de"),
        pairings: [
          {
            title: "Albariño",
            description: "Potencia las notas ahumadas del pulpo.",
            suggestedItem: "Albariño, copa",
          },
        ],
      },
      {
        name: "Risotto de hongos",
        description: "Arroz cremoso con mix de hongos y parmesano.",
        price: 16.0,
        image: img("1476124369491-e7addf5db371"),
        pairings: [
          {
            title: "Pinot Noir",
            description: "Notas terrosas que dialogan con los hongos.",
            suggestedItem: "Pinot Noir, copa",
          },
        ],
      },
      {
        name: "Tortilla española",
        description: "Tortilla de patata jugosa con cebolla caramelizada.",
        price: 9.0,
        image: img("1482049016688-2d3e1b311543"),
        pairings: [],
      },
      {
        name: "Carrillada al vino tinto",
        description: "Carrillada de cerdo estofada con reducción de Rioja.",
        price: 17.5,
        image: img("1544025162-d76694265947"),
        pairings: [
          {
            title: "Rioja Reserva",
            description: "Tinto con cuerpo para el estofado de carne.",
            suggestedItem: "Rioja, copa",
          },
        ],
      },
    ],
  },
  {
    name: "Postres",
    order: 4,
    dishes: [
      {
        name: "Tiramisú",
        description: "Clásico italiano con café, mascarpone y cacao.",
        price: 7.5,
        image: img("1565958011703-44f9829ba187"),
        pairings: [
          {
            title: "Espresso",
            description: "El café refuerza el aroma del tiramisú.",
            suggestedItem: "Espresso doble",
          },
        ],
      },
      {
        name: "Crema catalana",
        description: "Crema con caramelo crujiente y canela.",
        price: 6.5,
        image: img("1551024506-0bccd828d307"),
        pairings: [],
      },
      {
        name: "Flan de huevo",
        description: "Flan casero con caramelo líquido.",
        price: 5.5,
        image: img("1565958011703-44f9829ba187"),
        pairings: [],
      },
    ],
  },
  {
    name: "Bebidas",
    order: 5,
    dishes: [
      {
        name: "Agua mineral",
        description: "Agua con o sin gas, 500 ml.",
        price: 2.5,
        image: img("1497534446932-c925b458314e"),
        pairings: [],
      },
      {
        name: "Sangría de la casa",
        description: "Vino tinto con frutas de temporada, jarra.",
        price: 6.0,
        image: img("1560717845-968823efbee1"),
        pairings: [],
      },
      {
        name: "Vino blanco Albariño",
        description: "Copa de vino blanco atlántico.",
        price: 5.0,
        image: WINE,
        pairings: [],
      },
      {
        name: "Vino tinto Rioja",
        description: "Copa de vino tinto con crianza.",
        price: 5.5,
        image: WINE,
        pairings: [],
      },
      {
        name: "Vino blanco Sauvignon Blanc",
        description: "Copa de vino blanco cítrico y fresco.",
        price: 5.5,
        image: WINE,
        pairings: [],
      },
      {
        name: "Vino Manzanilla",
        description: "Copa de vino generoso de Sanlúcar.",
        price: 4.5,
        image: WINE,
        pairings: [],
      },
      {
        name: "Vino Verdejo",
        description: "Copa de vino blanco de Rueda.",
        price: 5.0,
        image: WINE,
        pairings: [],
      },
      {
        name: "Vino rosado",
        description: "Copa de vino rosado frutal.",
        price: 5.0,
        image: WINE,
        pairings: [],
      },
      {
        name: "Vino Txakoli",
        description: "Copa de vino blanco vasco ligeramente espumoso.",
        price: 5.5,
        image: WINE,
        pairings: [],
      },
      {
        name: "Vino Godello",
        description: "Copa de vino blanco de Valdeorras.",
        price: 5.5,
        image: WINE,
        pairings: [],
      },
      {
        name: "Vino Chardonnay",
        description: "Copa de vino blanco con cuerpo.",
        price: 5.0,
        image: WINE,
        pairings: [],
      },
      {
        name: "Cava Brut",
        description: "Copa de espumoso seco.",
        price: 5.5,
        image: img("1560717845-968823efbee1"),
        pairings: [],
      },
      {
        name: "Vino tinto Pinot Noir",
        description: "Copa de vino tinto elegante y sedoso.",
        price: 5.5,
        image: WINE,
        pairings: [],
      },
      {
        name: "Espresso",
        description: "Café expreso doble.",
        price: 2.0,
        image: img("1512568400610-62da28bc8a13"),
        pairings: [],
      },
    ],
  },
];

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

  const createdDishes: { id: number; price: number }[] = [];

  for (const cat of menuData) {
    const category = await prisma.category.create({
      data: { name: cat.name, order: cat.order },
    });
    for (const d of cat.dishes) {
      const dish = await prisma.dish.create({
        data: {
          name: d.name,
          description: d.description,
          price: d.price,
          imageUrl: d.image,
          categoryId: category.id,
          pairings: { create: d.pairings },
        },
      });
      createdDishes.push({ id: dish.id, price: dish.price.toNumber() });
    }
  }

  const statuses = ["received", "preparing", "ready"];
  for (let i = 0; i < 20; i++) {
    const tableNumber = (i % 12) + 1;
    const table = await prisma.table.findUnique({ where: { number: tableNumber } });
    if (!table) continue;

    const itemCount = 1 + (i % 3);
    const used = new Set<number>();
    const picked: { dishId: number; quantity: number }[] = [];
    for (let j = 0; j < itemCount; j++) {
      const idx = (i * 7 + j * 5) % createdDishes.length;
      if (used.has(idx)) continue;
      used.add(idx);
      picked.push({
        dishId: createdDishes[idx].id,
        quantity: 1 + ((i + j) % 2),
      });
    }

    const total = picked.reduce((sum, p) => {
      const dish = createdDishes.find((d) => d.id === p.dishId)!;
      return sum + dish.price * p.quantity;
    }, 0);

    await prisma.order.create({
      data: {
        tableId: table.id,
        status: statuses[i % 3],
        total: Math.round(total * 100) / 100,
        createdAt: new Date(Date.now() - (20 - i) * 60000),
        items: {
          create: picked.map((p) => {
            const dish = createdDishes.find((d) => d.id === p.dishId)!;
            return { dishId: p.dishId, quantity: p.quantity, unitPrice: dish.price };
          }),
        },
      },
    });
  }

  console.log(
    `Seed completado: ${menuData.reduce((n, c) => n + c.dishes.length, 0)} platos, 20 pedidos.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

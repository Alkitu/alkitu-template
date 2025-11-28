// Cargar variables de entorno
require("dotenv").config({ path: ".env.local" });

const { PrismaClient } = require("@prisma/client");

async function main() {
  console.log(
    "DATABASE_URL:",
    process.env.DATABASE_URL ? "Definida" : "No definida"
  );

  const prisma = new PrismaClient();
  try {
    console.log("Consultando códigos de idioma en la base de datos...");
    const codes = await prisma.code.findMany({
      where: { type: "lang" },
    });
    console.log("Resultado:");
    console.log(JSON.stringify(codes, null, 2));
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

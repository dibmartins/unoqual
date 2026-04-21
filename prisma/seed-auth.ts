import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("admin123", salt);

  const org = await prisma.organization.upsert({
    where: { cnpj: "00.000.000/0000-00" },
    update: {},
    create: {
      name: "Unoqual Admin",
      cnpj: "00.000.000/0000-00",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@unoqual.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@unoqual.com",
      password: hashedPassword,
      role: "ADMIN",
      organizationId: org.id,
    },
  });

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

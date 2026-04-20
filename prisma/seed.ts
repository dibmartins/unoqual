import { PrismaClient } from "@prisma/client";
import { fakerPT_BR as fakerData } from "@faker-js/faker";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // 1. Create a default Organization
  const org = await prisma.organization.upsert({
    where: { cnpj: "12345678000199" },
    update: {},
    create: {
      name: "Hospital de Teste Central",
      cnpj: "12345678000199",
    },
  });

  console.log(`Created organization: ${org.name}`);

  // 2. Create some Facilities
  const facility1 = await prisma.facility.upsert({
    where: { id: fakerData.string.uuid() }, // This is not ideal for upsert, but for demo it's ok
    update: {},
    create: {
      name: "Unidade Norte",
      organizationId: org.id,
      size: "MEDIUM",
      bedCapacity: 150,
    },
  });

  console.log(`Created facility: ${facility1.name}`);

  // 3. Create some Departments
  const dept1 = await prisma.department.create({
    data: {
      name: "UTI Adulto - Bloco A",
      facilityId: facility1.id,
      bedCount: 20,
      averageOccupancyRate: 0.85,
    },
  });

  console.log(`Created department: ${dept1.name}`);

  console.log("Seed finished successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

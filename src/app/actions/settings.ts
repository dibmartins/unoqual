"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createFacility(data: { name: string; address?: string }) {
  try {
    // Busca a primeira organização (ou cria uma default)
    let org = await prisma.organization.findFirst();
    if (!org) {
      org = await prisma.organization.create({
        data: { name: "Organização Padrão", cnpj: "00000000000000" }
      });
    }

    await prisma.facility.create({
      data: {
        name: data.name,
        organizationId: org.id,
        size: "MEDIUM", // Valor padrão
        bedCapacity: 0, // Valor padrão
      },
    });
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar unidade:", error);
    return { success: false, error: "Falha ao criar a Unidade de Saúde." };
  }
}

export async function createDepartment(data: { facilityId: string; name: string; classification?: string; hasNursing?: boolean }) {
  try {
    await prisma.department.create({
      data: {
        facilityId: data.facilityId,
        name: data.name,
        classification: data.classification,
        hasNursing: data.hasNursing ?? true,
      },
    });
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar setor:", error);
    return { success: false, error: "Falha ao criar o Setor." };
  }
}

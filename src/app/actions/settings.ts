"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getOrganization() {
  try {
    let org = await prisma.organization.findFirst({
      include: {
        _count: {
          select: { facilities: true, users: true }
        }
      }
    });
    
    if (!org) {
      org = await prisma.organization.create({
        data: { 
          name: "Nova Organização", 
          cnpj: "00.000.000/0000-00",
        },
        include: {
          _count: {
            select: { facilities: true, users: true }
          }
        }
      });
    }
    return org;
  } catch (error) {
    console.error("Erro ao buscar organização:", error);
    return null;
  }
}

export async function updateOrganization(id: string, data: { name: string; cnpj: string; address?: string; phone?: string }) {
  try {
    await prisma.organization.update({
      where: { id },
      data,
    });
    revalidatePath("/settings/organization");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar organização:", error);
    return { success: false, error: "Falha ao atualizar os dados da organização." };
  }
}

export async function getUsers() {
  try {
    const org = await prisma.organization.findFirst();
    if (!org) return [];
    
    return await prisma.user.findMany({
      where: { organizationId: org.id },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
}

export async function createUser(data: { name: string; email: string; passwordHash: string; role: "ADMIN" | "GESTOR" | "CONSULTOR" }) {
  try {
    const org = await prisma.organization.findFirst();
    if (!org) throw new Error("Organização não encontrada");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.passwordHash, salt);

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        organizationId: org.id,
      },
    });
    
    revalidatePath("/settings/users");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    if ((error as any).code === "P2002") {
      return { success: false, error: "Este e-mail já está em uso." };
    }
    return { success: false, error: "Falha ao criar o usuário." };
  }
}

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

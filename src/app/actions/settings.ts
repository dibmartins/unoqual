"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppError } from "@/lib/errors";

async function getSessionOrThrow() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw AppError.unauthorized("Não autenticado");
  return session;
}

export async function getOrganization() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;

    return await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
      include: {
        _count: {
          select: { facilities: true, users: true }
        }
      }
    });
  } catch (error) {
    console.error("Erro ao buscar organização:", error);
    return null;
  }
}

export async function updateOrganization(id: string, data: { name: string; cnpj: string; address?: string; phone?: string }) {
  try {
    const session = await getSessionOrThrow();
    
    // Security: Ensure user belongs to the organization they are updating
    if (session.user.organizationId !== id) {
      throw new AppError("Acesso negado", "FORBIDDEN", 403);
    }

    await prisma.organization.update({
      where: { id },
      data,
    });
    revalidatePath("/settings/organization");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar organização:", error);
    const message = error instanceof AppError ? error.message : "Falha ao atualizar os dados da organização.";
    return { success: false, error: message };
  }
}

export async function getUsers() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return [];
    
    return await prisma.user.findMany({
      where: { organizationId: session.user.organizationId },
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
    const session = await getSessionOrThrow();

    // Only ADMIN/GESTOR should create users
    if (session.user.role === "CONSULTOR") {
      throw new AppError("Permissão insuficiente", "FORBIDDEN", 403);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.passwordHash, salt);

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        organizationId: session.user.organizationId,
      },
    });
    
    revalidatePath("/settings/users");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    if ((error as any).code === "P2002") {
      return { success: false, error: "Este e-mail já está em uso." };
    }
    const message = error instanceof AppError ? error.message : "Falha ao criar o usuário.";
    return { success: false, error: message };
  }
}

export async function createFacility(data: { name: string; address?: string }) {
  try {
    const session = await getSessionOrThrow();

    await prisma.facility.create({
      data: {
        name: data.name,
        organizationId: session.user.organizationId,
        size: "MEDIUM", // Valor padrão
        bedCapacity: 0, // Valor padrão
      },
    });
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar unidade:", error);
    const message = error instanceof AppError ? error.message : "Falha ao criar a Unidade de Saúde.";
    return { success: false, error: message };
  }
}

export async function createDepartment(data: { facilityId: string; name: string; classification?: string; hasNursing?: boolean }) {
  try {
    const session = await getSessionOrThrow();

    // Verify facility belongs to organization
    const facility = await prisma.facility.findFirst({
      where: { id: data.facilityId, organizationId: session.user.organizationId }
    });
    if (!facility) throw AppError.notFound("Unidade não encontrada nesta organização");

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
    const message = error instanceof AppError ? error.message : "Falha ao criar o Setor.";
    return { success: false, error: message };
  }
}

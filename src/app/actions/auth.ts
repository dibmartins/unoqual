"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function register(data: {
  userName: string;
  email: string;
  passwordHash: string;
  orgName: string;
  orgCnpj: string;
}) {
  try {
    // 1. Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, error: "Este e-mail já está em uso." };
    }

    // 2. Verificar se a organização já existe (pelo CNPJ)
    const existingOrg = await prisma.organization.findUnique({
      where: { cnpj: data.orgCnpj },
    });

    if (existingOrg) {
      return { success: false, error: "Este CNPJ já está cadastrado." };
    }

    // 3. Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.passwordHash, salt);

    // 4. Criação atômica de Organização e Usuário (GESTOR)
    await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: data.orgName,
          cnpj: data.orgCnpj,
        },
      });

      await tx.user.create({
        data: {
          name: data.userName,
          email: data.email,
          password: hashedPassword,
          role: "GESTOR",
          organizationId: org.id,
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Erro no registro:", error);
    return { success: false, error: "Falha ao realizar o cadastro. Tente novamente." };
  }
}

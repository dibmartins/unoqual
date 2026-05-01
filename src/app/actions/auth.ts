"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { sendPasswordResetEmail } from "@/lib/mail";

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

export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Por segurança, não informamos que o e-mail não existe
      return { success: true };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hora

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });

    await sendPasswordResetEmail(email, token);

    return { success: true };
  } catch (error) {
    console.error("Erro na solicitação de recuperação de senha:", error);
    return { success: false, error: "Erro ao processar solicitação. Tente novamente." };
  }
}

export async function resetPassword(token: string, passwordHash: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return { success: false, error: "Token inválido ou expirado." };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordHash, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro na redefinição de senha:", error);
    return { success: false, error: "Falha ao redefinir senha. Tente novamente." };
  }
}

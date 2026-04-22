"use server";

import { revalidatePath } from "next/cache";
import { StaffingService, StaffingSaveData } from "@/services/staffing.service";
import { ActionResponse, AppError } from "@/lib/errors";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function getSessionOrThrow() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw AppError.unauthorized("Não autenticado");
  return session;
}

/**
 * Salva o cálculo de dimensionamento no banco de dados.
 */
export async function saveStaffingAction(data: Omit<StaffingSaveData, "userId" | "organizationId">): Promise<ActionResponse<{ inspectionId: string }>> {
  try {
    const session = await getSessionOrThrow();
    
    const inspection = await StaffingService.saveStaffing({
      ...data,
      userId: session.user.id,
      organizationId: session.user.organizationId
    });

    revalidatePath("/dashboard");
    revalidatePath("/staffing/new");

    return { success: true, data: { inspectionId: inspection.id } };
  } catch (error) {
    const message = error instanceof AppError ? error.message : "Falha ao salvar o dimensionamento";
    return { success: false, error: message };
  }
}

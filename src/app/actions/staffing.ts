"use server";

import { revalidatePath } from "next/cache";
import { StaffingService, StaffingSaveData } from "@/services/staffing.service";
import { ActionResponse, AppError } from "@/lib/errors";

/**
 * Salva o cálculo de dimensionamento no banco de dados.
 */
export async function saveStaffingAction(data: StaffingSaveData): Promise<ActionResponse<{ inspectionId: string }>> {
  try {
    const inspection = await StaffingService.saveStaffing(data);

    revalidatePath("/dashboard");
    revalidatePath("/staffing/new");

    return { success: true, data: { inspectionId: inspection.id } };
  } catch (error) {
    const message = error instanceof AppError ? error.message : "Falha ao salvar o dimensionamento";
    return { success: false, error: message };
  }
}

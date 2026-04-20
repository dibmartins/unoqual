"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface StaffingSaveData {
  facilityId: string;
  departmentId: string;
  weeklyHours: string;
  pcm: number;
  pci: number;
  pcad: number;
  pcsi: number;
  pcit: number;
  currentNurses: number;
  currentTechs: number;
  calculations: {
    the: number;
    qp: number;
    requiredNurses: number;
    requiredTechs: number;
  };
}

/**
 * Salva o cálculo de dimensionamento no banco de dados.
 * Como o esquema exige uma Inspection, criamos uma automaticamente para agrupar o cálculo.
 */
export async function saveStaffingAction(data: StaffingSaveData) {
  try {
    // 1. Criar a Inspeção (Placeholder para Auditoria de Dimensionamento)
    // Usaremos um inspectorId fixo por enquanto até a integração total do Auth
    const inspection = await prisma.inspection.create({
      data: {
        facilityId: data.facilityId,
        inspectorId: "system-staffing-audit",
        status: "completed",
        completedAt: new Date(),
      },
    });

    // 2. Salvar os cálculos para Enfermeiros e Técnicos (Duas entradas no banco)
    const nurseGap = data.currentNurses - data.calculations.requiredNurses;
    const techGap = data.currentTechs - data.calculations.requiredTechs;

    await prisma.staffingCalculation.createMany({
      data: [
        {
          inspectionId: inspection.id,
          departmentId: data.departmentId,
          professionalClass: "Nurse",
          totalNursingHours: data.calculations.the,
          requiredStaffing: data.calculations.requiredNurses,
          currentStaffing: data.currentNurses,
          staffingGap: nurseGap,
        },
        {
          inspectionId: inspection.id,
          departmentId: data.departmentId,
          professionalClass: "Technician",
          totalNursingHours: data.calculations.the,
          requiredStaffing: data.calculations.requiredTechs,
          currentStaffing: data.currentTechs,
          staffingGap: techGap,
        },
      ],
    });

    revalidatePath("/dashboard");
    revalidatePath("/staffing/new");

    return { success: true, inspectionId: inspection.id };
  } catch (error) {
    console.error("Error saving staffing calculation:", error);
    return { success: false, error: "Falha ao salvar o dimensionamento. Verifique os dados e tente novamente." };
  }
}

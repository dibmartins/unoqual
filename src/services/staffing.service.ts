import prisma from "@/lib/prisma";
import { AppError } from "@/lib/errors";

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

export class StaffingService {
  /**
   * Salva o cálculo de dimensionamento no banco de dados.
   * Cria uma Inspeção automaticamente para agrupar o cálculo.
   */
  static async saveStaffing(data: StaffingSaveData) {
    try {
      return await prisma.$transaction(async (tx) => {
        // 1. Criar a Inspeção (Placeholder para Auditoria de Dimensionamento)
        const inspection = await tx.inspection.create({
          data: {
            facilityId: data.facilityId,
            inspectorId: "system-staffing-audit",
            status: "completed",
            completedAt: new Date(),
          },
        });

        // 2. Salvar os cálculos para Enfermeiros e Técnicos
        const nurseGap = data.currentNurses - data.calculations.requiredNurses;
        const techGap = data.currentTechs - data.calculations.requiredTechs;

        await tx.staffingCalculation.createMany({
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

        return inspection;
      });
    } catch (error) {
      console.error("Error in saveStaffing service:", error);
      throw new AppError("Falha ao salvar o dimensionamento no banco de dados.");
    }
  }
}

import prisma from "@/lib/prisma";
import { AppError } from "@/lib/errors";

export interface StaffingSaveData {
  inspectionId?: string;
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
  userId: string;
  organizationId: string;
}

export class StaffingService {
  /**
   * Logs an action to the AuditLog table.
   */
  private static async logAudit(data: {
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    newValues?: any;
  }) {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        newValues: data.newValues,
      },
    });
  }

  /**
   * Salva o cálculo de dimensionamento no banco de dados.
   * Cria uma Inspeção automaticamente para agrupar o cálculo.
   */
  static async saveStaffing(data: StaffingSaveData) {
    try {
      // Security: Validate facility belongs to organization
      const facility = await prisma.facility.findFirst({
        where: { id: data.facilityId, organizationId: data.organizationId }
      });
      if (!facility) throw AppError.notFound("Unidade não encontrada nesta organização.");

      return await prisma.$transaction(async (tx) => {
        let inspectionId = data.inspectionId;
        if (!inspectionId) {
          const inspection = await tx.inspection.create({
            data: {
              facilityId: data.facilityId,
              inspectorId: data.userId,
              status: "completed",
              completedAt: new Date(),
              createdById: data.userId,
            },
          });
          inspectionId = inspection.id;
        }

        if (data.inspectionId) {
          await tx.staffingCalculation.deleteMany({
            where: {
              inspectionId: data.inspectionId,
              departmentId: data.departmentId,
            }
          });
        }

        // 2. Salvar os cálculos para Enfermeiros e Técnicos
        const nurseGap = data.currentNurses - data.calculations.requiredNurses;
        const techGap = data.currentTechs - data.calculations.requiredTechs;

        await tx.staffingCalculation.createMany({
          data: [
            {
              inspectionId: inspectionId,
              departmentId: data.departmentId,
              professionalClass: "Nurse",
              totalNursingHours: data.calculations.the,
              requiredStaffing: data.calculations.requiredNurses,
              currentStaffing: data.currentNurses,
              staffingGap: nurseGap,
              createdById: data.userId,
            },
            {
              inspectionId: inspectionId,
              departmentId: data.departmentId,
              professionalClass: "Technician",
              totalNursingHours: data.calculations.the,
              requiredStaffing: data.calculations.requiredTechs,
              currentStaffing: data.currentTechs,
              staffingGap: techGap,
              createdById: data.userId,
            },
          ],
        });

        if (data.inspectionId) {
          // Salvar os inputs na metadata do InspectionEntry correspondente
          const entry = await tx.inspectionEntry.findFirst({
            where: {
              inspectionId: data.inspectionId,
              departmentId: data.departmentId,
              type: "staffing",
              checklistItemKey: "Enfermagem"
            }
          });

          if (entry) {
            const currentMetadata = entry.metadata ? (typeof entry.metadata === 'object' ? entry.metadata : JSON.parse(entry.metadata as string)) : {};
            await tx.inspectionEntry.update({
              where: { id: entry.id },
              data: {
                metadata: {
                  ...currentMetadata,
                  calculationInputs: {
                    weeklyHours: data.weeklyHours,
                    pcm: data.pcm,
                    pci: data.pci,
                    pcad: data.pcad,
                    pcsi: data.pcsi,
                    pcit: data.pcit,
                    currentNurses: data.currentNurses,
                    currentTechs: data.currentTechs
                  }
                }
              }
            });
          }
        }

        await this.logAudit({
          userId: data.userId,
          action: "SAVE_STAFFING_CALCULATION",
          entityType: "Inspection",
          entityId: inspectionId,
          newValues: { departmentId: data.departmentId, calculations: data.calculations }
        });

        return { id: inspectionId };
      });
    } catch (error) {
      console.error("Error in saveStaffing service:", error);
      throw error instanceof AppError ? error : new AppError("Falha ao salvar o dimensionamento no banco de dados.");
    }
  }
}

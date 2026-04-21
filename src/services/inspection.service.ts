import prisma from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { ComplianceStatus } from "@prisma/client";

export interface UpsertInspectionInput {
  id?: string;
  facilityId: string;
  inspectorId: string;
}

export interface UpsertEntryInput {
  inspectionId: string;
  departmentId?: string;
  type: string;
  checklistItemKey: string;
  complianceStatus: ComplianceStatus;
  metadata?: any;
  observation?: string;
}

export interface CreateInspectionCompleteInput {
  facilityId: string;
  departmentId?: string;
  inspectorId: string;
  entries: { checklistItemKey: string; complianceStatus: ComplianceStatus; observation?: string }[];
}

export class InspectionService {
  /**
   * Legado: Cria uma inspeção completa com múltiplos itens de uma vez.
   */
  static async createInspectionComplete(data: CreateInspectionCompleteInput) {
    try {
      return await prisma.$transaction(async (tx) => {
        const ins = await tx.inspection.create({
          data: {
            facilityId: data.facilityId,
            inspectorId: data.inspectorId,
            status: "completed",
            completedAt: new Date(),
          },
        });

        if (data.entries.length > 0) {
          await tx.inspectionEntry.createMany({
            data: data.entries.map(e => ({
              inspectionId: ins.id,
              departmentId: data.departmentId,
              type: "checklist",
              checklistItemKey: e.checklistItemKey,
              complianceStatus: e.complianceStatus,
              observation: e.observation,
            })),
          });
        }

        return ins;
      });
    } catch (error) {
      console.error("Failed to create complete inspection:", error);
      throw new AppError("Erro ao criar inspeção completa");
    }
  }

  /**
   * Creates or updates the base Inspection record.
   */
  static async upsertInspection(data: UpsertInspectionInput) {
    try {
      if (data.id) {
        return await prisma.inspection.update({
          where: { id: data.id },
          data: {
            facilityId: data.facilityId,
            inspectorId: data.inspectorId,
          },
        });
      } else {
        return await prisma.inspection.create({
          data: {
            facilityId: data.facilityId,
            inspectorId: data.inspectorId,
            status: "draft",
          },
        });
      }
    } catch (error) {
      console.error("Error in upsertInspection service:", error);
      throw new AppError("Falha ao salvar inspeção base no banco de dados.");
    }
  }

  /**
   * Adds or updates an entry (checklist or dimensionamento) in the inspection.
   */
  static async upsertEntry(data: UpsertEntryInput) {
    try {
      const existing = await prisma.inspectionEntry.findFirst({
        where: {
          inspectionId: data.inspectionId,
          departmentId: data.departmentId || null,
          checklistItemKey: data.checklistItemKey,
        }
      });

      if (existing) {
        return await prisma.inspectionEntry.update({
          where: { id: existing.id },
          data: {
            complianceStatus: data.complianceStatus,
            metadata: data.metadata || {},
            observation: data.observation,
            type: data.type,
          },
        });
      } else {
        return await prisma.inspectionEntry.create({
          data: {
            inspectionId: data.inspectionId,
            departmentId: data.departmentId,
            type: data.type,
            checklistItemKey: data.checklistItemKey,
            complianceStatus: data.complianceStatus,
            metadata: data.metadata || {},
            observation: data.observation,
          },
        });
      }
    } catch (error) {
      console.error("Error in upsertEntry service:", error);
      throw new AppError("Falha ao salvar item da inspeção.");
    }
  }

  static async deleteEntry(entryId: string) {
    try {
      return await prisma.inspectionEntry.delete({
        where: { id: entryId },
      });
    } catch (error) {
      console.error("Error in deleteEntry service:", error);
      throw AppError.notFound("Item não encontrado ou já removido.");
    }
  }

  static async finalizeInspection(id: string) {
    try {
      return await prisma.inspection.update({
        where: { id },
        data: {
          status: "completed",
          completedAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Error in finalizeInspection service:", error);
      throw new AppError("Falha ao finalizar inspeção.");
    }
  }

  static async getInspectionWithEntries(id: string) {
    const inspection = await prisma.inspection.findUnique({
      where: { id },
      include: {
        entries: {
          include: { department: true }
        },
        facility: {
          include: { departments: true }
        }
      }
    });

    if (!inspection) throw AppError.notFound("Inspeção não encontrada.");
    return inspection;
  }
}

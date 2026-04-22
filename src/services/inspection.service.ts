import prisma from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { ComplianceStatus } from "@prisma/client";

export interface UpsertInspectionInput {
  id?: string;
  facilityId: string;
  inspectorId: string;
  userId: string;
  organizationId: string;
}

export interface UpsertEntryInput {
  inspectionId: string;
  departmentId?: string;
  type: string;
  checklistItemKey: string;
  complianceStatus: ComplianceStatus;
  metadata?: any;
  observation?: string;
  userId: string;
  organizationId: string;
}

export interface CreateInspectionCompleteInput {
  facilityId: string;
  departmentId?: string;
  inspectorId: string;
  entries: { checklistItemKey: string; complianceStatus: ComplianceStatus; observation?: string }[];
  userId: string;
  organizationId: string;
}

export class InspectionService {
  /**
   * Logs an action to the AuditLog table.
   */
  private static async logAudit(data: {
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    previousValues?: any;
    newValues?: any;
  }) {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        previousValues: data.previousValues,
        newValues: data.newValues,
      },
    });
  }

  /**
   * Legado: Cria uma inspeção completa com múltiplos itens de uma vez.
   */
  static async createInspectionComplete(data: CreateInspectionCompleteInput) {
    try {
      // Security: Validate facility belongs to organization
      const facility = await prisma.facility.findFirst({
        where: { id: data.facilityId, organizationId: data.organizationId }
      });
      if (!facility) throw AppError.notFound("Unidade não encontrada nesta organização.");

      return await prisma.$transaction(async (tx) => {
        const ins = await tx.inspection.create({
          data: {
            facilityId: data.facilityId,
            inspectorId: data.inspectorId,
            status: "completed",
            completedAt: new Date(),
            createdById: data.userId,
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
              createdById: data.userId,
            })),
          });
        }

        await this.logAudit({
          userId: data.userId,
          action: "CREATE_INSPECTION_COMPLETE",
          entityType: "Inspection",
          entityId: ins.id,
          newValues: { facilityId: data.facilityId, entriesCount: data.entries.length }
        });

        return ins;
      });
    } catch (error) {
      console.error("Failed to create complete inspection:", error);
      throw error instanceof AppError ? error : new AppError("Erro ao criar inspeção completa");
    }
  }

  /**
   * Creates or updates the base Inspection record.
   */
  static async upsertInspection(data: UpsertInspectionInput) {
    try {
      // Security: Validate facility belongs to organization
      const facility = await prisma.facility.findFirst({
        where: { id: data.facilityId, organizationId: data.organizationId }
      });
      if (!facility) throw AppError.notFound("Unidade não encontrada nesta organização.");

      if (data.id) {
        // Multi-tenancy check
        const existing = await prisma.inspection.findFirst({
          where: { id: data.id, facility: { organizationId: data.organizationId } }
        });
        if (!existing) throw AppError.notFound("Inspeção não encontrada.");

        const updated = await prisma.inspection.update({
          where: { id: data.id },
          data: {
            facilityId: data.facilityId,
            inspectorId: data.inspectorId,
            updatedById: data.userId,
          },
        });

        await this.logAudit({
          userId: data.userId,
          action: "UPDATE_INSPECTION",
          entityType: "Inspection",
          entityId: data.id,
          previousValues: { facilityId: existing.facilityId, inspectorId: existing.inspectorId },
          newValues: { facilityId: data.facilityId, inspectorId: data.inspectorId }
        });

        return updated;
      } else {
        const created = await prisma.inspection.create({
          data: {
            facilityId: data.facilityId,
            inspectorId: data.inspectorId,
            status: "draft",
            createdById: data.userId,
          },
        });

        await this.logAudit({
          userId: data.userId,
          action: "CREATE_INSPECTION",
          entityType: "Inspection",
          entityId: created.id,
          newValues: { facilityId: data.facilityId, inspectorId: data.inspectorId }
        });

        return created;
      }
    } catch (error) {
      console.error("Error in upsertInspection service:", error);
      throw error instanceof AppError ? error : new AppError("Falha ao salvar inspeção base no banco de dados.");
    }
  }

  /**
   * Adds or updates an entry (checklist or dimensionamento) in the inspection.
   */
  static async upsertEntry(data: UpsertEntryInput) {
    try {
      // Multi-tenancy check: Inspection must belong to organization
      const inspection = await prisma.inspection.findFirst({
        where: { id: data.inspectionId, facility: { organizationId: data.organizationId } }
      });
      if (!inspection) throw AppError.notFound("Inspeção não encontrada.");

      const existing = await prisma.inspectionEntry.findFirst({
        where: {
          inspectionId: data.inspectionId,
          departmentId: data.departmentId || null,
          checklistItemKey: data.checklistItemKey,
        }
      });

      if (existing) {
        const updated = await prisma.inspectionEntry.update({
          where: { id: existing.id },
          data: {
            complianceStatus: data.complianceStatus,
            metadata: data.metadata || {},
            observation: data.observation,
            type: data.type,
          },
        });

        await this.logAudit({
          userId: data.userId,
          action: "UPDATE_ENTRY",
          entityType: "InspectionEntry",
          entityId: existing.id,
          previousValues: { complianceStatus: existing.complianceStatus, observation: existing.observation },
          newValues: { complianceStatus: data.complianceStatus, observation: data.observation }
        });

        return updated;
      } else {
        const created = await prisma.inspectionEntry.create({
          data: {
            inspectionId: data.inspectionId,
            departmentId: data.departmentId,
            type: data.type,
            checklistItemKey: data.checklistItemKey,
            complianceStatus: data.complianceStatus,
            metadata: data.metadata || {},
            observation: data.observation,
            createdById: data.userId,
          },
        });

        await this.logAudit({
          userId: data.userId,
          action: "CREATE_ENTRY",
          entityType: "InspectionEntry",
          entityId: created.id,
          newValues: { checklistItemKey: data.checklistItemKey, complianceStatus: data.complianceStatus }
        });

        return created;
      }
    } catch (error) {
      console.error("Error in upsertEntry service:", error);
      throw error instanceof AppError ? error : new AppError("Falha ao salvar item da inspeção.");
    }
  }

  static async deleteEntry(entryId: string, userId: string, organizationId: string) {
    try {
      // Multi-tenancy check
      const entry = await prisma.inspectionEntry.findFirst({
        where: { id: entryId, inspection: { facility: { organizationId } } }
      });
      if (!entry) throw AppError.notFound("Item não encontrado nesta organização.");

      const deleted = await prisma.inspectionEntry.delete({
        where: { id: entryId },
      });

      await this.logAudit({
        userId,
        action: "DELETE_ENTRY",
        entityType: "InspectionEntry",
        entityId: entryId,
        previousValues: deleted
      });

      return deleted;
    } catch (error) {
      console.error("Error in deleteEntry service:", error);
      throw error instanceof AppError ? error : AppError.notFound("Item não encontrado ou já removido.");
    }
  }

  static async finalizeInspection(id: string, userId: string, organizationId: string) {
    try {
      // Multi-tenancy check
      const existing = await prisma.inspection.findFirst({
        where: { id, facility: { organizationId } }
      });
      if (!existing) throw AppError.notFound("Inspeção não encontrada.");

      const updated = await prisma.inspection.update({
        where: { id },
        data: {
          status: "completed",
          completedAt: new Date(),
          updatedById: userId,
        },
      });

      await this.logAudit({
        userId,
        action: "FINALIZE_INSPECTION",
        entityType: "Inspection",
        entityId: id,
        newValues: { status: "completed" }
      });

      return updated;
    } catch (error) {
      console.error("Error in finalizeInspection service:", error);
      throw error instanceof AppError ? error : new AppError("Falha ao finalizar inspeção.");
    }
  }

  static async getInspectionWithEntries(id: string, organizationId: string) {
    const inspection = await prisma.inspection.findFirst({
      where: { id, facility: { organizationId } },
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

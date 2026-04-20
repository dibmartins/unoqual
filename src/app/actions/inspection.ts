"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ComplianceStatus } from "@prisma/client";

interface UpsertInspectionInput {
  id?: string;
  facilityId: string;
  inspectorId: string;
}

/**
 * Creates or updates the base Inspection record.
 */
export async function upsertInspectionAction(data: UpsertInspectionInput) {
  try {
    if (data.id) {
      const inspection = await prisma.inspection.update({
        where: { id: data.id },
        data: {
          facilityId: data.facilityId,
          inspectorId: data.inspectorId,
        },
      });
      return { success: true, id: inspection.id };
    } else {
      const inspection = await prisma.inspection.create({
        data: {
          facilityId: data.facilityId,
          inspectorId: data.inspectorId,
          status: "draft",
        },
      });
      return { success: true, id: inspection.id };
    }
  } catch (error) {
    console.error("Failed to upsert inspection:", error);
    return { success: false, error: "Falha ao salvar inspeção base" };
  }
}

interface UpsertEntryInput {
  inspectionId: string;
  departmentId?: string;
  type: string;
  checklistItemKey: string;
  complianceStatus: ComplianceStatus;
  metadata?: any;
  observation?: string;
}

/**
 * Adds or updates an entry (checklist or dimensionamento) in the inspection.
 */
export async function upsertEntryAction(data: UpsertEntryInput) {
  try {
    const existing = await prisma.inspectionEntry.findFirst({
      where: {
        inspectionId: data.inspectionId,
        departmentId: data.departmentId || null,
        checklistItemKey: data.checklistItemKey,
      }
    });

    if (existing) {
      await prisma.inspectionEntry.update({
        where: { id: existing.id },
        data: {
          complianceStatus: data.complianceStatus,
          metadata: data.metadata || {},
          observation: data.observation,
          type: data.type,
        },
      });
    } else {
      await prisma.inspectionEntry.create({
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

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to upsert entry:", error);
    return { success: false, error: "Falha ao salvar item da inspeção" };
  }
}

export async function deleteEntryAction(entryId: string) {
  try {
    await prisma.inspectionEntry.delete({
      where: { id: entryId },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete entry:", error);
    return { success: false, error: "Falha ao remover item" };
  }
}

export async function finalizeInspectionAction(id: string) {
  try {
    await prisma.inspection.update({
      where: { id },
      data: {
        status: "completed",
        completedAt: new Date(),
      },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to finalize inspection:", error);
    return { success: false, error: "Falha ao finalizar inspeção" };
  }
}

export async function getFacilities() {
  return prisma.facility.findMany({
    include: {
      departments: true,
    },
    orderBy: { name: "asc" }
  });
}

export async function getInspectionWithEntries(id: string) {
  return prisma.inspection.findUnique({
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
}

export async function getRecentInspections() {
  return prisma.inspection.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      facility: true,
      _count: {
        select: { entries: true },
      },
    },
  });
}

/**
 * Legado: Cria uma inspeção completa com múltiplos itens de uma vez.
 */
export async function createInspection(data: {
  facilityId: string;
  departmentId?: string;
  inspectorId: string;
  entries: { checklistItemKey: string; complianceStatus: ComplianceStatus; observation?: string }[];
}) {
  try {
    const result = await prisma.$transaction(async (tx) => {
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

    revalidatePath("/dashboard");
    return { success: true, id: result.id };
  } catch (error) {
    console.error("Failed to create complete inspection:", error);
    return { success: false, error: "Erro ao criar inspeção completa" };
  }
}

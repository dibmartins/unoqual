"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { InspectionService, UpsertInspectionInput, UpsertEntryInput, CreateInspectionCompleteInput } from "@/services/inspection.service";
import { ActionResponse, AppError } from "@/lib/errors";
import { requireUserSession } from "@/lib/session";

export async function createInspection(data: Omit<CreateInspectionCompleteInput, "userId" | "organizationId">): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await requireUserSession();
    const result = await InspectionService.createInspectionComplete({
      ...data,
      userId: session.user.id,
      organizationId: session.user.organizationId
    });
    revalidatePath("/dashboard");
    return { success: true, data: { id: result.id } };
  } catch (error) {
    const message = error instanceof AppError ? error.message : "Erro ao criar inspeção completa";
    return { success: false, error: message };
  }
}

/**
 * Creates or updates the base Inspection record.
 */
export async function upsertInspectionAction(data: Omit<UpsertInspectionInput, "userId" | "organizationId">): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await requireUserSession();
    const inspection = await InspectionService.upsertInspection({
      ...data,
      userId: session.user.id,
      organizationId: session.user.organizationId
    });
    return { success: true, data: { id: inspection.id } };
  } catch (error) {
    const message = error instanceof AppError ? error.message : "Falha ao salvar inspeção";
    return { success: false, error: message };
  }
}

/**
 * Adds or updates an entry (checklist or dimensionamento) in the inspection.
 */
export async function upsertEntryAction(data: Omit<UpsertEntryInput, "userId" | "organizationId">): Promise<ActionResponse> {
  try {
    const session = await requireUserSession();
    await InspectionService.upsertEntry({
      ...data,
      userId: session.user.id,
      organizationId: session.user.organizationId
    });
    revalidatePath("/dashboard");
    return { success: true, data: null };
  } catch (error) {
    const message = error instanceof AppError ? error.message : "Falha ao salvar item";
    return { success: false, error: message };
  }
}

export async function deleteEntryAction(entryId: string): Promise<ActionResponse> {
  try {
    const session = await requireUserSession();
    await InspectionService.deleteEntry(entryId, session.user.id, session.user.organizationId);
    revalidatePath("/dashboard");
    return { success: true, data: null };
  } catch (error) {
    const message = error instanceof AppError ? error.message : "Falha ao remover item";
    return { success: false, error: message };
  }
}

export async function finalizeInspectionAction(id: string): Promise<ActionResponse> {
  try {
    const session = await requireUserSession();
    await InspectionService.finalizeInspection(id, session.user.id, session.user.organizationId);
    revalidatePath("/dashboard");
    return { success: true, data: null };
  } catch (error) {
    const message = error instanceof AppError ? error.message : "Falha ao finalizar inspeção";
    return { success: false, error: message };
  }
}

export async function getFacilities() {
  const session = await requireUserSession();

  return prisma.facility.findMany({
    where: { organizationId: session.user.organizationId },
    include: {
      departments: true,
    },
    orderBy: { name: "asc" }
  });
}

export async function getInspectionWithEntries(id: string) {
  try {
    const session = await requireUserSession();
    return await InspectionService.getInspectionWithEntries(id, session.user.organizationId);
  } catch (error) {
    console.error("Error fetching inspection details:", error);
    return null;
  }
}

export async function getRecentInspections() {
  const session = await requireUserSession();

  return prisma.inspection.findMany({
    where: { facility: { organizationId: session.user.organizationId } },
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

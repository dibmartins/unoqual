"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { InspectionService, UpsertInspectionInput, UpsertEntryInput, CreateInspectionCompleteInput } from "@/services/inspection.service";
import { ActionResponse, AppError } from "@/lib/errors";

export async function createInspection(data: CreateInspectionCompleteInput): Promise<ActionResponse<{ id: string }>> {
  try {
    const result = await InspectionService.createInspectionComplete(data);
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
export async function upsertInspectionAction(data: UpsertInspectionInput): Promise<ActionResponse<{ id: string }>> {
  try {
    const inspection = await InspectionService.upsertInspection(data);
    return { success: true, data: { id: inspection.id } };
  } catch (error) {
    const message = error instanceof AppError ? error.message : "Falha ao salvar inspeção";
    return { success: false, error: message };
  }
}

/**
 * Adds or updates an entry (checklist or dimensionamento) in the inspection.
 */
export async function upsertEntryAction(data: UpsertEntryInput): Promise<ActionResponse> {
  try {
    await InspectionService.upsertEntry(data);
    revalidatePath("/dashboard");
    return { success: true, data: null };
  } catch (error) {
    const message = error instanceof AppError ? error.message : "Falha ao salvar item";
    return { success: false, error: message };
  }
}

export async function deleteEntryAction(entryId: string): Promise<ActionResponse> {
  try {
    await InspectionService.deleteEntry(entryId);
    revalidatePath("/dashboard");
    return { success: true, data: null };
  } catch (error) {
    const message = error instanceof AppError ? error.message : "Falha ao remover item";
    return { success: false, error: message };
  }
}

export async function finalizeInspectionAction(id: string): Promise<ActionResponse> {
  try {
    await InspectionService.finalizeInspection(id);
    revalidatePath("/dashboard");
    return { success: true, data: null };
  } catch (error) {
    const message = error instanceof AppError ? error.message : "Falha ao finalizar inspeção";
    return { success: false, error: message };
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
  try {
    return await InspectionService.getInspectionWithEntries(id);
  } catch (error) {
    console.error("Error fetching inspection details:", error);
    return null;
  }
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

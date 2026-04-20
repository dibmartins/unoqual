"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ComplianceStatus } from "@prisma/client";

interface CreateInspectionInput {
  facilityId: string;
  departmentId?: string;
  inspectorId: string;
  entries: {
    checklistItemKey: string;
    complianceStatus: ComplianceStatus;
    observation?: string;
  }[];
}

export async function createInspection(data: CreateInspectionInput) {
  try {
    const inspection = await prisma.inspection.create({
      data: {
        facilityId: data.facilityId,
        inspectorId: data.inspectorId,
        status: "completed",
        entries: {
          create: data.entries.map((entry) => ({
            checklistItemKey: entry.checklistItemKey,
            complianceStatus: entry.complianceStatus,
            observation: entry.observation,
            departmentId: data.departmentId,
          })),
        },
      },
    });

    revalidatePath("/dashboard");
    return { success: true, id: inspection.id };
  } catch (error) {
    console.error("Failed to create inspection:", error);
    return { success: false, error: "Failed to save inspection" };
  }
}

export async function getFacilities() {
  return prisma.facility.findMany({
    include: {
      departments: true,
    },
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

"use server";

import prisma from "@/lib/prisma";
import { requireUserSession } from "@/lib/session";

export async function getDashboardOverview() {
  const session = await requireUserSession();
  const organizationId = (session.user as any).organizationId;

  const totalFacilities = await prisma.facility.count({
    where: { organizationId },
  });

  const totalDepartments = await prisma.department.count({
    where: { facility: { organizationId } },
  });

  const totalInspections = await prisma.inspection.count({
    where: { facility: { organizationId } },
  });

  // Calculate overall compliance rate
  const allEntries = await prisma.inspectionEntry.findMany({
    where: { inspection: { facility: { organizationId } } },
    select: { complianceStatus: true },
  });

  const compliantEntries = allEntries.filter(
    (e) => e.complianceStatus === "COMPLIANT" || e.complianceStatus === "NOT_APPLICABLE"
  ).length;

  const complianceRate = allEntries.length > 0 
    ? Math.round((compliantEntries / allEntries.length) * 100) 
    : 0;

  return {
    totalFacilities,
    totalDepartments,
    totalInspections,
    complianceRate,
  };
}

export async function getFacilitiesCompliance() {
  const session = await requireUserSession();
  const organizationId = (session.user as any).organizationId;

  const facilities = await prisma.facility.findMany({
    where: { organizationId },
    select: {
      id: true,
      name: true,
      inspections: {
        select: {
          entries: {
            select: {
              complianceStatus: true,
              findingSeverity: true,
            },
          },
        },
      },
    },
  });

  return facilities.map((facility) => {
    const allEntries = facility.inspections.flatMap((i) => i.entries);
    const totalEntries = allEntries.length;
    const compliantEntries = allEntries.filter(
      (e) => e.complianceStatus === "COMPLIANT" || e.complianceStatus === "NOT_APPLICABLE"
    ).length;

    const complianceRate = totalEntries > 0 
      ? Math.round((compliantEntries / totalEntries) * 100) 
      : 0;

    const criticalFindings = allEntries.filter((e) => e.findingSeverity === "CRITICAL").length;

    return {
      id: facility.id,
      name: facility.name,
      complianceRate,
      criticalFindings,
      totalEntries,
    };
  }).sort((a, b) => b.criticalFindings - a.criticalFindings || a.complianceRate - b.complianceRate);
}

export async function getDepartmentsAttention() {
  const session = await requireUserSession();
  const organizationId = (session.user as any).organizationId;

  const departments = await prisma.department.findMany({
    where: { facility: { organizationId } },
    select: {
      id: true,
      name: true,
      facility: {
        select: { name: true },
      },
      inspectionEntries: {
        select: {
          complianceStatus: true,
          findingSeverity: true,
        },
      },
      staffingCalculations: {
        select: {
          staffingGap: true,
          professionalClass: true,
        },
      },
    },
  });

  return departments.map((dept) => {
    const nonCompliantEntries = dept.inspectionEntries.filter(
      (e) => e.complianceStatus === "NON_COMPLIANT"
    ).length;

    const criticalFindings = dept.inspectionEntries.filter(
      (e) => e.findingSeverity === "CRITICAL"
    ).length;

    // Summing negative gaps across all calculations for this department
    const totalNegativeStaffingGap = dept.staffingCalculations.reduce((acc, calc) => {
      return calc.staffingGap < 0 ? acc + calc.staffingGap : acc;
    }, 0);

    return {
      id: dept.id,
      name: dept.name,
      facilityName: dept.facility.name,
      nonCompliantEntries,
      criticalFindings,
      totalNegativeStaffingGap,
      needsAttention: nonCompliantEntries > 0 || criticalFindings > 0 || totalNegativeStaffingGap < 0,
    };
  })
  .filter(dept => dept.needsAttention)
  .sort((a, b) => {
    // Sort by most critical findings, then most non compliant, then worst staffing gap
    if (b.criticalFindings !== a.criticalFindings) return b.criticalFindings - a.criticalFindings;
    if (b.nonCompliantEntries !== a.nonCompliantEntries) return b.nonCompliantEntries - a.nonCompliantEntries;
    return a.totalNegativeStaffingGap - b.totalNegativeStaffingGap; // Negative gap, so smaller is worse
  })
  .slice(0, 10); // Return top 10 needing attention
}

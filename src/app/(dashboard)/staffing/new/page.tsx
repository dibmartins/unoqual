import { StaffingForm } from "@/components/staffing/staffing-form";
import prisma from "@/lib/prisma";

export default async function StaffingPage() {
  const facilities = await prisma.facility.findMany({
    include: {
      departments: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <StaffingForm facilities={facilities} />
    </main>
  );
}

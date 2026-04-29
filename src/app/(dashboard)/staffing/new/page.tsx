import { StaffingForm } from "@/components/staffing/staffing-form";
import prisma from "@/lib/prisma";
import { requireUserSession } from "@/lib/session";

export default async function StaffingPage() {
  const session = await requireUserSession();

  const facilities = await prisma.facility.findMany({
    where: {
      organizationId: session.user.organizationId,
    },
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

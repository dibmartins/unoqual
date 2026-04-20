-- CreateEnum
CREATE TYPE "FacilitySize" AS ENUM ('small', 'medium', 'large');

-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('compliant', 'non_compliant', 'not_applicable');

-- CreateEnum
CREATE TYPE "FindingSeverity" AS ENUM ('critical', 'important', 'minor', 'none');

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facilities" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" "FacilitySize" NOT NULL,
    "bed_capacity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "facility_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bed_count" INTEGER NOT NULL DEFAULT 0,
    "average_occupancy_rate" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspections" (
    "id" TEXT NOT NULL,
    "facility_id" TEXT NOT NULL,
    "inspector_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "completed_at" TIMESTAMP(3),
    "report_hash" TEXT,
    "signature_ip" TEXT,
    "signature_user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inspections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_entries" (
    "id" TEXT NOT NULL,
    "inspection_id" TEXT NOT NULL,
    "department_id" TEXT,
    "checklist_item_key" TEXT NOT NULL,
    "compliance_status" "ComplianceStatus" NOT NULL,
    "finding_severity" "FindingSeverity" NOT NULL DEFAULT 'none',
    "observation" TEXT,
    "evidence_url" TEXT,
    "recommended_action" TEXT,

    CONSTRAINT "inspection_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staffing_calculations" (
    "id" TEXT NOT NULL,
    "inspection_id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "professional_class" TEXT NOT NULL,
    "total_nursing_hours" DOUBLE PRECISION NOT NULL,
    "required_staffing" INTEGER NOT NULL,
    "current_staffing" INTEGER NOT NULL,
    "staffing_gap" INTEGER NOT NULL,

    CONSTRAINT "staffing_calculations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_cnpj_key" ON "organizations"("cnpj");

-- CreateIndex
CREATE INDEX "inspection_entries_inspection_id_checklist_item_key_idx" ON "inspection_entries"("inspection_id", "checklist_item_key");

-- AddForeignKey
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection_entries" ADD CONSTRAINT "inspection_entries_inspection_id_fkey" FOREIGN KEY ("inspection_id") REFERENCES "inspections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection_entries" ADD CONSTRAINT "inspection_entries_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staffing_calculations" ADD CONSTRAINT "staffing_calculations_inspection_id_fkey" FOREIGN KEY ("inspection_id") REFERENCES "inspections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staffing_calculations" ADD CONSTRAINT "staffing_calculations_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

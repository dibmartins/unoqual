"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Users, Building2, Clock, AlertCircle, CheckCircle2, FileDown, Save } from "lucide-react";
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
// @ts-ignore: Prisma client type mismatch or generation issue
import { ComplianceStatus } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { saveStaffingAction } from "@/app/actions/staffing";
import { useStaffingCalculations } from "@/hooks/useStaffingCalculations";
import { generateStaffingPDF } from "@/services/pdf/staffing-pdf.service";
import { toast } from "sonner";

const staffingSchema = z.object({
  facilityId: z.string().min(1, "Selecione uma unidade"),
  departmentId: z.string().min(1, "Selecione um setor"),
  weeklyHours: z.enum(["20", "30", "36", "40", "44"]),

  // Censo de Pacientes
  pcm: z.coerce.number().min(0), // Cuidado Mínimo
  pci: z.coerce.number().min(0), // Cuidado Intermediário
  pcad: z.coerce.number().min(0), // Alta Dependência
  pcsi: z.coerce.number().min(0), // Semi-Intensivo
  pcit: z.coerce.number().min(0), // Intensivo

  // Quadro Atual
  currentNurses: z.coerce.number().min(0),
  currentTechs: z.coerce.number().min(0),
});

type StaffingFormValues = z.infer<typeof staffingSchema>;

interface Facility {
  id: string;
  name: string;
  departments: Array<{
    id: string;
    name: string;
  }>;
}

export function StaffingForm({ facilities }: { facilities: Facility[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const form = useForm<StaffingFormValues>({
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore: zod resolver version mismatch between libraries
    resolver: zodResolver(staffingSchema),
    defaultValues: {
      facilityId: "",
      departmentId: "",
      weeklyHours: "36",
      pcm: 0,
      pci: 0,
      pcad: 0,
      pcsi: 0,
      pcit: 0,
      currentNurses: 0,
      currentTechs: 0,
    },
  });

  const watchAll = form.watch();

  const calculations = useStaffingCalculations(watchAll as any);

  const selectedFacility = facilities.find(f => f.id === watchAll.facilityId);

  const onSubmit = async (data: StaffingFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await saveStaffingAction({
        ...data,
        calculations: {
          the: calculations.the,
          qp: calculations.qp,
          requiredNurses: calculations.requiredNurses,
          requiredTechs: calculations.requiredTechs
        }
      });

      if (result.success) {
        setHasSaved(true);
        toast.success("Dimensionamento salvo com sucesso!");
      } else {
        toast.error("Erro ao salvar: " + result.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar o dimensionamento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportPDF = () => {
    generateStaffingPDF({
      facilityName: selectedFacility?.name || "N/A",
      departmentName: selectedFacility?.departments.find(d => d.id === watchAll.departmentId)?.name || "N/A",
      weeklyHours: watchAll.weeklyHours,
      census: {
        pcm: watchAll.pcm,
        pci: watchAll.pci,
        pcad: watchAll.pcad,
        pcsi: watchAll.pcsi,
        pcit: watchAll.pcit
      },
      calculations: {
        the: calculations.the,
        qp: calculations.qp,
        requiredNurses: calculations.requiredNurses,
        requiredTechs: calculations.requiredTechs
      },
      currentStaff: {
        nurses: watchAll.currentNurses || 0,
        techs: watchAll.currentTechs || 0
      },
      gaps: {
        nurseGap: calculations.nurseGap,
        techGap: calculations.techGap
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Calculator className="w-8 h-8 text-emerald-600" />
            Cálculo de Quadro de Pessoal da Enfermagem
          </h1>
          <p className="text-slate-500 mt-2">Resolução COFEN 543/2017</p>
        </div>
      </div>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-slate-400" />
                  Localização
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Unidade</Label>
                  <Controller
                    name="facilityId"
                    control={form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione">
                            {facilities.find(f => f.id === field.value)?.name}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {facilities.map((f) => (
                            <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.facilityId && <p className="text-xs text-red-500">{form.formState.errors.facilityId.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Setor</Label>
                  <Controller
                    name="departmentId"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedFacility}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione">
                            {selectedFacility?.departments.find(d => d.id === field.value)?.name}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {selectedFacility?.departments.map((d) => (
                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.departmentId && <p className="text-xs text-red-500">{form.formState.errors.departmentId.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Jornada Semanal (horas)</Label>
                  <Controller
                    name="weeklyHours"
                    control={form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="20">20 horas</SelectItem>
                          <SelectItem value="30">30 horas</SelectItem>
                          <SelectItem value="36">36 horas</SelectItem>
                          <SelectItem value="40">40 horas</SelectItem>
                          <SelectItem value="44">44 horas</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-slate-400" />
                  Censo de Pacientes (Média Diária)
                </CardTitle>
                <CardDescription>Informe a quantidade de pacientes para cada nível de complexidade assistencial.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Mínimo (PCM)</Label>
                  <Input type="number" inputMode="numeric" {...form.register("pcm")} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Intermed. (PCI)</Label>
                  <Input type="number" inputMode="numeric" {...form.register("pci")} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Alta Dep. (PCAD)</Label>
                  <Input type="number" inputMode="numeric" {...form.register("pcad")} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Semi-Int. (PCSI)</Label>
                  <Input type="number" inputMode="numeric" {...form.register("pcsi")} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Intensivo (PCIt)</Label>
                  <Input type="number" inputMode="numeric" {...form.register("pcit")} className="h-12" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-400" />
                  Parâmetros de Trabalho e Quadro Atual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Jornada Semanal</Label>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <Controller
                      name="weeklyHours"
                      control={form.control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="20">20 horas</SelectItem>
                            <SelectItem value="30">30 horas</SelectItem>
                            <SelectItem value="36">36 horas</SelectItem>
                            <SelectItem value="40">40 horas</SelectItem>
                            <SelectItem value="44">44 horas</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Enfermeiros Atuais</Label>
                    <Input type="number" inputMode="numeric" {...form.register("currentNurses")} className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Técnicos Atuais</Label>
                    <Input type="number" inputMode="numeric" {...form.register("currentTechs")} className="h-12" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-emerald-100 bg-emerald-50/20 shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle className="text-emerald-800">Resultado do Cálculo</CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-slate-500 text-xs uppercase tracking-wider">Total de Horas (THE)</Label>
                  <div className="text-2xl font-bold text-slate-900">{calculations.the}h</div>
                </div>

                <Separator />

                <div>
                  <Label className="text-slate-500 text-xs uppercase tracking-wider">Quadro Necessário (QP)</Label>
                  <div className="text-4xl font-black text-emerald-600">{calculations.qp}</div>
                  <p className="text-xs text-slate-500 mt-1">Profissionais totais necessários</p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-2">
                  <div className="bg-white/50 p-3 rounded-lg border border-emerald-100">
                    <Label className="text-[10px] text-slate-500 uppercase">Enfermeiros</Label>
                    <div className="text-xl font-bold">{calculations.requiredNurses}</div>
                  </div>
                  <div className="bg-white/50 p-3 rounded-lg border border-emerald-100">
                    <Label className="text-[10px] text-slate-500 uppercase">Técnicos</Label>
                    <div className="text-xl font-bold">{calculations.requiredTechs}</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-slate-500 text-xs uppercase tracking-wider">Demanda de Profissionais</Label>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Enfermeiros:</span>
                    {calculations.nurseGap >= 0 ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> OK (+{calculations.nurseGap})
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200 animate-pulse">
                        <AlertCircle className="w-3 h-3 mr-1" /> Falta {Math.abs(calculations.nurseGap)}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Técnicos:</span>
                    {calculations.techGap >= 0 ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> OK (+{calculations.techGap})
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200 animate-pulse">
                        <AlertCircle className="w-3 h-3 mr-1" /> Falta {Math.abs(calculations.techGap)}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 mt-4">
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 text-lg font-bold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Gravando..."
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Salvar Dimensionamento
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full py-6 text-lg font-bold border-slate-200 hover:bg-slate-50"
                    onClick={handleExportPDF}
                    disabled={!hasSaved}
                  >
                    <FileDown className="w-5 h-5 mr-2" />
                    Gerar Relatório PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

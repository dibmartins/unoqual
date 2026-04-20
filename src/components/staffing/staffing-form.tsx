"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Users, Building2, Clock, AlertCircle, CheckCircle2, FileDown, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { saveStaffingAction } from "@/app/actions/staffing";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const staffingSchema = z.object({
  facilityId: z.string().min(1, "Selecione uma unidade"),
  departmentId: z.string().min(1, "Selecione um setor"),
  weeklyHours: z.enum(["20", "30", "36", "40"]),
  
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

const KM_MAP = {
  "20": 0.4235,
  "30": 0.2823,
  "36": 0.2353,
  "40": 0.2118,
};

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
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<StaffingFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(staffingSchema) as any,
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

  const watchAll = watch();
  
  // Cálculos em tempo real
  const calculations = useMemo(() => {
    const { pcm = 0, pci = 0, pcad = 0, pcsi = 0, pcit = 0, weeklyHours = "36" } = watchAll;
    
    // THE = [(PCM*4)+(PCI*6)+(PCAD*10)+(PCSI*10)+(PCIt*18)]
    const the = (pcm * 4) + (pci * 6) + (pcad * 10) + (pcsi * 10) + (pcit * 18);
    
    const km = KM_MAP[weeklyHours as keyof typeof KM_MAP] || 0.2353;
    const qp = Math.ceil(the * km);
    
    // Proporcionalidade
    const nurseRatio = (pcit > 0 || pcsi > 0) ? 0.52 : 0.33;
    const requiredNurses = Math.ceil(qp * nurseRatio);
    const requiredTechs = qp - requiredNurses;
    
    return { the, qp, requiredNurses, requiredTechs };
  }, [watchAll]);

  const nurseGap = (watchAll.currentNurses || 0) - calculations.requiredNurses;
  const techGap = (watchAll.currentTechs || 0) - calculations.requiredTechs;

  const selectedFacility = facilities.find(f => f.id === watchAll.facilityId);

  async function onSubmit(data: StaffingFormValues) {
    setIsSubmitting(true);
    try {
      const result = await saveStaffingAction({
        ...data,
        calculations
      });

      if (result.success) {
        alert("Dimensionamento salvo com sucesso!");
      } else {
        alert(result.error || "Ocorreu um erro ao salvar.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Erro de conexão ao salvar o dimensionamento.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const exportToPDF = () => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleDateString("pt-BR");
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(5, 150, 105); // emerald-600
    doc.text("Relatório de Dimensionamento de Enfermagem", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Data de Emissão: ${timestamp}`, 14, 30);
    doc.text("Baseado na Resolução COFEN 543/2017", 14, 35);

    // Localização Info
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Informações da Unidade", 14, 48);
    
    autoTable(doc, {
      startY: 52,
      head: [['Unidade', 'Setor', 'Jornada Semanal']],
      body: [[
        selectedFacility?.name || "N/A",
        selectedFacility?.departments.find(d => d.id === watchAll.departmentId)?.name || "N/A",
        `${watchAll.weeklyHours}h`
      ]],
      theme: 'grid',
      headStyles: { fillColor: [5, 150, 105] }
    });

    // Censo de Pacientes
    doc.text("Censo Assistencial (Média Diária)", 14, (doc as any).lastAutoTable.finalY + 15);
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['PCM', 'PCI', 'PCAD', 'PCSI', 'PCIt']],
      body: [[
        watchAll.pcm,
        watchAll.pci,
        watchAll.pcad,
        watchAll.pcsi,
        watchAll.pcit
      ]],
      theme: 'striped',
      headStyles: { fillColor: [71, 85, 105] } // slate-600
    });

    // Resultados
    doc.text("Quadro de Pessoal Necessário", 14, (doc as any).lastAutoTable.finalY + 15);
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Métrica', 'Cálculo']],
      body: [
        ['Total de Horas de Enfermagem (THE)', `${calculations.the}h`],
        ['Quadro de Pessoal (QP Total)', calculations.qp],
        ['Enfermeiros Necessários', calculations.requiredNurses],
        ['Técnicos/Auxiliares Necessários', calculations.requiredTechs]
      ],
      theme: 'grid',
      headStyles: { fillColor: [5, 150, 105] }
    });

    // Gap Analysis
    doc.text("Análise de Gap (Déficit/Superávit)", 14, (doc as any).lastAutoTable.finalY + 15);
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Categoria', 'Atual', 'Necessário', 'Gap']],
      body: [
        ['Enfermeiros', watchAll.currentNurses, calculations.requiredNurses, nurseGap >= 0 ? `+${nurseGap} (OK)` : `${nurseGap} (DÉFICIT)`],
        ['Técnicos', watchAll.currentTechs, calculations.requiredTechs, techGap >= 0 ? `+${techGap} (OK)` : `${techGap} (DÉFICIT)`]
      ],
      theme: 'striped',
      headStyles: { fillColor: nurseGap < 0 || techGap < 0 ? [220, 38, 38] : [5, 150, 105] }
    });

    doc.save(`dimensionamento-${selectedFacility?.name || 'relatorio'}.pdf`);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Calculator className="w-8 h-8 text-emerald-600" />
            Dimensionamento de Enfermagem
          </h1>
          <p className="text-slate-500 mt-2">Cálculo de Quadro de Pessoal - Resolução COFEN 543/2017</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Select onValueChange={(val: any) => setValue("facilityId", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {facilities.map((f) => (
                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.facilityId && <p className="text-xs text-red-500">{errors.facilityId.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Setor</Label>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Select onValueChange={(val: any) => setValue("departmentId", val)} disabled={!selectedFacility}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedFacility?.departments.map((d) => (
                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.departmentId && <p className="text-xs text-red-500">{errors.departmentId.message}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-slate-400" />
                  Censo de Pacientes (Média Diária)
                </CardTitle>
                <CardDescription>Quantidade de pacientes por nível de complexidade assistencial.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Mínimo (PCM)</Label>
                  <Input type="number" {...register("pcm")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Intermed. (PCI)</Label>
                  <Input type="number" {...register("pci")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Alta Dep. (PCAD)</Label>
                  <Input type="number" {...register("pcad")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Semi-Int. (PCSI)</Label>
                  <Input type="number" {...register("pcsi")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Intensivo (PCIt)</Label>
                  <Input type="number" {...register("pcit")} />
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
                    <Select defaultValue="36" onValueChange={(val: any) => setValue("weeklyHours", val)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20">20 horas</SelectItem>
                        <SelectItem value="30">30 horas</SelectItem>
                        <SelectItem value="36">36 horas</SelectItem>
                        <SelectItem value="40">40 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Enfermeiros Atuais</Label>
                    <Input type="number" {...register("currentNurses")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Técnicos Atuais</Label>
                    <Input type="number" {...register("currentTechs")} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-emerald-100 bg-emerald-50/20 shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle className="text-emerald-800">Resultado do Cálculo</CardTitle>
                <CardDescription>Baseado na Resolução COFEN 543/2017</CardDescription>
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
                  <Label className="text-slate-500 text-xs uppercase tracking-wider">Gap de Staffing</Label>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Enfermeiros:</span>
                    {nurseGap >= 0 ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> OK (+{nurseGap})
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200 animate-pulse">
                        <AlertCircle className="w-3 h-3 mr-1" /> Falta {Math.abs(nurseGap)}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Técnicos:</span>
                    {techGap >= 0 ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> OK (+{techGap})
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200 animate-pulse">
                        <AlertCircle className="w-3 h-3 mr-1" /> Falta {Math.abs(techGap)}
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
                    onClick={exportToPDF}
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

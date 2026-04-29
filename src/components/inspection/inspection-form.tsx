"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardCheck, Home, Droplets, Lightbulb, Trash2, ShieldAlert, Building2, LayoutPanelLeft } from "lucide-react";
import { createInspection } from "@/app/actions/inspection";
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
// @ts-ignore: Prisma client type mismatch or generation issue
import { ComplianceStatus } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Define a type for the grouped facility data
type FacilityWithDepts = {
  id: string;
  name: string;
  departments: { id: string; name: string }[];
};

const inspectionSchema = z.object({
  facilityId: z.string().min(1, "Selecione uma unidade"),
  departmentId: z.string().optional(),
  
  // Geral
  areaMinima: z.nativeEnum(ComplianceStatus),
  identificacaoVisual: z.nativeEnum(ComplianceStatus),
  trincasRachaduras: z.nativeEnum(ComplianceStatus),
  infiltracoes: z.nativeEnum(ComplianceStatus),
  pisoApropriado: z.nativeEnum(ComplianceStatus),
  tetoApropriado: z.nativeEnum(ComplianceStatus),
  acessibilidade: z.nativeEnum(ComplianceStatus),
  
  // Sanitários
  iluminacaoAdequada: z.nativeEnum(ComplianceStatus),
  chuveiroFuncional: z.nativeEnum(ComplianceStatus),
  barraApoio: z.nativeEnum(ComplianceStatus),
  lixeiraPedal: z.nativeEnum(ComplianceStatus),
  higieneSanitarios: z.nativeEnum(ComplianceStatus),
  
  observations: z.string().optional(),
});

type InspectionFormValues = z.infer<typeof inspectionSchema>;

interface QuestionItemProps {
  name: keyof InspectionFormValues;
  label: string;
  icon?: React.ElementType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
}

const QuestionItem = ({ 
  name, 
  label, 
  icon: Icon,
  form
}: QuestionItemProps) => {
  return (
    <div className="flex flex-col space-y-4 p-5 rounded-xl border bg-slate-50/50">
      <div className="flex items-start gap-3">
        {Icon && <Icon className="w-5 h-5 text-slate-400 mt-1" />}
        <Label className="text-base font-semibold leading-tight">{label}</Label>
      </div>
      
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <RadioGroup 
            onValueChange={field.onChange}
            value={field.value}
            className="flex flex-wrap gap-6"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value={ComplianceStatus.COMPLIANT} id={`${name}-c`} className="text-green-600 border-green-200" />
              <Label htmlFor={`${name}-c`} className="text-sm font-medium cursor-pointer py-2 px-1">Conforme</Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value={ComplianceStatus.NON_COMPLIANT} id={`${name}-n`} className="text-red-600 border-red-200" />
              <Label htmlFor={`${name}-n`} className="text-sm font-medium cursor-pointer py-2 px-1">Não Conf.</Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value={ComplianceStatus.NOT_APPLICABLE} id={`${name}-na`} className="text-slate-400" />
              <Label htmlFor={`${name}-na`} className="text-sm font-medium cursor-pointer py-2 px-1">N/A</Label>
            </div>
          </RadioGroup>
        )}
      />
    </div>
  );
};

export function InspectionForm({ facilities }: { facilities: FacilityWithDepts[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<InspectionFormValues>({
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore: zod resolver version mismatch
    resolver: zodResolver(inspectionSchema),
    defaultValues: {
      facilityId: "",
      departmentId: "",
      areaMinima: ComplianceStatus.NOT_APPLICABLE,
      identificacaoVisual: ComplianceStatus.NOT_APPLICABLE,
      trincasRachaduras: ComplianceStatus.NOT_APPLICABLE,
      infiltracoes: ComplianceStatus.NOT_APPLICABLE,
      pisoApropriado: ComplianceStatus.NOT_APPLICABLE,
      tetoApropriado: ComplianceStatus.NOT_APPLICABLE,
      acessibilidade: ComplianceStatus.NOT_APPLICABLE,
      iluminacaoAdequada: ComplianceStatus.NOT_APPLICABLE,
      chuveiroFuncional: ComplianceStatus.NOT_APPLICABLE,
      barraApoio: ComplianceStatus.NOT_APPLICABLE,
      lixeiraPedal: ComplianceStatus.NOT_APPLICABLE,
      higieneSanitarios: ComplianceStatus.NOT_APPLICABLE,
      observations: "",
    },
  });

  const selectedFacilityId = form.watch("facilityId");
  const selectedFacility = facilities.find(f => f.id === selectedFacilityId);

  async function onSubmit(data: InspectionFormValues) {
    setIsSubmitting(true);
    
    // Map form fields to InspectionEntry format
    const checklistKeys: (keyof InspectionFormValues)[] = [
      "areaMinima", "identificacaoVisual", "trincasRachaduras", 
      "infiltracoes", "pisoApropriado", "tetoApropriado", 
      "acessibilidade", "iluminacaoAdequada", "chuveiroFuncional", 
      "barraApoio", "lixeiraPedal", "higieneSanitarios"
    ];

    const entries = checklistKeys.map(key => ({
      checklistItemKey: key,
      complianceStatus: data[key] as ComplianceStatus,
      observation: key === "higieneSanitarios" ? data.observations : undefined, // Just as example
    }));

    const result = await createInspection({
      facilityId: data.facilityId,
      departmentId: data.departmentId,
      inspectorId: "system-user", // TODO: Get from auth
      entries,
    });

    if (result.success) {
      router.push("/dashboard");
    } else {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ClipboardCheck className="w-8 h-8 text-blue-600" />
            Nova Inspeção
          </h1>
          <p className="text-slate-500 mt-2">Padrão RDC 50/2022 - Infraestrutura Física</p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 py-1 px-3 text-sm">
          Status: Rascunho
        </Badge>
      </div>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
        {/* Sessão: Localização */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-500" />
              Identificação do Local
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Unidade de Saúde</Label>
              <Controller
                name="facilityId"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade">
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
            </div>
            <div className="space-y-2">
              <Label>Setor / Departamento (Opcional)</Label>
              <Controller
                name="departmentId"
                control={form.control}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || undefined} 
                    disabled={!selectedFacility}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor">
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
            </div>
          </CardContent>
        </Card>

        {/* Sessão: Estrutura Geral */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Home className="w-5 h-5 text-slate-500" />
              Estrutura Geral
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuestionItem form={form} name="areaMinima" label="Possui área mínima de 12m² por leito?" icon={Home} />
            <QuestionItem form={form} name="identificacaoVisual" label="Possui identificação visual em local visível?" icon={LayoutPanelLeft} />
            <QuestionItem form={form} name="trincasRachaduras" label="Apresenta trincas ou rachaduras?" icon={ShieldAlert} />
            <QuestionItem form={form} name="infiltracoes" label="Apresenta infiltrações/umidade?" icon={Droplets} />
            <QuestionItem form={form} name="pisoApropriado" label="Piso apropriado para área hospitalar?" />
            <QuestionItem form={form} name="tetoApropriado" label="Teto em boas condições de conservação?" />
            <QuestionItem form={form} name="acessibilidade" label="Possui rotas de acessibilidade (NBR 9050)?" />
          </CardContent>
        </Card>

        {/* Sessão: Sanitários */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Droplets className="w-5 h-5 text-slate-500" />
              Sanitários e Higiene
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuestionItem form={form} name="iluminacaoAdequada" label="Iluminação adequada no ambiente?" icon={Lightbulb} />
            <QuestionItem form={form} name="chuveiroFuncional" label="Chuveiro funcional com energia elétrica?" />
            <QuestionItem form={form} name="barraApoio" label="Possui barras de apoio para segurança?" />
            <QuestionItem form={form} name="lixeiraPedal" label="Lixeira com acionamento por pedal?" icon={Trash2} />
            <QuestionItem form={form} name="higieneSanitarios" label="Apresenta boas condições de higiene?" />
          </CardContent>
        </Card>

        {/* Observações */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Observações e Evidências</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea 
              {...form.register("observations")}
              className="w-full h-32 p-4 rounded-lg border bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Digite observações relevantes, irregularidades encontradas ou sugestões de melhoria..."
            />
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-end items-center sticky bottom-0 sm:bottom-8 bg-white/95 backdrop-blur-md p-4 sm:p-6 border-t sm:border sm:rounded-2xl shadow-lg z-10 -mx-4 sm:mx-0">
          <Button 
            type="button" 
            variant="ghost" 
            className="w-full sm:w-auto text-slate-500 order-2 sm:order-1" 
            onClick={() => form.reset()} 
            disabled={isSubmitting}
          >
            Limpar Formulário
          </Button>
          <Button 
            type="submit" 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 sm:px-12 py-6 text-lg font-bold order-1 sm:order-2" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Finalizar Inspeção"}
          </Button>
        </div>
      </form>
    </div>
  );
}

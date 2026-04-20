"use client";

import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ComplianceStatus } from "@prisma/client";
import { ClipboardCheck, Home, Droplets, Lightbulb, Trash2, ShieldAlert, LayoutPanelLeft } from "lucide-react";

interface InfraFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const QUESTIONS = [
  { id: "areaMinima", label: "Possui área mínima de 12m² por leito?", icon: Home },
  { id: "identificacaoVisual", label: "Possui identificação visual em local visível?", icon: LayoutPanelLeft },
  { id: "trincasRachaduras", label: "Apresenta trincas ou rachaduras?", icon: ShieldAlert },
  { id: "infiltracoes", label: "Apresenta infiltrações/umidade?", icon: Droplets },
  { id: "pisoApropriado", label: "Piso apropriado para área hospitalar?", icon: LayoutPanelLeft },
  { id: "iluminacaoAdequada", label: "Iluminação adequada no ambiente?", icon: Lightbulb },
  { id: "lixeiraPedal", label: "Lixeira com acionamento por pedal?", icon: Trash2 },
];

export function InfraForm({ initialData, onSubmit, isLoading }: InfraFormProps) {
  const { register, handleSubmit, control } = useForm({
    defaultValues: initialData?.metadata || QUESTIONS.reduce((acc, q) => ({ ...acc, [q.id]: ComplianceStatus.NOT_APPLICABLE }), { observations: "" })
  });

  const handleFormSubmit = (data: any) => {
    // Calculo básico de conformidade (se houver algum não conforme, o status global muda?)
    // Por enquanto, apenas enviamos os dados.
    onSubmit({
      metadata: data,
      observation: data.observations,
      complianceStatus: Object.values(data).includes(ComplianceStatus.NON_COMPLIANT) ? ComplianceStatus.NON_COMPLIANT : ComplianceStatus.COMPLIANT
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {QUESTIONS.map((q) => (
          <div key={q.id} className="flex flex-col space-y-3 p-4 rounded-xl border bg-slate-50/50">
            <div className="flex items-start gap-3">
              <q.icon className="w-5 h-5 text-slate-400 mt-0.5" />
              <Label className="text-base font-medium leading-tight">{q.label}</Label>
            </div>
            
            <Controller
              name={q.id}
              control={control}
              render={({ field }) => (
                <RadioGroup 
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={ComplianceStatus.COMPLIANT} id={`${q.id}-c`} className="text-green-600 border-green-200" />
                    <Label htmlFor={`${q.id}-c`} className="text-sm cursor-pointer">Conforme</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={ComplianceStatus.NON_COMPLIANT} id={`${q.id}-n`} className="text-red-600 border-red-200" />
                    <Label htmlFor={`${q.id}-n`} className="text-sm cursor-pointer">Não Conf.</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={ComplianceStatus.NOT_APPLICABLE} id={`${q.id}-na`} className="text-slate-400" />
                    <Label htmlFor={`${q.id}-na`} className="text-sm cursor-pointer">N/A</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Observações e Evidências</Label>
        <Textarea {...register("observations")} placeholder="Digite observações relevantes..." />
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-bold" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Inspeção de Infraestrutura"}
        </Button>
      </div>
    </form>
  );
}

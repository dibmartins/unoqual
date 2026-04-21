"use client";

import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ComplianceStatus } from "@prisma/client";
import { 
  FileText, 
  ShieldCheck, 
  Stethoscope, 
  Utensils, 
  Thermometer, 
  Monitor, 
  Settings, 
  Zap, 
  GraduationCap, 
  BarChart3,
  Clock
} from "lucide-react";

interface ProcessFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const QUESTIONS = [
  { id: "popsAtualizados", label: "Existem normas, procedimentos e rotinas técnicas (POPs) escritas e atualizadas?", icon: FileText },
  { id: "medicamentosControlados", label: "Guarda de medicamentos controlados em local fechado e seguro?", icon: ShieldCheck },
  { id: "proibicaoAlimentos", label: "Respeitada a proibição de alimentos nos postos de saúde?", icon: Utensils },
  { id: "classificacaoRisco", label: "É realizada a classificação de risco (Manchester)?", icon: Stethoscope },
  { id: "controleDieta", label: "Existe controle de dieta por nutricionista?", icon: Utensils },
  { id: "escalaVisivel", label: "A escala de serviço está afixada em local visível?", icon: FileText },
  { id: "controleTemperatura", label: "Existe registro de controle diário de temperatura?", icon: Thermometer },
  { id: "sistemaDigital", label: "Possui sistema digital integrado?", icon: Monitor },
  { id: "manutencaoEquipamentos", label: "Mantém registro de manutenção preventiva/corretiva de equipamentos?", icon: Settings },
  { id: "energiaEmergencia", label: "Possui sistema de energia elétrica de emergência?", icon: Zap },
  { id: "capacitacaoProfissional", label: "Mantém registro de capacitações permanentes dos profissionais?", icon: GraduationCap },
  { id: "indicadoresLegais", label: "Calcula e mantém o registro dos indicadores previstos em lei?", icon: BarChart3 },
];

export function ProcessForm({ initialData, onSubmit, isLoading }: ProcessFormProps) {
  const { register, handleSubmit, control } = useForm({
    defaultValues: initialData?.metadata || {
      ...QUESTIONS.reduce((acc, q) => ({ ...acc, [q.id]: ComplianceStatus.NOT_APPLICABLE }), {}),
      tempoEspera: "",
      tempoPermanencia: "",
      observations: ""
    }
  });

  const handleFormSubmit = (data: any) => {
    onSubmit({
      metadata: data,
      observation: data.observations,
      complianceStatus: Object.values(data).includes(ComplianceStatus.NON_COMPLIANT) ? ComplianceStatus.NON_COMPLIANT : ComplianceStatus.COMPLIANT
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Métricas de Tempo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border bg-blue-50/30 border-blue-100">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Tempo Médio de Espera
          </Label>
          <Input {...register("tempoEspera")} placeholder="Ex: 15 min" />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Tempo Médio de Permanência
          </Label>
          <Input {...register("tempoPermanencia")} placeholder="Ex: 45 min" />
        </div>
      </div>

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
        <Label>Observações Gerais sobre Processos</Label>
        <Textarea {...register("observations")} placeholder="Digite observações sobre fluxos, rotinas ou inconformidades..." />
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-bold" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Inspeção de Processos"}
        </Button>
      </div>
    </form>
  );
}

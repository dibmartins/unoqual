"use client";

import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ComplianceStatus } from "@prisma/client";

interface DimensionamentoFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  isMedical: boolean;
}

export function DimensionamentoForm({ initialData, onSubmit, isLoading, isMedical }: DimensionamentoFormProps) {
  const medicalSpecialties = [
    { id: "pediatria", label: "Pediatria", short: "ped" },
    { id: "cirurgia", label: "Cirurgia Geral", short: "cg" },
    { id: "anestesia", label: "Anestesiologia", short: "anest" },
    { id: "ortopedia", label: "Ortopedia", short: "orto" },
    { id: "vascular", label: "Cirurgia Vascular", short: "vasc" },
    { id: "toracica", label: "Cirurgia Torácica", short: "tor" },
    { id: "cir_pediatrica", label: "Cirurgia Pediátrica", short: "cped" },
    { id: "obstetricia", label: "Obstetrícia", short: "obs" },
  ];

  const { register, handleSubmit, setValue, watch, control } = useForm({
    defaultValues: initialData?.metadata || {
      totalProfissionais: 0,
      diurno: 0,
      noturno: 0,
      rotina: 0,
      escala: "12/36",
      vinculo: "CLT",
      sobreaviso: false,
      coberturaFolgas: false,
      responsavelTecnico: false,
      absenteismo: "Pequena",
      observacoes: "",
      // Medical additions
      pediatriaD: 0, pediatriaN: 0, pediatriaOver: false,
      cirurgiaD: 0, cirurgiaN: 0, cirurgiaOver: false,
      anestesiaD: 0, anestesiaN: 0, anestesiaOver: false,
      ortopediaD: 0, ortopediaN: 0, ortopediaOver: false,
      vascularD: 0, vascularN: 0, vascularOver: false,
      toracicaD: 0, toracicaN: 0, toracicaOver: false,
      cir_pediatricaD: 0, cir_pediatricaN: 0, cir_pediatricaOver: false,
      obstetriciaD: 0, obstetriciaN: 0, obstetriciaOver: false,
    }
  });

  const handleFormSubmit = (data: any) => {
    onSubmit({
      metadata: data,
      observation: data.observacoes,
      complianceStatus: ComplianceStatus.COMPLIANT, // Placeholder status
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Total de Profissionais</Label>
          <Input type="number" {...register("totalProfissionais")} />
        </div>
        <div className="space-y-2">
          <Label>Profissionais Rotina</Label>
          <Input type="number" {...register("rotina")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Turno Diurno</Label>
          <Input type="number" {...register("diurno")} />
        </div>
        <div className="space-y-2">
          <Label>Turno Noturno</Label>
          <Input type="number" {...register("noturno")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Vínculo Empregatício</Label>
          <Controller
            name="vinculo"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLT">CLT</SelectItem>
                  <SelectItem value="PJ">PJ / Autônomo</SelectItem>
                  <SelectItem value="Contrato Temporário">Contrato Temporário</SelectItem>
                  <SelectItem value="Estatutário">Estatutário</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label>Taxa de Absenteísmo</Label>
          <Controller
            name="absenteismo"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pequena">Pequena (0-5%)</SelectItem>
                  <SelectItem value="Média">Média (5-10%)</SelectItem>
                  <SelectItem value="Grande">Grande ({">"}10%)</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6 pt-2">
        <div className="flex items-center space-x-2">
          <Controller
            name="sobreaviso"
            control={control}
            render={({ field }) => (
              <Checkbox id="over" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor="over" className="cursor-pointer">Escala de Sobreaviso</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Controller
            name="coberturaFolgas"
            control={control}
            render={({ field }) => (
              <Checkbox id="folgas" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor="folgas" className="cursor-pointer">Cobertura de Folgas</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Controller
            name="responsavelTecnico"
            control={control}
            render={({ field }) => (
              <Checkbox id="rt" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor="rt" className="cursor-pointer">Responsável Técnico</Label>
        </div>
      </div>

      {isMedical && (
        <>
          <Separator className="my-4" />
          <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-4">Especialidades Médicas</h4>

          <div className="space-y-6">
            {medicalSpecialties.map((spec) => (
              <div key={spec.id} className="space-y-2.5">
                <Label className="text-sm font-semibold text-slate-900">{spec.label}</Label>
                <div className="grid grid-cols-3 gap-4 items-end">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium text-slate-500 uppercase tracking-tight">Turno Diurno</Label>
                    <Input type="number" {...register(`${spec.id}D` as any)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium text-slate-500 uppercase tracking-tight">Turno Noturno</Label>
                    <Input type="number" {...register(`${spec.id}N` as any)} />
                  </div>
                  <div className="flex items-center gap-2 h-10 px-3 border border-slate-200 rounded-md bg-slate-50/30">
                    <Controller
                      name={`${spec.id}Over` as any}
                      control={control}
                      render={({ field }) => (
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} id={`${spec.short}-ov`} />
                      )}
                    />
                    <Label htmlFor={`${spec.short}-ov`} className="text-[11px] font-medium text-slate-600 cursor-pointer">Sobreaviso</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label>Observações Gerais</Label>
        <Textarea {...register("observacoes")} placeholder="Informações adicionais..." />
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 w-full" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Dimensionamento"}
        </Button>
      </div>
    </form>
  );
}

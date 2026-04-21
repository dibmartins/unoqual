"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Building2, MapPin, Trash2, Layers } from "lucide-react";
import { createFacility, createDepartment } from "@/app/actions/settings";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const SECTOR_GROUPS = [
  {
    label: "Urgência e Emergência",
    options: [
      { value: "resuscitation_room", label: "Sala Vermelha (Emergência)" },
      { value: "yellow_zone", label: "Sala Amarela / Observação" },
      { value: "orthopedic_cast_room", label: "Sala de Imobilização Ortopédica" },
      { value: "medication_room", label: "Sala de Medicação / Hidratação" },
      { value: "adult_observation_room", label: "Sala de Observação Adulto" },
      { value: "pediatric_observation_room", label: "Sala de Observação Pediátrica" },
      { value: "minor_procedure_room", label: "Sala de Pequenos Procedimentos" },
      { value: "triage", label: "Triagem / Classificação de Risco" },
    ]
  },
  {
    label: "Internação",
    options: [
      { value: "female_surgical_ward", label: "Clínica Cirúrgica Feminina" },
      { value: "male_surgical_ward", label: "Clínica Cirúrgica Masculina" },
      { value: "female_medical_ward", label: "Clínica Médica Feminina" },
      { value: "male_medical_ward", label: "Clínica Médica Masculina" },
      { value: "obstetrics_ward", label: "Clínica Obstétrica" },
      { value: "pediatric_ward", label: "Pediatria" },
    ]
  },
  {
    label: "Terapia Intensiva",
    options: [
      { value: "adult_icu", label: "UTI Adulto" },
      { value: "neonatal_icu", label: "UTI Neonatal (UTIN)" },
    ]
  },
  {
    label: "Serviços Cirúrgicos",
    options: [
      { value: "operating_room", label: "Centro Cirúrgico (CC)" },
      { value: "recovery_room", label: "Recuperação Pós-Anestésica (RPA)" },
    ]
  },
  {
    label: "Apoio Diagnóstico",
    options: [
      { value: "pathology_morgue", label: "Anatomia Patológica / Necrotério" },
      { value: "sterile_processing", label: "Central de Material e Esterilização (CME)" },
      { value: "clinical_laboratory", label: "Laboratório de Análises Clínicas" },
      { value: "blood_bank", label: "Agência Transfusional" },
      { value: "pharmacy", label: "Farmácia Central" },
      { value: "x_ray_room", label: "Raio-X" },
      { value: "ct_scan_room", label: "Tomografia Computadorizada" },
      { value: "ultrasound_room", label: "Ultrassonografia" },
    ]
  },
  {
    label: "Atenção Básica",
    options: [
      { value: "wound_care_room", label: "Sala de Curativos" },
      { value: "vaccination_room", label: "Sala de Vacina" },
    ]
  },
  {
    label: "Serviços Administrativos",
    options: [
      { value: "management_office", label: "Diretoria e Gestão" },
      { value: "billing_department", label: "Faturamento e Auditoria" },
      { value: "ombudsman", label: "Ouvidoria" },
      { value: "reception", label: "Recepção e Espera" },
      { value: "human_resources", label: "Recursos Humanos" },
      { value: "medical_records", label: "Serviço de Arquivo Médico (SAME)" },
      { value: "it_department", label: "Tecnologia da Informação (TI)" },
    ]
  },
  {
    label: "Apoio e Operacional",
    options: [
      { value: "formula_room", label: "Lactário" },
      { value: "industrial_kitchen", label: "Cozinha Industrial / Refeitório" },
      { value: "laundry_room", label: "Lavanderia Hospitalar / Rouparia" },
      { value: "waste_management", label: "Abrigo de Resíduos" },
      { value: "dirty_utility_room", label: "Expurgo" },
      { value: "central_storage", label: "Almoxarifado Central" },
      { value: "maintenance_workshop", label: "Manutenção Predial e Clínica" },
    ]
  }
];

type FacilityWithDepts = {
  id: string;
  name: string;
  address?: string | null;
  departments: { id: string; name: string; classification?: string | null; hasNursing: boolean }[];
};

export function SettingsClient({ initialFacilities }: { initialFacilities: FacilityWithDepts[] }) {
  const router = useRouter();
  const [newFacilityName, setNewFacilityName] = useState("");
  const [newFacilityAddress, setNewFacilityAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(initialFacilities[0]?.id || null);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newDepartmentClassification, setNewDepartmentClassification] = useState("");
  const [newDepartmentHasNursing, setNewDepartmentHasNursing] = useState(true);

  const handleCreateFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacilityName) return;
    
    setIsSubmitting(true);
    const res = await createFacility({ name: newFacilityName, address: newFacilityAddress });
    if (res.success) {
      setNewFacilityName("");
      setNewFacilityAddress("");
      router.refresh();
    } else {
      alert(res.error);
    }
    setIsSubmitting(false);
  };

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDepartmentName || !selectedFacilityId || !newDepartmentClassification) {
      alert("Por favor, preencha o nome e o tipo do setor.");
      return;
    }

    setIsSubmitting(true);
    const res = await createDepartment({ 
      facilityId: selectedFacilityId, 
      name: newDepartmentName,
      classification: newDepartmentClassification,
      hasNursing: newDepartmentHasNursing
    });
    
    if (res.success) {
      setNewDepartmentName("");
      setNewDepartmentClassification("");
      setNewDepartmentHasNursing(true);
      router.refresh();
    } else {
      alert(res.error);
    }
    setIsSubmitting(false);
  };

  const selectedFacility = initialFacilities.find(f => f.id === selectedFacilityId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Coluna 1: Gestão de Unidades */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader className="bg-slate-50/50 border-b p-5">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Unidades de Saúde
            </CardTitle>
            <CardDescription>Cadastre hospitais e clínicas</CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-6">
            <form onSubmit={handleCreateFacility} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Unidade</Label>
                <Input 
                  value={newFacilityName} 
                  onChange={(e) => setNewFacilityName(e.target.value)} 
                  placeholder="Ex: Hospital Central"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Endereço (Opcional)</Label>
                <Input 
                  value={newFacilityAddress} 
                  onChange={(e) => setNewFacilityAddress(e.target.value)} 
                  placeholder="Rua, Número, Cidade"
                />
              </div>
              <Button type="submit" disabled={isSubmitting || !newFacilityName} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Adicionar Unidade
              </Button>
            </form>

            <div className="pt-4 border-t space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Unidades Cadastradas</h4>
              {initialFacilities.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFacilityId(f.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedFacilityId === f.id 
                      ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500" 
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="font-bold text-slate-800 text-sm">{f.name}</div>
                  {f.address && (
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {f.address}
                    </div>
                  )}
                  <Badge variant="secondary" className="mt-2 text-[10px]">{f.departments.length} setores</Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coluna 2: Gestão de Setores (Depende da Unidade) */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="min-h-[500px]">
          <CardHeader className="bg-slate-50/50 border-b p-5">
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              Setores e Departamentos
            </CardTitle>
            <CardDescription>
              {selectedFacility ? `Gerenciando setores de: ${selectedFacility.name}` : "Selecione uma unidade ao lado"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {!selectedFacility ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                <Building2 className="w-12 h-12 mb-4 opacity-20" />
                <p>Nenhuma unidade selecionada</p>
              </div>
            ) : (
              <div className="space-y-8">
                <form onSubmit={handleCreateDepartment} className="flex flex-col gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome do Novo Setor</Label>
                      <Input 
                        value={newDepartmentName} 
                        onChange={(e) => setNewDepartmentName(e.target.value)} 
                        placeholder="Ex: UTI B - 3º Andar"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Classificação (Tipo de Setor)</Label>
                      <Select onValueChange={(val) => setNewDepartmentClassification(val || "")} value={newDepartmentClassification} required>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Selecione a classificação...">
                            {newDepartmentClassification ? SECTOR_GROUPS.flatMap(g => g.options).find(o => o.value === newDepartmentClassification)?.label : undefined}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {SECTOR_GROUPS.map((group) => (
                            <SelectGroup key={group.label}>
                              <SelectLabel>{group.label}</SelectLabel>
                              {group.options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                              ))}
                            </SelectGroup>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="hasNursing" 
                        checked={newDepartmentHasNursing} 
                        onCheckedChange={(checked) => setNewDepartmentHasNursing(checked as boolean)}
                      />
                      <Label htmlFor="hasNursing" className="cursor-pointer text-sm font-medium">
                        Possui atuação da enfermagem (Exige Dimensionamento)
                      </Label>
                    </div>
                    <Button type="submit" disabled={isSubmitting || !newDepartmentName || !newDepartmentClassification} className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="w-4 h-4 mr-2" /> Adicionar Setor
                    </Button>
                  </div>
                </form>

                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-4">Setores Atuais ({selectedFacility.departments.length})</h4>
                  {selectedFacility.departments.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">Nenhum setor cadastrado nesta unidade.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {selectedFacility.departments.map(d => {
                        const classificationLabel = SECTOR_GROUPS.flatMap(g => g.options).find(o => o.value === d.classification)?.label || d.classification;
                        
                        return (
                          <div key={d.id} className="p-3 border border-slate-200 rounded-lg flex items-center justify-between bg-white shadow-sm">
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-800 text-sm">{d.name}</span>
                              <div className="flex gap-2 mt-1">
                                {classificationLabel && (
                                  <Badge variant="outline" className="text-[10px] text-slate-500">{classificationLabel}</Badge>
                                )}
                                {d.hasNursing && (
                                  <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-[10px]">C/ Enfermagem</Badge>
                                )}
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 h-8 w-8">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

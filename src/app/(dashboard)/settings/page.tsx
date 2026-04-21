import { getFacilities } from "@/app/actions/inspection";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const facilities = await getFacilities();

  return (
    <div className="max-w-5xl mx-auto py-10 px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Configurações</h1>
        <p className="text-slate-500 font-medium">Gerencie suas Unidades de Saúde e Setores</p>
      </div>

      <SettingsClient initialFacilities={facilities} />
    </div>
  );
}

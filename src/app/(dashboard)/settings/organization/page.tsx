import { getOrganization } from "@/app/actions/settings";
import { OrganizationForm } from "./organization-form";

export default async function OrganizationPage() {
  const organization = await getOrganization();

  if (!organization) {
    return <div>Erro ao carregar dados da organização.</div>;
  }

  return (
    <div className="max-w-3xl">
      <OrganizationForm organization={organization} />
    </div>
  );
}

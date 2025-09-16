import { getOrganizationBySlug } from "server/organization";
import { getAvailableUsers } from "server/user";
import MembersTable from "./components/members-table";
import AllUsers from "./components/all-users";

type Params = Promise<{ slug: string }>;

export default async function TeamsPageView({ params }: { params: Params }) {
  const { slug } = await params;
  const organization = await getOrganizationBySlug(slug);

  if (!organization) {
    return <div>Organização não encontrada</div>;
  }

  // Buscar usuários disponíveis (que não estão no time)
  const availableUsers = await getAvailableUsers(organization.id);

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{organization.name}</h1>
      </div>

      <MembersTable
        members={(organization as any).members || []}
        organizationId={organization.id}
      />

      <AllUsers users={availableUsers} organizationId={organization.id} />
    </div>
  );
}

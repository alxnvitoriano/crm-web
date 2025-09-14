import { getOrganizations } from "server/organization";
import TeamClient from "./components/team-client";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const organizations = await getOrganizations();

  return <TeamClient organizations={organizations} />;
}

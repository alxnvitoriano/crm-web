import { getOrganizations } from "server/organization";
import TeamClient from "./components/team-client";

export default async function TeamPage() {
  const organizations = await getOrganizations();

  return <TeamClient organizations={organizations} />;
}

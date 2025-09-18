import { getOrganizations } from "server/organization";
import { TeamPageClient } from "./team-page-client";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const organizations = await getOrganizations();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/authentication");
  }

  return <TeamPageClient organizations={organizations} />;
}

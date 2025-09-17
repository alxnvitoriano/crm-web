import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { eq, inArray } from "drizzle-orm";
import { member, organization } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const currentUserId = session.user.id;

    // Buscar memberships do usuário
    const members = await db.query.member.findMany({
      where: eq(member.userId, currentUserId),
    });

    if (members.length === 0) {
      return NextResponse.json({ organizations: [] });
    }

    // Buscar organizações do usuário
    const organizationIds = members.map((m) => m.organizationId);
    const organizations = await db.query.organization.findMany({
      where: inArray(organization.id, organizationIds),
      orderBy: (organizations, { asc }) => [asc(organizations.name)],
    });

    return NextResponse.json({ organizations });
  } catch (error) {
    console.error("Erro ao buscar organizações:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

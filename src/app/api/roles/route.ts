import { NextResponse } from "next/server";
import { getOrganizationRoles } from "@/lib/rbac/permissions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar organizações do usuário para obter o ID da organização
    const organizations = await getOrganizationRoles(session.user.id);

    return NextResponse.json({
      roles: organizations,
    });
  } catch (error) {
    console.error("Erro ao buscar roles:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

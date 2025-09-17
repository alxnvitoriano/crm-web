import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { rolesTable, member } from "@/db/schema";
import { eq, or, isNull } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: { organizationId: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { organizationId } = params;

    // Verificar se o usuário tem acesso à organização
    const userMember = await db.query.member.findFirst({
      where: eq(member.userId, session.user.id),
    });

    if (!userMember) {
      return NextResponse.json({ error: "Acesso negado à organização" }, { status: 403 });
    }

    // Buscar roles disponíveis para a organização
    // Incluir roles do sistema (organizationId = null) e roles específicos da organização
    const roles = await db.query.rolesTable.findMany({
      where: or(eq(rolesTable.organizationId, organizationId), isNull(rolesTable.organizationId)),
    });

    // Mapear roles com informações adicionais para exibição
    const rolesWithDisplay = roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      isSystemRole: role.isSystemRole,
      color: getRoleColor(role.name),
      icon: getRoleIcon(role.name),
    }));

    return NextResponse.json({
      roles: rolesWithDisplay,
    });
  } catch (error) {
    console.error("Erro ao buscar roles:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// Funções auxiliares para mapeamento visual dos roles
function getRoleColor(roleName: string): string {
  const colorMap: Record<string, string> = {
    "Gerente Geral": "bg-red-500",
    Administrativo: "bg-green-500",
    "Pós-Venda": "bg-teal-500",
    "Gerente de Vendas": "bg-purple-500",
    Vendedor: "bg-orange-500",
    // Manter compatibilidade com nomes antigos
    Owner: "bg-red-500",
    Admin: "bg-blue-500",
  };
  return colorMap[roleName] || "bg-gray-500";
}

function getRoleIcon(roleName: string): string {
  const iconMap: Record<string, string> = {
    "Gerente Geral": "Crown",
    Administrativo: "Shield",
    "Pós-Venda": "Headphones",
    "Gerente de Vendas": "TrendingUp",
    Vendedor: "UserCheck",
    // Manter compatibilidade com nomes antigos
    Owner: "Crown",
    Admin: "Shield",
  };
  return iconMap[roleName] || "Users";
}

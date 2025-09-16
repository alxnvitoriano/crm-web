import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { member, usersTable, rolesTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

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
      where: and(eq(member.userId, session.user.id), eq(member.organizationId, organizationId)),
    });

    if (!userMember) {
      return NextResponse.json({ error: "Acesso negado à organização" }, { status: 403 });
    }

    // Buscar todos os membros da organização com informações dos usuários
    const members = await db
      .select({
        id: member.id,
        userId: member.userId,
        organizationId: member.organizationId,
        roleId: member.roleId,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
        user: {
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          image: usersTable.image,
        },
      })
      .from(member)
      .innerJoin(usersTable, eq(member.userId, usersTable.id))
      .where(eq(member.organizationId, organizationId));

    // Para cada membro, buscar informações do role
    const membersWithRoles = await Promise.all(
      members.map(async (memberData) => {
        // Buscar role do banco
        const roleData = await db.query.rolesTable.findFirst({
          where: eq(rolesTable.id, memberData.roleId),
        });

        return {
          ...memberData,
          role: roleData
            ? {
                id: roleData.id,
                name: roleData.name,
                description: roleData.description,
                isSystemRole: roleData.isSystemRole,
              }
            : {
                id: memberData.roleId,
                name: "Role não encontrado",
                description: "Role não encontrado",
                isSystemRole: false,
              },
        };
      })
    );

    return NextResponse.json({
      members: membersWithRoles,
    });
  } catch (error) {
    console.error("Erro ao buscar membros:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

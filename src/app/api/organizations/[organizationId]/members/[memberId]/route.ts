import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { member } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: { organizationId: string; memberId: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { organizationId, memberId } = params;
    const { roleId } = await request.json();

    if (!roleId) {
      return NextResponse.json({ error: "roleId é obrigatório" }, { status: 400 });
    }

    // Verificar se o usuário tem acesso à organização e é admin/owner
    const userMember = await db.query.member.findFirst({
      where: and(eq(member.userId, session.user.id), eq(member.organizationId, organizationId)),
    });

    if (!userMember) {
      return NextResponse.json({ error: "Acesso negado à organização" }, { status: 403 });
    }

    // Verificar se o usuário é admin ou owner (assumindo que roles com isSystemRole true são admin/owner)
    const userRole = await db.query.rolesTable.findFirst({
      where: eq(member.roleId, userMember.roleId),
    });

    if (!userRole?.isSystemRole) {
      return NextResponse.json(
        { error: "Apenas administradores podem editar membros" },
        { status: 403 }
      );
    }

    // Atualizar o role do membro
    await db.update(member).set({ roleId, updatedAt: new Date() }).where(eq(member.id, memberId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar membro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

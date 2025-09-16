import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { invitationsTable, member } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request, { params }: { params: { token: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Não autorizado. Faça login primeiro." }, { status: 401 });
    }

    const { token } = params;

    // Buscar convite pelo token
    const invitation = await db.query.invitationsTable.findFirst({
      where: eq(invitationsTable.token, token),
    });

    if (!invitation) {
      return NextResponse.json({ error: "Convite não encontrado ou expirado." }, { status: 404 });
    }

    // Verificar se o convite ainda é válido
    if (invitation.status !== "pending") {
      return NextResponse.json(
        { error: `Convite já foi ${invitation.status === "accepted" ? "aceito" : "cancelado"}.` },
        { status: 400 }
      );
    }

    // Verificar se o convite expirou
    if (new Date() > invitation.expiresAt) {
      // Atualizar status para expirado
      await db
        .update(invitationsTable)
        .set({ status: "expired" })
        .where(eq(invitationsTable.id, invitation.id));

      return NextResponse.json({ error: "Convite expirado." }, { status: 400 });
    }

    // Verificar se o email do usuário logado corresponde ao do convite
    if (session.user.email !== invitation.email) {
      return NextResponse.json({ error: "Este convite não é para o seu email." }, { status: 403 });
    }

    // Verificar se o usuário já está na organização
    const existingMember = await db.query.member.findFirst({
      where: and(
        eq(member.organizationId, invitation.organizationId),
        eq(member.userId, session.user.id)
      ),
    });

    if (existingMember) {
      return NextResponse.json({ error: "Você já é membro desta organização." }, { status: 400 });
    }

    // Adicionar usuário à organização com o role especificado
    await db.insert(member).values({
      id: crypto.randomUUID(),
      organizationId: invitation.organizationId,
      userId: session.user.id,
      roleId: invitation.roleId,
      createdAt: new Date(),
    });

    // Atualizar status do convite para aceito
    await db
      .update(invitationsTable)
      .set({ status: "accepted" })
      .where(eq(invitationsTable.id, invitation.id));

    return NextResponse.json({
      success: true,
      message: "Convite aceito com sucesso! Você foi adicionado à organização.",
    });
  } catch (error) {
    console.error("Erro ao aceitar convite:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

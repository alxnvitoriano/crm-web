import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { rolesTable, invitationsTable, member } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { createId } from "@paralleldrive/cuid2";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy-key");

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { email, organizationId, roleId } = body;

    if (!email || !organizationId || !roleId) {
      return NextResponse.json(
        { error: "Email, organização e cargo são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se o role existe
    const role = await db.query.rolesTable.findFirst({
      where: eq(rolesTable.id, roleId),
    });

    if (!role) {
      return NextResponse.json({ error: "Cargo não encontrado" }, { status: 400 });
    }

    // Verificar se o usuário tem permissão para convidar
    const userMember = await db.query.member.findFirst({
      where: eq(member.userId, session.user.id),
    });

    if (!userMember) {
      return NextResponse.json({ error: "Usuário não pertence à organização" }, { status: 403 });
    }

    // Verificar se o usuário tem permissão para criar convites
    // TODO: Verificar permissões específicas

    // Gerar token de convite único
    const invitationToken = createId();

    // Data de expiração (7 dias)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Salvar convite no banco
    await db.insert(invitationsTable).values({
      id: createId(),
      email,
      organizationId,
      roleId,
      inviterId: session.user.id,
      token: invitationToken,
      expiresAt,
      status: "pending",
    });

    // Enviar email de convite (opcional - não falha se não conseguir enviar)
    let emailSent = false;
    try {
      const invitationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"}/invite/${invitationToken}`;

      // Só tenta enviar email se a chave do Resend estiver configurada
      if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "dummy-key") {
        const { error: emailError } = await resend.emails.send({
          from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
          to: [email],
          subject: `Convite para ${role.name} - ${session.user.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Convite para o CRM</h1>
              <p>Olá!</p>
              <p><strong>${session.user.name}</strong> está te convidando para participar da organização como <strong>${role.name}</strong>.</p>
              <p>Cargo: ${role.name}</p>
              ${role.description ? `<p>Descrição: ${role.description}</p>` : ""}

              <div style="margin: 30px 0;">
                <a href="${invitationUrl}"
                   style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Aceitar Convite
                </a>
              </div>

              <p>Este convite expira em 7 dias.</p>
              <p>Se você não esperava este convite, pode ignorar este email.</p>
            </div>
          `,
        });

        if (!emailError) {
          emailSent = true;
        } else {
          console.error("Erro ao enviar email:", emailError);
        }
      } else {
        console.warn("RESEND_API_KEY não configurada - email não será enviado");
      }
    } catch (emailError) {
      console.error("Erro ao enviar email:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: `Convite criado para ${email} como ${role.name}${emailSent ? " e email enviado" : " (email não enviado - verifique configuração do Resend)"}`,
      invitationToken,
      emailSent,
    });
  } catch (error) {
    console.error("Erro ao criar convite:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

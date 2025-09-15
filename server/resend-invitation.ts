"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { invitation } from "@/db/schema";
import { Resend } from "resend";
import TeamInvitationEmail from "emails/team-invitation";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy-key");

export async function resendInvitationEmail(invitationId: string) {
  try {
    // Buscar o convite no banco
    const invite = await db.query.invitation.findFirst({
      where: eq(invitation.id, invitationId),
      with: {
        organization: true,
        inviter: {
          with: {
            user: true,
          },
        },
      },
    });

    if (!invite) {
      return {
        success: false,
        error: "Convite não encontrado",
      };
    }

    if (invite.status !== "pending") {
      return {
        success: false,
        error: "Convite já foi aceito ou expirado",
      };
    }

    // Verificar se as variáveis de email estão configuradas
    if (!process.env.RESEND_API_KEY) {
      return {
        success: false,
        error: "RESEND_API_KEY não configurado",
      };
    }

    if (!process.env.EMAIL_SENDER_NAME || !process.env.EMAIL_SENDER_ADDRESS) {
      return {
        success: false,
        error: "Configurações de email não definidas",
      };
    }

    // Enviar email
    const inviteLink = `https://www.consorcioap.com.br/accept-invitation/${invite.id}`;

    const invitedByUsername = (invite as any)?.inviter?.user?.name ?? "";
    const invitedByEmail = (invite as any)?.inviter?.user?.email ?? "";
    const teamName = (invite as any)?.organization?.name ?? "";

    const result = await resend.emails.send({
      from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
      to: invite.email,
      subject: "Você foi convidado(a) a entrar em um time.",
      react: TeamInvitationEmail({
        email: invite.email,
        invitedByUsername,
        invitedByEmail,
        teamName,
        inviteLink,
      }),
    });

    // Opcional: validar sucesso pelo result.id
    if (!(result as any)?.id && (result as any)?.error) {
      return {
        success: false,
        error: "Falha ao reenviar email",
      };
    }

    return {
      success: true,
      message: "Email reenviado com sucesso",
    };
  } catch {
    return {
      success: false,
      error: "Erro ao reenviar email",
    };
  }
}

export async function deleteInvitation(invitationId: string) {
  try {
    await db.delete(invitation).where(eq(invitation.id, invitationId));

    return {
      success: true,
      message: "Convite deletado com sucesso",
    };
  } catch {
    return {
      success: false,
      error: "Erro ao deletar convite",
    };
  }
}

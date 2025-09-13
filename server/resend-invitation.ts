"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
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
    const inviteLink = `https://example.com/accept-invitation/${invite.id}`;

    const result = await resend.emails.send({
      from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
      to: invite.email,
      subject: "Você foi convidado(a) a entrar em um time.",
      react: TeamInvitationEmail({
        email: invite.email,
        invitedByUsername: invite.inviter.user.name,
        invitedByEmail: invite.inviter.user.email,
        teamName: invite.organization.name,
        inviteLink,
      }),
    });

    console.log("✅ Email reenviado com sucesso:", result);

    return {
      success: true,
      message: "Email reenviado com sucesso",
    };
  } catch (error) {
    console.error("❌ Erro ao reenviar email:", error);
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
  } catch (error) {
    console.error("❌ Erro ao deletar convite:", error);
    return {
      success: false,
      error: "Erro ao deletar convite",
    };
  }
}

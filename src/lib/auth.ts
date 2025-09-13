import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession, organization } from "better-auth/plugins";
import * as schema from "@/src/db/schema";
import { Resend } from "resend";

import { db } from "@/src/db";
import { eq } from "drizzle-orm";
import { getActiveOrganization } from "server/organization";
import {
  ac,
  administrative,
  geral_manager,
  post_sale,
  salesperson,
  owner,
} from "./auth/permissions";
import TeamInvitationEmail from "emails/team-invitation";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy-key");

export const auth = betterAuth({
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const organization = await getActiveOrganization(session.userId);
          return {
            data: {
              ...session,
              activeOrganizationId: organization?.id,
            },
          };
        },
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const companys = await db.query.usersToCompanyTable.findMany({
        where: eq(schema.usersToCompanyTable.userId, user.id),
        with: {
          company: true,
        },
      });
      const company = companys[0];
      return {
        user: {
          ...user,
          company: company
            ? {
                id: company.companyId,
                name: company.company.name,
              }
            : null,
        },
        session,
      };
    }),
    organization({
      async sendInvitationEmail(data) {
        console.log("📧 Iniciando envio de convite por email...");
        console.log("📧 Dados do convite:", {
          email: data.email,
          organizationName: data.organization.name,
          inviterName: data.inviter.user.name,
          invitationId: data.id,
        });

        if (!process.env.RESEND_API_KEY) {
          console.warn("❌ RESEND_API_KEY not configured, skipping email send");
          return;
        }

        if (!process.env.EMAIL_SENDER_NAME || !process.env.EMAIL_SENDER_ADDRESS) {
          console.warn("❌ EMAIL_SENDER_NAME or EMAIL_SENDER_ADDRESS not configured");
          return;
        }

        const inviteLink = `https://example.com/accept-invitation/${data.id}`;
        console.log("📧 Link do convite:", inviteLink);

        try {
          const result = await resend.emails.send({
            from: "CRM Teste <onboarding@resend.dev>",
            to: data.email,
            subject: "Você foi convidado(a) a entrar em um time.",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #333; text-align: center;">Você foi convidado(a) para a equipe ${data.organization.name}</h1>
                <p style="color: #666; text-align: center;">${data.inviter.user.name} te convidou para colaborar</p>
                
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p>Olá!</p>
                  <p><strong>${data.inviter.user.name}</strong> (${data.inviter.user.email}) convidou você para participar da equipe <strong>${data.organization.name}</strong>.</p>
                  <p>Clique no botão abaixo para aceitar o convite e começar a colaborar com sua equipe.</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${inviteLink}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                    Aceitar Convite
                  </a>
                </div>
                
                <p style="color: #666; font-size: 14px;">
                  Se o botão não funcionar, você pode copiar e colar este link no seu navegador:<br>
                  <a href="${inviteLink}" style="color: #2563eb;">${inviteLink}</a>
                </p>
              </div>
            `,
          });
          console.log("✅ Resposta do Resend:", result);

          // Verificar se houve erro na resposta
          if (result.error) {
            console.error("❌ Erro do Resend:", result.error);
            throw new Error(result.error.message || "Erro ao enviar email");
          }

          console.log("✅ Email enviado com sucesso!");
        } catch (error) {
          console.error("❌ Erro ao enviar email:", error);
          throw error;
        }
      },
      ac,
      roles: {
        member: salesperson,
        administrative,
        post_sale,
        owner: owner,
        admin: geral_manager,
      },
    }),
  ],
  user: {
    modelName: "usersTable",
  },
  session: {
    modelName: "sessionsTable",
  },
  account: {
    modelName: "accountsTable",
  },
  verification: {
    modelName: "verificationsTable",
  },
  emailAndPassword: {
    enabled: true,
  },
});

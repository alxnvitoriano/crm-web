import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession, organization } from "better-auth/plugins";
import * as schema from "@/src/db/schema";

import { db } from "@/src/db";
import { eq } from "drizzle-orm";
import { getActiveOrganization } from "server/organization";
import {
  ac,
  administrative,
  geral_manager,
  manager_sales,
  post_sale,
  salesperson,
} from "./auth/permissions";

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
      ac,
      roles: {
        salesperson,
        geral_manager,
        manager_sales,
        administrative,
        post_sale,
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

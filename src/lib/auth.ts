import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import * as schema from "@/src/db/schema";

import { db } from "@/src/db";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
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
          company: {
            id: company.companyId,
            name: company.company.name,
          },
        },
        session,
      };
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

"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { companyTable, usersToCompanyTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createCompany = async (name: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const [company] = await db.insert(companyTable).values({ name }).returning();
  await db.insert(usersToCompanyTable).values({
    userId: session.user.id,
    companyId: company.id,
  });
  redirect("/dashboard");
};

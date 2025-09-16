"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/db";
import { eq, inArray } from "drizzle-orm";
import { member, organization } from "@/db/schema";

// Type assertion helper para resolver conflitos de versão do Drizzle ORM
const eqSafe = (column: any, value: any) => eq(column as any, value);
const inArraySafe = (column: any, values: any[]) => inArray(column as any, values);

export async function getOrganizations() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      console.warn("No session found, redirecting to authentication");
      redirect("/authentication");
    }

    const currentUserId = session.user.id;
    console.warn("Getting organizations for user:", currentUserId);

    const members = await db.query.member.findMany({
      // @ts-expect-error - Drizzle ORM version compatibility issue
      where: eqSafe(member.userId, currentUserId),
    });

    console.warn("Found members:", members.length);

    if (members.length === 0) {
      console.warn("No members found for user");
      return [];
    }

    const organizationIds = members.map((m) => m.organizationId);
    console.warn("Organization IDs:", organizationIds);

    const organizations = await db.query.organization.findMany({
      // @ts-expect-error - Drizzle ORM version compatibility issue
      where: inArraySafe(organization.id, organizationIds),
    });

    console.warn("Found organizations:", organizations.length);
    return organizations;
  } catch (error) {
    console.error("Error in getOrganizations:", error);
    // Return empty array instead of throwing to prevent layout from breaking
    return [];
  }
}

export async function getActiveOrganization(userId: string) {
  const memberUser = await db.query.member.findFirst({
    // @ts-expect-error - Drizzle ORM version compatibility issue
    where: eqSafe(member.userId, userId),
  });

  if (!memberUser) {
    return null;
  }
  const activeOrganization = await db.query.organization.findFirst({
    // @ts-expect-error - Drizzle ORM version compatibility issue
    where: eqSafe(organization.id, memberUser.organizationId),
  });
  return activeOrganization;
}

export async function getOrganizationBySlug(slug: string) {
  try {
    const organizationBySlug = await db.query.organization.findFirst({
      // @ts-expect-error - Drizzle ORM version compatibility issue
      where: eqSafe(organization.slug, slug),
      with: {
        members: {
          with: {
            user: true,
          },
        },
      },
    });
    return organizationBySlug;
  } catch (error) {
    console.error(error);
    return null;
  }
}

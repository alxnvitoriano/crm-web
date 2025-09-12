"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/db";
import { eq, notInArray } from "drizzle-orm";
import { usersTable, member } from "@/db/schema";

export async function getAllUsers() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/authentication");
  }

  try {
    const users = await db.query.usersTable.findMany();
    return users;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
}

export async function getAvailableUsers(organizationId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/authentication");
  }

  try {
    // Buscar IDs dos usuários que já estão no time
    const existingMembers = await db.query.member.findMany({
      where: eq(member.organizationId, organizationId),
      columns: { userId: true },
    });

    const existingUserIds = existingMembers.map((member) => member.userId);

    // Buscar todos os usuários que NÃO estão no time
    const availableUsers = await db.query.usersTable.findMany({
      where: existingUserIds.length > 0 ? notInArray(usersTable.id, existingUserIds) : undefined,
    });

    return availableUsers;
  } catch (error) {
    console.error("Erro ao buscar usuários disponíveis:", error);
    return [];
  }
}

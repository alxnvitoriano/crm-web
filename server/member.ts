"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { member, organization, usersTable } from "@/db/schema";
import { nanoid } from "nanoid";

export async function addMemberToOrganization(
  organizationId: string,
  userId: string,
  role: string = "member"
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/authentication");
  }

  try {
    // Verificar se o usuário já está no time
    const existingMember = await db.query.member.findFirst({
      where: and(eq(member.organizationId, organizationId), eq(member.userId, userId)),
    });

    if (existingMember) {
      return {
        success: false,
        error: "Usuário já está neste time",
      };
    }

    // Verificar se a organização existe
    const org = await db.query.organization.findFirst({
      where: eq(organization.id, organizationId),
    });

    if (!org) {
      return {
        success: false,
        error: "Organização não encontrada",
      };
    }

    // Verificar se o usuário existe
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, userId),
    });

    if (!user) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    // Adicionar o usuário ao time
    await db.insert(member).values({
      id: nanoid(),
      organizationId,
      userId,
      role,
      createdAt: new Date(),
    });

    return {
      success: true,
      message: "Usuário adicionado ao time com sucesso",
    };
  } catch (error) {
    console.error("Erro ao adicionar membro:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}

export async function removeMemberFromOrganization(organizationId: string, userId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/authentication");
  }

  try {
    // Verificar se o membro existe
    const existingMember = await db.query.member.findFirst({
      where: and(eq(member.organizationId, organizationId), eq(member.userId, userId)),
    });

    if (!existingMember) {
      return {
        success: false,
        error: "Membro não encontrado neste time",
      };
    }

    // Remover o membro do time
    await db
      .delete(member)
      .where(and(eq(member.organizationId, organizationId), eq(member.userId, userId)));

    return {
      success: true,
      message: "Membro removido do time com sucesso",
    };
  } catch (error) {
    console.error("Erro ao remover membro:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}

export async function checkUserInOrganization(organizationId: string, userId: string) {
  try {
    const existingMember = await db.query.member.findFirst({
      where: and(eq(member.organizationId, organizationId), eq(member.userId, userId)),
    });

    return !!existingMember;
  } catch (error) {
    console.error("Erro ao verificar membro:", error);
    return false;
  }
}

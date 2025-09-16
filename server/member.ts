"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { member } from "@/db/schema";
import { isAdmin } from "./permissions";

export const addMemberToOrganization = async (
  organizationId: string,
  userId: string,
  roleId: string
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/authentication");
  }

  try {
    // Verificar permissões do usuário
    const permissionCheck = await isAdmin();
    if (!permissionCheck.success) {
      return {
        success: false,
        error: permissionCheck.error || "Você não tem permissão para adicionar membros",
      };
    }

    // Verificar se o usuário já está no time usando o banco
    const existingMember = await db.query.member.findFirst({
      where: and(eq(member.organizationId, organizationId), eq(member.userId, userId)),
    });

    const isAlreadyMember = !!existingMember;

    if (isAlreadyMember) {
      return {
        success: false,
        error: "Usuário já está neste time",
      };
    }

    // Adicionar o usuário ao time usando a API
    try {
      await auth.api.addMember({
        body: {
          userId,
          organizationId,
          role: roleId as "member" | "administrative" | "post_sale" | "owner" | "admin",
        },
      });
    } catch (apiError) {
      console.warn("API addMember falhou, usando banco diretamente:", apiError);
      // Fallback: adicionar diretamente no banco
      await db.insert(member).values({
        id: crypto.randomUUID(),
        organizationId,
        userId,
        roleId,
        createdAt: new Date(),
      });
    }

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
};

export async function removeMemberFromOrganization(organizationId: string, userId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/authentication");
  }

  try {
    // Verificar permissões do usuário
    const permissionCheck = await isAdmin();
    if (!permissionCheck.success) {
      return {
        success: false,
        error: permissionCheck.error || "Você não tem permissão para remover membros",
      };
    }

    // Verificar se o membro existe usando o banco
    const existingMember = await db.query.member.findFirst({
      where: and(eq(member.organizationId, organizationId), eq(member.userId, userId)),
    });

    if (!existingMember) {
      return {
        success: false,
        error: "Membro não encontrado neste time",
      };
    }

    // Remover o membro do time usando a auth API
    try {
      await auth.api.removeMember({
        body: {
          memberIdOrEmail: userId,
          organizationId,
        },
      });
    } catch (apiError) {
      console.warn("API removeMember falhou, usando banco diretamente:", apiError);
      // Fallback: remover diretamente no banco
      await db
        .delete(member)
        .where(and(eq(member.organizationId, organizationId), eq(member.userId, userId)));
    }

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

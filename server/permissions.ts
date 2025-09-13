"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const isAdmin = async () => {
  try {
    const { success, error } = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          project: ["view", "create", "delete", "management", "update"],
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: error || "Falha ao checar permissões.",
      };
    }

    // Retorna sempre um objeto para consistência
    return {
      success: success,
      error: success ? null : "Usuário não tem permissão de administrador",
    };
  } catch (error) {
    console.error("💥 Exceção em isAdmin:", error);
    return {
      success: false,
      error: error || "Falha ao checar permissões.",
    };
  }
};

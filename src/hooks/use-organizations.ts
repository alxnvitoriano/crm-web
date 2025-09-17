"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Organization } from "@/db/schema";
import { toast } from "sonner";

// Hook para buscar organizações do usuário atual
export function useOrganizations() {
  return useQuery<Organization[]>({
    queryKey: ["organizations"],
    queryFn: async () => {
      const response = await fetch("/api/organizations");
      if (!response.ok) {
        throw new Error("Falha ao buscar organizações");
      }
      const data = await response.json();
      return data.organizations || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para criar uma nova organização
export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; slug: string }) => {
      const response = await fetch("/api/organizations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha na criação do time");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidar e refetch a lista de organizações
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Time criado com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao criar organização:", error);
      toast.error(error instanceof Error ? error.message : "Falha na criação do time");
    },
  });
}

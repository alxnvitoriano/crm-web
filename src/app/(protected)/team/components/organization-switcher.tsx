"use client";

import { useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useOrganizations } from "@/hooks/use-organizations";
import { Loader2 } from "lucide-react";

export function OrganizationSwitcher() {
  const { data: organizations = [], isLoading } = useOrganizations();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  const handleChangeOrganization = useCallback(async (organizationId: string) => {
    try {
      const { error } = await authClient.organization.setActive({
        organizationId,
      });

      if (error) {
        toast.error("Falha na troca do time.");
        return;
      }
      toast.success("Time trocado com sucesso.");
    } catch (error) {
      toast.error("Falha na troca do time.");
      console.error(error);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center w-[180px] h-10 px-3 py-2 border border-input bg-background rounded-md">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span className="text-sm text-muted-foreground">Carregando...</span>
      </div>
    );
  }

  return (
    <Select onValueChange={handleChangeOrganization} value={activeOrganization?.id}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Selecione um time" />
      </SelectTrigger>
      <SelectContent>
        {organizations.length === 0 ? (
          <SelectItem value="no-organizations" disabled>
            Nenhum time encontrado
          </SelectItem>
        ) : (
          organizations.map((organization) => (
            <SelectItem key={organization.id} value={organization.id}>
              {organization.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

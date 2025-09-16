"use client";

import { authClient } from "@/lib/auth-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Organization } from "@/db/schema";
import { toast } from "sonner";

interface OrganizationSwitcherProps {
  organizations: Organization[];
}

export function OrganizationSwitcher({ organizations }: OrganizationSwitcherProps) {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const handleChangeOrganization = async (organizationId: string) => {
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
  };

  return (
    <Select onValueChange={handleChangeOrganization} value={activeOrganization?.id}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="time" />
      </SelectTrigger>
      <SelectContent>
        {organizations.map((organization) => (
          <SelectItem key={organization.id} value={organization.id}>
            {organization.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

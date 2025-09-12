// team/team-page-client.tsx (CLIENT COMPONENT)
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateOrganizationForm } from "./components/organization-form";
import { OrganizationSwitcher } from "./components/organization-switcher";
import { getOrganizations } from "server/organization";
import React from "react";

type OrganizationType = Awaited<ReturnType<typeof getOrganizations>>;

interface TeamPageClientProps {
  organizations: OrganizationType;
  setHeaderRight?: (node: React.ReactNode) => void;
}

export function TeamPageClient({ organizations, setHeaderRight }: TeamPageClientProps) {
  // quando carregar a página, injeta os botões no header global
  React.useEffect(() => {
    if (setHeaderRight) {
      setHeaderRight(
        <div className="flex items-center gap-2">
          <OrganizationSwitcher organizations={organizations} />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Criar Time</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Time</DialogTitle>
                <DialogDescription>Criação do time iniciada!</DialogDescription>
              </DialogHeader>
              <CreateOrganizationForm />
            </DialogContent>
          </Dialog>
        </div>
      );
    }
  }, [organizations, setHeaderRight]);

  return (
    <div className="p-6">
      <p className="text-lg text-muted-foreground">Selecione ou crie um time para começar.</p>
    </div>
  );
}

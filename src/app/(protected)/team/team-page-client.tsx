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
import React, { useState } from "react";

interface TeamPageClientProps {
  setHeaderRight?: (node: React.ReactNode) => void;
}

export function TeamPageClient({ setHeaderRight }: TeamPageClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Memoizar o JSX para evitar recriações desnecessárias
  const headerContent = React.useMemo(
    () => (
      <div className="flex items-center gap-2">
        <OrganizationSwitcher />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Criar Time</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Time</DialogTitle>
              <DialogDescription>Criação do time iniciada!</DialogDescription>
            </DialogHeader>
            <CreateOrganizationForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    ),
    [isDialogOpen]
  );

  // quando carregar a página, injeta os botões no header global
  React.useEffect(() => {
    if (setHeaderRight) {
      setHeaderRight(headerContent);
    }
  }, [setHeaderRight, headerContent]);

  return (
    <div className="p-6">
      <p className="text-lg text-muted-foreground">Selecione ou crie um time para começar.</p>
    </div>
  );
}

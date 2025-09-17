"use client";

import { createContext, useContext, ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { Organization } from "@/db/schema";

interface OrganizationContextType {
  currentOrganization: Organization | null;
  loading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const { data: currentOrganization, isPending: loading } = authClient.useActiveOrganization();

  return (
    <OrganizationContext.Provider value={{ currentOrganization, loading }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganizationContext = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error("useOrganizationContext must be used within an OrganizationProvider");
  }
  return context;
};

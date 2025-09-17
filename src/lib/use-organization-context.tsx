"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Organization } from "@/db/schema";

interface OrganizationContextType {
  currentOrganization: Organization | null;
  setCurrentOrganization: (org: Organization | null) => void;
  loading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const _router = useRouter();

  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await fetch("/api/auth/organization/get-full-organization");
        if (response.ok) {
          const data = await response.json();
          if (data.organization) {
            setCurrentOrganization(data.organization);
          } else {
            setCurrentOrganization(null);
          }
        } else {
          console.error("Failed to fetch organization:", response.statusText);
          setCurrentOrganization(null);
        }
      } catch (error) {
        console.error("Error fetching organization:", error);
        setCurrentOrganization(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, []);

  return (
    <OrganizationContext.Provider value={{ currentOrganization, setCurrentOrganization, loading }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganizationContext = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    return {
      currentOrganization: null,
    };
    throw new Error("useOrganizationContext must be used within an OrganizationProvider");
  }
  return context;
};

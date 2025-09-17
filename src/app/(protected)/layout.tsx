"use client";

import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/header";
import { Sidebar } from "./dashboard/_components/sidebar";
// import { getOrganizations } from "server/organization"; // No longer needed here as it's a client component now
// import { organization } from "@/db/schema"; // No longer needed here
import { OrganizationProvider } from "@/lib/use-organization-context";
import { ClientOnly } from "@/components/client-only";

// export const dynamic = "force-dynamic"; // No longer needed here as it's a client component now

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // let organizations: (typeof organization.$inferSelect)[] = []; // No longer needed here
  // try {
  //   organizations = await getOrganizations(); // No longer needed here
  // } catch (error) {
  //   console.error("Error fetching organizations:", error);
  //   // Fallback to empty array if there's an error
  // } // No longer needed here

  return (
    <div className="flex h-screen bg-background">
      <ClientOnly
        fallback={<div className="flex-1 flex items-center justify-center">Carregando...</div>}
      >
        <OrganizationProvider>
          <SidebarProvider>
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Organizations will be fetched inside OrganizationProvider */}
              <Header />
              {/* Pass an empty array initially, or fetch in Header itself if needed */}
              <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
          </SidebarProvider>
        </OrganizationProvider>
      </ClientOnly>
    </div>
  );
}

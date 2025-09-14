import type React from "react";
import { SidebarProvider } from "@/src/components/ui/sidebar";
import Header from "@/components/header";
import { Sidebar } from "./dashboard/_components/sidebar";
import { getOrganizations } from "server/organization";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let organizations = [];
  try {
    organizations = await getOrganizations();
  } catch (error) {
    console.error("Error fetching organizations:", error);
    // Fallback to empty array if there's an error
  }

  return (
    <div className="flex h-screen bg-background">
      <SidebarProvider>
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header organizations={organizations} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}

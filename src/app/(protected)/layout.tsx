"use client";

import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/header";
import { Sidebar } from "./dashboard/_components/sidebar";
import { OrganizationProvider } from "@/lib/use-organization-context";
import { ClientOnly } from "@/components/client-only";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <ClientOnly
        fallback={<div className="flex-1 flex items-center justify-center">Carregando...</div>}
      >
        <OrganizationProvider>
          <SidebarProvider>
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
          </SidebarProvider>
        </OrganizationProvider>
      </ClientOnly>
    </div>
  );
}

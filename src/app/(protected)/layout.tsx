import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { Sidebar } from "@/src/app/(protected)/dashboard/_components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar />
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}

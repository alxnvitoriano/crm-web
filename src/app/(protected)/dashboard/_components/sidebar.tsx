"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import {
  LayoutDashboard,
  Users,
  Headphones,
  CheckCircle,
  Handshake,
  ShoppingCart,
  Shield,
  BarChart3,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  Target,
  CheckSquare,
  TrendingUp,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Clientes",
    href: "/dashboard/clients",
    icon: Users,
  },
  {
    title: "Negócios",
    href: "/dashboard/deals",
    icon: Target,
  },
  {
    title: "Tarefas",
    href: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    title: "Relatórios",
    href: "/dashboard/reports",
    icon: TrendingUp,
  },
  {
    title: "Lev. de Necessidade",
    href: "/dashboard/needs-assessment",
    icon: Users,
  },
  {
    title: "Atendimento",
    href: "/dashboard/customer-service",
    icon: Headphones,
  },
  {
    title: "Análise/Aprovação",
    href: "/dashboard/analysis-approval",
    icon: CheckCircle,
  },
  {
    title: "Fechamento",
    href: "/dashboard/closing",
    icon: Handshake,
  },
  {
    title: "Confirmar Venda",
    href: "/dashboard/sale-confirmation",
    icon: ShoppingCart,
  },
  {
    title: "Controle de Qualidade",
    href: "/dashboard/quality-control",
    icon: Shield,
  },
  {
    title: "Resultado 1º Assembleia",
    href: "/dashboard/assembly-results",
    icon: BarChart3,
  },
  {
    title: "Pós Venda",
    href: "/dashboard/post-sale",
    icon: MessageSquare,
  },
  {
    title: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const router = useRouter();
  const session = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/authentication");
        },
      },
    });
  };

  return (
    <div
      className={cn(
        "relative flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-72",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="bg-sidebar-primary rounded-lg p-2">
              <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">CRM System</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0 hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start transition-all duration-200",
                    collapsed ? "px-2" : "px-3",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
                  {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <SidebarMenuButton className="flex items-center gap-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="flex items-center justify-center">
                        A
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-center text-left">
                      <p className="text-sm">
                        {session.data?.user.company
                          ? session.data.user.company.name
                          : "Sem Empresa"}
                        <p className="text-sm text-muted-foreground">{session.data?.user.email}</p>
                      </p>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </div>
    </div>
  );
}

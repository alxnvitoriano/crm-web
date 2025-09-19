"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, Search, Settings, LogOut, User, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { OrganizationSwitcher } from "@/app/(protected)/team/components/organization-switcher";
import { authClient } from "@/lib/auth-client";
import { Organization } from "@/db/schema";
import { useSession } from "@/hooks/use-session";

interface Notification {
  id: string;
  title: string;
  description?: string;
  time: string;
  unread: boolean;
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, setTheme } = useTheme();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const unreadCount = notifications.filter((n) => n.unread).length;
  const router = useRouter();

  const { user, isLoading } = useSession();

  // Buscar todas as organizações do usuário
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoadingOrganizations(true);
        const { data } = await authClient.organization.list();

        if (data) {
          // Transformar os dados para o formato esperado
          const orgs = data.map((org: any) => ({
            id: org.id,
            name: org.name,
            slug: org.slug,
            logo: org.logo,
            createdAt: new Date(org.createdAt),
            metadata: org.metadata,
          }));
          setOrganizations(orgs);
        } else {
          setOrganizations([]);
        }
      } catch (error) {
        console.error("Erro ao buscar organizações:", error);
        setOrganizations([]);
      } finally {
        setLoadingOrganizations(false);
      }
    };

    fetchOrganizations();
  }, []);

  // Buscar notificações
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const response = await fetch("/api/notifications");
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
        setNotifications([]);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/";
  };

  if (isLoading) {
    return (
      <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
        <div>Carregando...</div>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes, negócios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Right Section */}
        {!loadingOrganizations && organizations.length > 0 && (
          <OrganizationSwitcher organizations={organizations} />
        )}

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9 p-0"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Notificações</h4>
                <Button variant="ghost" size="sm">
                  Marcar todas como lidas
                </Button>
              </div>
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      notification.unread ? "bg-muted/50" : "bg-background"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                      {notification.unread && (
                        <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image || "/placeholder.svg"} alt="Avatar" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || "Usuário"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "email@exemplo.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

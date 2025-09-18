"use client";

import * as React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  UserCheck,
  Crown,
  TrendingUp,
  Search,
  Shield,
  Headphones,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateOrganizationForm } from "./components/organization-form";
import { usePermissions } from "@/hooks/use-permissions";
import { authClient } from "@/lib/auth-client";
import { OrganizationSwitcher } from "./components/organization-switcher";

// Tipos para os dados reais
interface TeamMember {
  id: string;
  userId: string;
  organizationId: string;
  roleId: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  role: {
    id: string;
    name: string;
    description?: string;
    isSystemRole: boolean;
  };
}

interface RoleInfo {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: any;
  permissions: string[];
}

// Mapeamento de roles do sistema para exibição
const systemRoleDisplay = {
  Owner: { icon: Crown },
  Admin: { icon: Shield },
  "Gerente de Vendas": { icon: TrendingUp },
  Vendedor: { icon: UserCheck },
  Administrativo: { icon: Shield },
  "Pós-Venda": { icon: Headphones },
};

interface TeamClientProps {
  organizations: Array<{
    id: string;
    name: string;
    slug: string | null;
    createdAt: Date;
    logo: string | null;
    metadata: string | null;
  }>;
}

// Função para buscar membros da organização atual
async function fetchTeamMembers(organizationId: string): Promise<TeamMember[]> {
  try {
    const response = await fetch(`/api/organizations/${organizationId}/members`);
    if (!response.ok) {
      console.error("Erro ao buscar membros:", response.statusText);
      return [];
    }
    const data = await response.json();
    return data.members || [];
  } catch (error) {
    console.error("Erro ao buscar membros:", error);
    return [];
  }
}

// Função para buscar roles disponíveis
async function fetchRoles(): Promise<RoleInfo[]> {
  try {
    const response = await fetch("/api/roles");
    if (!response.ok) {
      console.error("Erro ao buscar roles:", response.statusText);
      return [];
    }
    const data = await response.json();

    // Mapear roles com informações de exibição
    return (
      data.roles.map((role: any) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        color: systemRoleDisplay[role.name as keyof typeof systemRoleDisplay],
        icon: systemRoleDisplay[role.name as keyof typeof systemRoleDisplay]?.icon || Users,
        permissions: role.permissions || [],
      })) || []
    );
  } catch (error) {
    console.error("Erro ao buscar roles:", error);
    return [];
  }
}

export default function TeamClient({ organizations }: TeamClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [roles, setRoles] = useState<RoleInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dentro do componente:
  const session = authClient.useSession();

  // Hook de permissões com dados reais
  const { permissions } = usePermissions({
    userId: session.data?.user?.id || "",
    organizationId: organizations[0]?.id || "",
  });

  // Carregar dados reais
  useEffect(() => {
    if (loading) return; // Evitar múltiplas execuções

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar roles disponíveis
        const rolesData = await fetchRoles();
        setRoles(rolesData);

        // Buscar membros da primeira organização (ou todas)
        if (organizations.length > 0) {
          const membersData = await fetchTeamMembers(organizations[0].id);
          setMembers(membersData);
        }
      } catch (err) {
        console.error("Erro ao carregar dados da equipe:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [organizations, permissions, loading]);

  // Filtrar membros da equipe
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || member.role.id === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Estatísticas da equipe
  const stats = {
    total: members.length,
    active: members.filter((_m) => true).length, // TODO: Adicionar campo de status
    managers: members.filter((m) => m.role.name.includes("Gerente")).length,
    sellers: members.filter((m) => m.role.name === "Vendedor").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gerenciamento de Equipe</h1>
            <p className="text-muted-foreground">
              Gerencie sua equipe e controle de acesso por hierarquia
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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

          <div className="flex flex-col gap-2">
            <OrganizationSwitcher organizations={organizations} />
          </div>
        </div>
      </div>
      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">{stats.total}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">{stats.active}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gerentes</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">{stats.managers}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendedores</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">{stats.sellers}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">Todos os Cargos</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Membros */}
      <Card>
        <CardHeader>
          <CardTitle>Membros da Equipe ({filteredMembers.length})</CardTitle>
          <CardDescription>
            Lista completa dos membros da equipe com suas respectivas permissões
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Carregando membros...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p>Erro ao carregar membros: {error}</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum membro encontrado.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membro</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Permissões</TableHead>
                  <TableHead>Data de Entrada</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => {
                  // Encontrar informações do role para exibição
                  const roleInfo = systemRoleDisplay[
                    member.role.name as keyof typeof systemRoleDisplay
                  ] || {
                    color: "bg-gray-500",
                    icon: Users,
                  };
                  const RoleIcon = roleInfo.icon;

                  return (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={member.user.image || "/placeholder.svg"}
                              alt={member.user.name}
                            />
                            <AvatarFallback>
                              {member.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.user.name}</div>
                            <div className="text-sm text-muted-foreground">{member.user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded-full ${roleInfo}`}>
                            <RoleIcon className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{member.role.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {member.role.description || "Sem descrição"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {/* TODO: Adicionar permissões específicas do role */}
                          <span className="px-2 py-1 text-xs bg-muted rounded">
                            {member.role.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(member.createdAt).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

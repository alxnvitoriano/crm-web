"use client";

import { useState } from "react";
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
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Users, UserCheck, Crown, TrendingUp, Search, Shield, Headphones } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateOrganizationForm } from "./organization-form";

// Tipos de usuário e suas permissões
const userRoles = {
  "gerente-geral": {
    name: "Gerente Geral",
    description: "Acesso total ao sistema",
    permissions: [1, 2, 3, 4, 5, 6, 7, 8],
    color: "bg-red-500",
    icon: Crown,
  },
  administrativo: {
    name: "Administrativo",
    description: "Etapas 4 a 7",
    permissions: [4, 5, 6, 7],
    color: "bg-blue-500",
    icon: Shield,
  },
  "pos-venda": {
    name: "Pós Venda",
    description: "Pós venda e etapa 8",
    permissions: [8],
    color: "bg-green-500",
    icon: Headphones,
  },
  "gerente-vendas": {
    name: "Gerente de Vendas",
    description: "Equipe própria - etapas 1 a 8",
    permissions: [1, 2, 3, 4, 5, 6, 7, 8],
    color: "bg-purple-500",
    icon: TrendingUp,
  },
  vendedor: {
    name: "Vendedor",
    description: "Editável: 1-4,8 | Visível: 5-7",
    permissions: [1, 2, 3, 4, 5, 6, 7, 8],
    editablePermissions: [1, 2, 3, 4, 8],
    color: "bg-orange-500",
    icon: UserCheck,
  },
};

// Dados simulados da equipe
const teamMembers = [
  {
    id: 1,
    name: "Carlos Silva",
    email: "carlos.silva@empresa.com",
    phone: "(11) 99999-0001",
    role: "gerente-geral",
    team: null,
    status: "ativo",
    joinDate: "2023-01-15",
    avatar: "/professional-man.png",
  },
  {
    id: 2,
    name: "Ana Santos",
    email: "ana.santos@empresa.com",
    phone: "(11) 99999-0002",
    role: "gerente-vendas",
    team: "Equipe Alpha",
    status: "ativo",
    joinDate: "2023-02-20",
    avatar: "/professional-woman-diverse.png",
  },
  {
    id: 3,
    name: "João Oliveira",
    email: "joao.oliveira@empresa.com",
    phone: "(11) 99999-0003",
    role: "vendedor",
    team: "Equipe Alpha",
    status: "ativo",
    joinDate: "2023-03-10",
    avatar: "/professional-user.png",
  },
  {
    id: 4,
    name: "Maria Costa",
    email: "maria.costa@empresa.com",
    phone: "(11) 99999-0004",
    role: "administrativo",
    team: null,
    status: "ativo",
    joinDate: "2023-01-25",
    avatar: "/professional-woman-diverse.png",
  },
  {
    id: 5,
    name: "Pedro Ferreira",
    email: "pedro.ferreira@empresa.com",
    phone: "(11) 99999-0005",
    role: "pos-venda",
    team: null,
    status: "ativo",
    joinDate: "2023-04-05",
    avatar: "/professional-man.png",
  },
  {
    id: 6,
    name: "Lucia Rodrigues",
    email: "lucia.rodrigues@empresa.com",
    phone: "(11) 99999-0006",
    role: "vendedor",
    team: "Equipe Beta",
    status: "inativo",
    joinDate: "2023-05-12",
    avatar: "/professional-user.png",
  },
];

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

export default function TeamClient({ organizations }: TeamClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  // Filtrar membros da equipe
  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || member.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Estatísticas da equipe
  const stats = {
    total: teamMembers.length,
    active: teamMembers.filter((m) => m.status === "ativo").length,
    managers: teamMembers.filter((m) => m.role.includes("gerente")).length,
    sellers: teamMembers.filter((m) => m.role === "vendedor").length,
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
            <h2 className="text-2xl text-center font-bold">Times</h2>
            {organizations.map((organization) => (
              <Button variant="outline" key={organization.id} asChild>
                <Link href={`/team/teams/${organization.slug}`}>{organization.name}</Link>
              </Button>
            ))}
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
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gerentes</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.managers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendedores</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.sellers}</div>
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
              {Object.entries(userRoles).map(([key, role]) => (
                <option key={key} value={key}>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membro</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Equipe</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Entrada</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => {
                const role = userRoles[member.role as keyof typeof userRoles];
                const RoleIcon = role.icon;

                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={member.avatar || "/placeholder.svg"}
                            alt={member.name}
                          />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className={`p-1 rounded-full ${role.color}`}>
                          <RoleIcon className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{role.name}</div>
                          <div className="text-xs text-muted-foreground">{role.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.team || "-"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((permission) => (
                          <span key={permission} className="px-2 py-1 text-xs bg-muted rounded">
                            {permission}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          member.status === "ativo"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {member.status}
                      </span>
                    </TableCell>
                    <TableCell>{member.joinDate}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
}

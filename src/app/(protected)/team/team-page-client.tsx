// team/team-page-client.tsx (CLIENT COMPONENT)
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateOrganizationForm } from "./components/organization-form";
import { getOrganizations } from "server/organization";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, UserCheck, Crown, TrendingUp, Shield, Headphones } from "lucide-react";
import Link from "next/link";
import { EditMemberModal } from "./components/edit-member-modal";

type OrganizationType = Awaited<ReturnType<typeof getOrganizations>>;

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

const systemRoleDisplay = {
  Owner: { icon: Crown },
  Admin: { icon: Shield },
  "Gerente de Vendas": { icon: TrendingUp },
  Vendedor: { icon: UserCheck },
  Administrativo: { icon: Shield },
  "Pós-Venda": { icon: Headphones },
};

interface TeamPageClientProps {
  organizations: OrganizationType;
  setHeaderRight?: (node: React.ReactNode) => void;
}

export function TeamPageClient({ organizations }: TeamPageClientProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Função para buscar membros da organização atual
  async function fetchTeamMembers(organizationId: string) {
    try {
      setLoading(true);
      const response = await fetch(`/api/organizations/${organizationId}/members`);
      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }
      const data = await response.json();
      setMembers(data.members);
    } catch (error) {
      console.error(error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }

  // Buscar membros quando organizations mudar
  React.useEffect(() => {
    if (organizations.length > 0) {
      fetchTeamMembers(organizations[0].id);
    }
  }, [organizations]);

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setEditModalOpen(true);
  };

  const handleMemberUpdated = () => {
    if (organizations.length > 0) {
      fetchTeamMembers(organizations[0].id);
    }
  };

  return (
    <div className="p-6">
      <div>
        <div className="flex justify-end gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Criar Time</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Time</DialogTitle>
              </DialogHeader>
              <CreateOrganizationForm />
            </DialogContent>
          </Dialog>
          <div>
            {organizations.map((organization) => (
              <Button variant="outline" key={organization.id} asChild>
                <Link href={`/team/teams/${organization.slug}`}>{organization.name}</Link>
              </Button>
            ))}
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-6">Gerenciamento de Equipe</h1>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Membros da Equipe</CardTitle>
              <CardDescription>Gerencie os membros da sua equipe</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Membro</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Permissões</TableHead>
                    <TableHead>Data de Entrada</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => {
                    const roleInfo = systemRoleDisplay[
                      member.role.name as keyof typeof systemRoleDisplay
                    ] || { color: "bg-gray-500", icon: Users };
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
                              <div className="text-sm text-muted-foreground">
                                {member.user.email}
                              </div>
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
                            <span className="px-2 py-1 text-xs bg-muted rounded">
                              {member.role.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(member.createdAt).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditMember(member)}
                          >
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
      </div>
      <EditMemberModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        member={selectedMember}
        organizationId={organizations.length > 0 ? organizations[0].id : ""}
        onMemberUpdated={handleMemberUpdated}
      />
    </div>
  );
}

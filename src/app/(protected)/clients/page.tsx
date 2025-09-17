"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientModal } from "@/components/client-modal";
import { PermissionButton } from "@/components/rbac/permission-guard";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Phone,
  Mail,
  Filter,
  Loader2,
} from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface Client {
  id: string; // UUID do banco
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "ativo" | "inativo" | "lead" | "cliente";
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  companyId: string; // ID da empresa
  salespersonId?: string; // ID do vendedor responsável (opcional)
}

const statusColors = {
  ativo: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inativo: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  lead: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  cliente: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

// TODO: Implementar contexto de autenticação para obter userId e organizationId
// Por enquanto, vamos usar valores mockados, mas em produção isso viria do contexto
const CURRENT_USER_ID = "user-123"; // Substituir pelo ID do usuário logado
const CURRENT_ORGANIZATION_ID = "org-456"; // Substituir pelo ID da organização ativa

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hook de permissões
  const {
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    loading: permissionsLoading,
  } = usePermissions({
    userId: CURRENT_USER_ID,
    organizationId: CURRENT_ORGANIZATION_ID,
  });

  // Carregar clientes
  useEffect(() => {
    const loadClients = async () => {
      if (permissionsLoading) return;

      if (!canRead("client")) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        setClients([]);
      } catch (err) {
        console.error("Erro ao carregar clientes:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido.");
      } finally {
        setLoading(false);
      }
    };
    loadClients();
  }, [canRead, permissionsLoading]);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || client.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddClient = () => {
    if (!canCreate("client")) return;
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    if (!canUpdate("client")) return;
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!canDelete("client")) return;

    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;

    try {
      // Remove do estado local
      setClients(clients.filter((client) => client.id !== clientId));
    } catch (err) {
      console.error("Erro ao excluir cliente:", err);
      alert("Erro ao excluir cliente");
    }
  };

  const handleSaveClient = async (
    clientData: Omit<Client, "id" | "createdAt" | "updatedAt" | "companyId">
  ) => {
    const hasPermission = editingClient ? canUpdate("client") : canCreate("client");
    if (!hasPermission) return;

    try {
      if (editingClient) {
        setClients(
          clients.map((client) =>
            client.id === editingClient.id
              ? { ...client, ...clientData, updatedAt: new Date() }
              : client
          )
        );
      } else {
        const newClient: Client = {
          ...clientData,
          id: `client-${Date.now()}`, // Temporary ID
          createdAt: new Date(),
          updatedAt: new Date(),
          companyId: CURRENT_ORGANIZATION_ID,
        };
        setClients([...clients, newClient]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar cliente:", err);
      alert("Erro ao salvar cliente");
    }
  };

  // Se não tem permissão para ler clientes, mostrar mensagem
  // if (!canRead("client")) {
  //   return (
  //    <div className="flex items-center justify-center min-h-96">
  //       <div className="text-center">
  //<h2 className="text-2xl font-bold mb-2">Acesso Negado</h2>
  //         <p className="text-muted-foreground">Você não tem permissão para visualizar clientes.</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gerencie todos os seus clientes e leads</p>
        </div>
        <PermissionButton
          userId={CURRENT_USER_ID}
          organizationId={CURRENT_ORGANIZATION_ID}
          permission="create:client"
          onClick={handleAddClient}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Cliente
        </PermissionButton>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Use os filtros abaixo para encontrar clientes específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email ou empresa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="cliente">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {loading
              ? "Carregando clientes..."
              : error
                ? `Erro: ${error}`
                : `${filteredClients.length} cliente(s) encontrado(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Carregando clientes...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p>Erro ao carregar clientes: {error}</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum cliente encontrado.</p>
              {canCreate("client") && (
                <p className="text-sm mt-2">Clique em "Adicionar Cliente" para começar.</p>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={client.avatar || "/placeholder.svg"}
                              alt={client.name}
                            />
                            <AvatarFallback>
                              {client.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{client.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Cliente desde {client.createdAt.toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                            {client.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                            {client.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{client.company}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[client.status]}>
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{client.updatedAt.toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            {canUpdate("client") && (
                              <DropdownMenuItem onClick={() => handleEditClient(client)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                            )}
                            {canDelete("client") && (
                              <>
                                {canUpdate("client") && <DropdownMenuSeparator />}
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClient(client.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveClient}
        client={editingClient ? (convertClientForModal(editingClient) as any) : null}
      />
    </div>
  );
}

// Tipo para o modal (compatibilidade)
type ModalClient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "ativo" | "inativo" | "lead" | "cliente";
  avatar?: string;
  createdAt: string;
  lastContact: string;
};

// Função para converter Client para o formato esperado pelo modal
function convertClientForModal(client: Client): ModalClient {
  return {
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    company: client.company,
    status: client.status,
    avatar: client.avatar,
    createdAt: client.createdAt.toISOString().split("T")[0],
    lastContact: client.updatedAt.toISOString().split("T")[0],
  };
}

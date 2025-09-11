"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Plus, FileText } from "lucide-react";
import { CustomerServiceModal } from "@/components/customer-service-modal";
import { ProposalModal } from "@/components/proposal-modal";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  status: "active" | "inactive" | "prospect";
  lastContact: string;
  proposal?: {
    credit: number;
    term: number;
    installment: number;
    downPayment: number;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
  };
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 99999-9999",
    cpf: "123.456.789-00",
    status: "active",
    lastContact: "2024-01-20",
    proposal: {
      credit: 350000,
      term: 360,
      installment: 2500,
      downPayment: 70000,
      status: "approved",
      createdAt: "2024-01-15",
    },
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "(21) 88888-8888",
    cpf: "987.654.321-00",
    status: "prospect",
    lastContact: "2024-01-22",
    proposal: {
      credit: 45000,
      term: 60,
      installment: 800,
      downPayment: 9000,
      status: "pending",
      createdAt: "2024-01-20",
    },
  },
  {
    id: "3",
    name: "Carlos Oliveira",
    email: "carlos.oliveira@email.com",
    phone: "(31) 77777-7777",
    cpf: "456.789.123-00",
    status: "active",
    lastContact: "2024-01-18",
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "(85) 66666-6666",
    cpf: "321.654.987-00",
    status: "inactive",
    lastContact: "2024-01-10",
    proposal: {
      credit: 180000,
      term: 240,
      installment: 1200,
      downPayment: 36000,
      status: "rejected",
      createdAt: "2024-01-08",
    },
  },
];

export default function CustomerServicePage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.cpf.includes(searchTerm)
  );

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  const handleCreateProposal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsProposalModalOpen(true);
  };

  const handleSaveProposal = (proposalData: any) => {
    if (selectedCustomer) {
      setCustomers(
        customers.map((customer) =>
          customer.id === selectedCustomer.id
            ? {
                ...customer,
                proposal: {
                  ...proposalData,
                  status: "pending" as const,
                  createdAt: new Date().toISOString().split("T")[0],
                },
              }
            : customer
        )
      );
      setIsProposalModalOpen(false);
      setSelectedCustomer(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Ativo", variant: "default" as const },
      inactive: { label: "Inativo", variant: "secondary" as const },
      prospect: { label: "Prospect", variant: "outline" as const },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.prospect;
  };

  const getProposalStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "secondary" as const },
      approved: { label: "Aprovada", variant: "default" as const },
      rejected: { label: "Rejeitada", variant: "destructive" as const },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Atendimento</h1>
          <p className="text-muted-foreground">
            Gerencie o atendimento aos clientes e suas propostas
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {customers.filter((c) => c.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propostas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {customers.filter((c) => c.proposal?.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propostas Aprovadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {customers.filter((c) => c.proposal?.status === "approved").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Cliente</th>
                  <th className="text-left p-4 font-medium">Contato</th>
                  <th className="text-left p-4 font-medium">CPF</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Proposta</th>
                  <th className="text-left p-4 font-medium">Último Contato</th>
                  <th className="text-left p-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => {
                  const statusConfig = getStatusBadge(customer.status);
                  return (
                    <tr key={customer.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="font-medium">{customer.name}</div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="text-sm">{customer.email}</div>
                          <div className="text-sm text-muted-foreground">{customer.phone}</div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-sm">{customer.cpf}</td>
                      <td className="p-4">
                        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                      </td>
                      <td className="p-4">
                        {customer.proposal ? (
                          <div className="space-y-1">
                            <Badge
                              variant={getProposalStatusBadge(customer.proposal.status).variant}
                            >
                              {getProposalStatusBadge(customer.proposal.status).label}
                            </Badge>
                            <div className="text-sm text-muted-foreground">
                              R$ {customer.proposal.credit.toLocaleString("pt-BR")}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Sem proposta</span>
                        )}
                      </td>
                      <td className="p-4 text-sm">
                        {new Date(customer.lastContact).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewCustomer(customer)}
                            title="Ver detalhes do cliente"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {customer.proposal ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewCustomer(customer)}
                              title="Ver proposta"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCreateProposal(customer)}
                              title="Criar proposta"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <CustomerServiceModal
        isOpen={isCustomerModalOpen}
        onClose={() => {
          setIsCustomerModalOpen(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
      />

      <ProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => {
          setIsProposalModalOpen(false);
          setSelectedCustomer(null);
        }}
        onSubmit={handleSaveProposal}
        customer={selectedCustomer}
      />
    </div>
  );
}

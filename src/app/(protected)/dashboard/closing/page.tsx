"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { ClosingModal } from "@/components/closing-modal";

interface Closing {
  id: string;
  client: string;
  cpf: string;
  administrator: string;
  quotas: number;
  tableCommission: string;
  contract: string;
  group: string;
  quota: string;
  credit: number;
  installment: number;
  assemblyDay: number;
  dueDay: number;
  status: "active" | "completed" | "cancelled";
  createdAt: string;
  seller: string;
}

const mockClosings: Closing[] = [
  {
    id: "1",
    client: "João Silva",
    cpf: "123.456.789-00",
    administrator: "Administradora ABC",
    quotas: 5,
    tableCommission: "Tabela A - 3%",
    contract: "CT001234",
    group: "G001",
    quota: "Q005",
    credit: 350000,
    installment: 2500,
    assemblyDay: 15,
    dueDay: 10,
    status: "active",
    createdAt: "2024-01-20",
    seller: "Carlos Vendedor",
  },
  {
    id: "2",
    client: "Maria Santos",
    cpf: "987.654.321-00",
    administrator: "Administradora XYZ",
    quotas: 3,
    tableCommission: "Tabela B - 2.5%",
    contract: "CT001235",
    group: "G002",
    quota: "Q003",
    credit: 180000,
    installment: 1200,
    assemblyDay: 20,
    dueDay: 15,
    status: "completed",
    createdAt: "2024-01-18",
    seller: "Ana Vendedora",
  },
  {
    id: "3",
    client: "Carlos Oliveira",
    cpf: "456.789.123-00",
    administrator: "Administradora DEF",
    quotas: 8,
    tableCommission: "Tabela C - 4%",
    contract: "CT001236",
    group: "G003",
    quota: "Q008",
    credit: 500000,
    installment: 3200,
    assemblyDay: 25,
    dueDay: 20,
    status: "active",
    createdAt: "2024-01-22",
    seller: "Pedro Vendedor",
  },
  {
    id: "4",
    client: "Ana Costa",
    cpf: "321.654.987-00",
    administrator: "Administradora GHI",
    quotas: 2,
    tableCommission: "Tabela A - 3%",
    contract: "CT001237",
    group: "G004",
    quota: "Q002",
    credit: 120000,
    installment: 800,
    assemblyDay: 30,
    dueDay: 25,
    status: "cancelled",
    createdAt: "2024-01-15",
    seller: "Lucas Vendedor",
  },
];

export default function ClosingPage() {
  const [closings, setClosings] = useState<Closing[]>(mockClosings);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClosing, setSelectedClosing] = useState<Closing | null>(null);

  const filteredClosings = closings.filter(
    (closing) =>
      closing.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      closing.cpf.includes(searchTerm) ||
      closing.contract.toLowerCase().includes(searchTerm.toLowerCase()) ||
      closing.administrator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClosing = () => {
    setSelectedClosing(null);
    setIsModalOpen(true);
  };

  const handleEditClosing = (closing: Closing) => {
    setSelectedClosing(closing);
    setIsModalOpen(true);
  };

  const handleSaveClosing = (closingData: Omit<Closing, "id" | "createdAt">) => {
    if (selectedClosing) {
      // Update existing closing
      setClosings(
        closings.map((closing) =>
          closing.id === selectedClosing.id ? { ...closing, ...closingData } : closing
        )
      );
    } else {
      // Add new closing
      const newClosing: Closing = {
        ...closingData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split("T")[0],
      };
      setClosings([newClosing, ...closings]);
    }
    setIsModalOpen(false);
    setSelectedClosing(null);
  };

  const handleDeleteClosing = (id: string) => {
    setClosings(closings.filter((closing) => closing.id !== id));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Ativo", variant: "default" as const },
      completed: { label: "Concluído", variant: "secondary" as const },
      cancelled: { label: "Cancelado", variant: "destructive" as const },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
  };

  const totalCredit = closings
    .filter((c) => c.status === "active")
    .reduce((acc, closing) => acc + closing.credit, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fechamento</h1>
          <p className="text-muted-foreground">Gerencie os fechamentos de vendas e contratos</p>
        </div>
        <Button onClick={handleAddClosing} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Fechamento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Fechamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{closings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {closings.filter((c) => c.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cotas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {closings.filter((c) => c.status === "active").reduce((acc, c) => acc + c.quotas, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crédito Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {(totalCredit / 1000000).toFixed(1)}M</div>
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
                placeholder="Buscar por cliente, CPF, contrato ou administradora..."
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
                  <th className="text-left p-4 font-medium">Contrato</th>
                  <th className="text-left p-4 font-medium">Administradora</th>
                  <th className="text-left p-4 font-medium">Cotas</th>
                  <th className="text-left p-4 font-medium">Crédito</th>
                  <th className="text-left p-4 font-medium">Parcela</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Vendedor</th>
                  <th className="text-left p-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClosings.map((closing) => {
                  const statusConfig = getStatusBadge(closing.status);
                  return (
                    <tr key={closing.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{closing.client}</div>
                          <div className="text-sm text-muted-foreground font-mono">
                            {closing.cpf}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{closing.contract}</div>
                          <div className="text-sm text-muted-foreground">
                            {closing.group} - {closing.quota}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{closing.administrator}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{closing.quotas}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">
                          R$ {closing.credit.toLocaleString("pt-BR")}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">
                          R$ {closing.installment.toLocaleString("pt-BR")}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{closing.seller}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClosing(closing)}
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClosing(closing)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClosing(closing.id)}
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      <ClosingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClosing(null);
        }}
        onSubmit={handleSaveClosing}
        closing={selectedClosing}
      />
    </div>
  );
}

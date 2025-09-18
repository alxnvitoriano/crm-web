"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, Trash2, Phone, Calendar } from "lucide-react";
import { PostSaleModal } from "@/components/post-sale-modal";

interface PostSale {
  id: string;
  client: string;
  contact: string;
  cpf: string;
  administrator: string;
  contract: string;
  group: string;
  quota: string;
  credit: number;
  tableCommission: string;
  installment: number;
  installmentNumber: number;
  bidOffer: number;
  assemblyDay: number;
  dueDay: number;
  seller: string;
  billingStatus: "paid" | "unpaid" | "inactive" | "cancelled" | "reduction" | "dilution";
  lastContact: string;
  notes: string;
  createdAt: string;
}

const mockPostSales: PostSale[] = [
  {
    id: "1",
    client: "João Silva",
    contact: "(11) 99999-9999",
    cpf: "123.456.789-00",
    administrator: "Administradora ABC",
    contract: "CT001234",
    group: "G001",
    quota: "Q005",
    credit: 350000,
    tableCommission: "Tabela A - 3%",
    installment: 2500,
    installmentNumber: 5,
    bidOffer: 15000,
    assemblyDay: 15,
    dueDay: 10,
    seller: "Carlos Vendedor",
    billingStatus: "paid",
    lastContact: "2024-01-20",
    notes: "Cliente em dia com os pagamentos. Satisfeito com o atendimento.",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    client: "Maria Santos",
    contact: "(21) 88888-8888",
    cpf: "987.654.321-00",
    administrator: "Administradora XYZ",
    contract: "CT001235",
    group: "G002",
    quota: "Q003",
    credit: 180000,
    tableCommission: "Tabela B - 2.5%",
    installment: 1200,
    installmentNumber: 8,
    bidOffer: 0,
    assemblyDay: 20,
    dueDay: 15,
    seller: "Ana Vendedora",
    billingStatus: "unpaid",
    lastContact: "2024-01-22",
    notes: "Cliente com atraso na parcela. Entrar em contato para negociação.",
    createdAt: "2024-01-18",
  },
  {
    id: "3",
    client: "Carlos Oliveira",
    contact: "(31) 77777-7777",
    cpf: "456.789.123-00",
    administrator: "Administradora DEF",
    contract: "CT001236",
    group: "G003",
    quota: "Q008",
    credit: 500000,
    tableCommission: "Tabela C - 4%",
    installment: 3200,
    installmentNumber: 12,
    bidOffer: 25000,
    assemblyDay: 25,
    dueDay: 20,
    seller: "Pedro Vendedor",
    billingStatus: "reduction",
    lastContact: "2024-01-23",
    notes: "Cliente solicitou redução de parcela devido a dificuldades financeiras.",
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    client: "Ana Costa",
    contact: "(85) 66666-6666",
    cpf: "321.654.987-00",
    administrator: "Administradora GHI",
    contract: "CT001237",
    group: "G004",
    quota: "Q002",
    credit: 120000,
    tableCommission: "Tabela A - 3%",
    installment: 800,
    installmentNumber: 3,
    bidOffer: 0,
    assemblyDay: 30,
    dueDay: 25,
    seller: "Lucas Vendedor",
    billingStatus: "cancelled",
    lastContact: "2024-01-19",
    notes: "Cliente cancelou o contrato por motivos pessoais.",
    createdAt: "2024-01-16",
  },
];

export default function PostSalePage() {
  const [postSales, setPostSales] = useState<PostSale[]>(mockPostSales);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostSale, setSelectedPostSale] = useState<PostSale | null>(null);

  const filteredPostSales = postSales.filter(
    (postSale) =>
      postSale.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      postSale.cpf.includes(searchTerm) ||
      postSale.contract.toLowerCase().includes(searchTerm.toLowerCase()) ||
      postSale.administrator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPostSale = () => {
    setSelectedPostSale(null);
    setIsModalOpen(true);
  };

  const handleEditPostSale = (postSale: PostSale) => {
    setSelectedPostSale(postSale);
    setIsModalOpen(true);
  };

  const handleSavePostSale = (postSaleData: Omit<PostSale, "id" | "createdAt">) => {
    if (selectedPostSale) {
      // Update existing post sale
      setPostSales(
        postSales.map((postSale) =>
          postSale.id === selectedPostSale.id ? { ...postSale, ...postSaleData } : postSale
        )
      );
    } else {
      // Add new post sale
      const newPostSale: PostSale = {
        ...postSaleData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split("T")[0],
      };
      setPostSales([newPostSale, ...postSales]);
    }
    setIsModalOpen(false);
    setSelectedPostSale(null);
  };

  const handleDeletePostSale = (id: string) => {
    setPostSales(postSales.filter((postSale) => postSale.id !== id));
  };

  const getBillingStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: "Paga", variant: "default" as const },
      unpaid: { label: "Não Paga", variant: "destructive" as const },
      inactive: { label: "Inativo", variant: "secondary" as const },
      cancelled: { label: "Cancelado", variant: "outline" as const },
      reduction: { label: "Redução", variant: "secondary" as const },
      dilution: { label: "Diluição", variant: "secondary" as const },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.unpaid;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pós Venda</h1>
          <p className="text-muted-foreground">Gerencie o acompanhamento pós-venda dos clientes</p>
        </div>
        <Button onClick={handleAddPostSale} className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Pós Venda
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postSales.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {postSales.filter((p) => p.billingStatus === "paid").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Não Pagas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {postSales.filter((p) => p.billingStatus === "unpaid").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {postSales.filter((p) => p.billingStatus === "inactive").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {postSales.filter((p) => p.billingStatus === "cancelled").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reduções</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {
                postSales.filter(
                  (p) => p.billingStatus === "reduction" || p.billingStatus === "dilution"
                ).length
              }
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
                  <th className="text-left p-4 font-medium">Parcela</th>
                  <th className="text-left p-4 font-medium">Situação Cobrança</th>
                  <th className="text-left p-4 font-medium">Último Contato</th>
                  <th className="text-left p-4 font-medium">Vendedor</th>
                  <th className="text-left p-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPostSales.map((postSale) => {
                  const statusConfig = getBillingStatusBadge(postSale.billingStatus);
                  return (
                    <tr key={postSale.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{postSale.client}</div>
                          <div className="text-sm text-muted-foreground font-mono">
                            {postSale.cpf}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {postSale.contact}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{postSale.contract}</div>
                          <div className="text-sm text-muted-foreground">
                            {postSale.group} - {postSale.quota}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{postSale.administrator}</div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">
                            R$ {postSale.installment.toLocaleString("pt-BR")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Parcela {postSale.installmentNumber}/15
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(postSale.lastContact).toLocaleDateString("pt-BR")}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{postSale.seller}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPostSale(postSale)}
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPostSale(postSale)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePostSale(postSale.id)}
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

      <PostSaleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPostSale(null);
        }}
        onSubmit={handleSavePostSale}
        postSale={selectedPostSale}
      />
    </div>
  );
}

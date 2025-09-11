"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Calendar,
  Download,
  Filter,
} from "lucide-react";

// Mock data for charts
const salesPerformanceData = [
  { month: "Jan", vendas: 45, meta: 50, receita: 125000 },
  { month: "Fev", vendas: 52, meta: 50, receita: 145000 },
  { month: "Mar", vendas: 48, meta: 50, receita: 135000 },
  { month: "Abr", vendas: 61, meta: 50, receita: 175000 },
  { month: "Mai", vendas: 55, meta: 50, receita: 165000 },
  { month: "Jun", vendas: 67, meta: 50, receita: 195000 },
];

const conversionFunnelData = [
  { stage: "Leads", count: 1200, percentage: 100 },
  { stage: "Qualificados", count: 480, percentage: 40 },
  { stage: "Propostas", count: 240, percentage: 20 },
  { stage: "Negociação", count: 120, percentage: 10 },
  { stage: "Fechados", count: 60, percentage: 5 },
];

const revenueBySourceData = [
  { source: "Website", value: 450000, color: "#8b5cf6" },
  { source: "Indicações", value: 320000, color: "#3b82f6" },
  { source: "Redes Sociais", value: 180000, color: "#22c55e" },
  { source: "E-mail Marketing", value: 120000, color: "#f97316" },
  { source: "Outros", value: 80000, color: "#ef4444" },
];

const topClientsData = [
  {
    id: 1,
    name: "Tech Solutions Ltda",
    contact: "Ana Silva",
    avatar: "/professional-woman-diverse.png",
    totalValue: 450000,
    deals: 8,
    lastPurchase: "2024-01-20",
    status: "ativo",
  },
  {
    id: 2,
    name: "InovaCorp",
    contact: "Carlos Santos",
    avatar: "/professional-man.png",
    totalValue: 380000,
    deals: 6,
    lastPurchase: "2024-01-18",
    status: "ativo",
  },
  {
    id: 3,
    name: "StartupXYZ",
    contact: "Maria Oliveira",
    avatar: "/professional-user.png",
    totalValue: 320000,
    deals: 5,
    lastPurchase: "2024-01-15",
    status: "ativo",
  },
  {
    id: 4,
    name: "Digital Agency",
    contact: "João Costa",
    totalValue: 280000,
    deals: 4,
    lastPurchase: "2024-01-12",
    status: "ativo",
  },
  {
    id: 5,
    name: "Consultoria Plus",
    contact: "Fernanda Lima",
    totalValue: 250000,
    deals: 7,
    lastPurchase: "2024-01-10",
    status: "inativo",
  },
];

const topDealsData = [
  {
    id: 1,
    title: "Sistema ERP Completo",
    client: "Tech Solutions Ltda",
    value: 180000,
    stage: "fechado",
    closeDate: "2024-01-20",
    salesperson: "João Silva",
  },
  {
    id: 2,
    title: "Plataforma E-commerce",
    client: "InovaCorp",
    value: 150000,
    stage: "negociacao",
    closeDate: "2024-02-15",
    salesperson: "Maria Costa",
  },
  {
    id: 3,
    title: "Consultoria Digital",
    client: "StartupXYZ",
    value: 120000,
    stage: "fechado",
    closeDate: "2024-01-15",
    salesperson: "Pedro Santos",
  },
  {
    id: 4,
    title: "Automação de Processos",
    client: "Digital Agency",
    value: 95000,
    stage: "proposta",
    closeDate: "2024-02-20",
    salesperson: "Ana Lima",
  },
  {
    id: 5,
    title: "Sistema de CRM",
    client: "Consultoria Plus",
    value: 85000,
    stage: "fechado",
    closeDate: "2024-01-10",
    salesperson: "Carlos Oliveira",
  },
];

const teamPerformanceData = [
  {
    name: "João Silva",
    avatar: "/professional-user.png",
    deals: 12,
    revenue: 580000,
    conversionRate: 85,
    avgDealSize: 48333,
  },
  {
    name: "Maria Costa",
    avatar: "/professional-woman-diverse.png",
    deals: 10,
    revenue: 520000,
    conversionRate: 78,
    avgDealSize: 52000,
  },
  {
    name: "Pedro Santos",
    avatar: "/professional-man.png",
    deals: 8,
    revenue: 420000,
    conversionRate: 72,
    avgDealSize: 52500,
  },
  {
    name: "Ana Lima",
    deals: 6,
    revenue: 350000,
    conversionRate: 68,
    avgDealSize: 58333,
  },
];

const statusColors = {
  ativo: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inativo: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  fechado: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  negociacao: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  proposta: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
};

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const calculateGrowth = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios e Análises</h1>
          <p className="text-muted-foreground">Acompanhe o desempenho e métricas do seu negócio</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Último mês</SelectItem>
              <SelectItem value="3months">Últimos 3 meses</SelectItem>
              <SelectItem value="6months">Últimos 6 meses</SelectItem>
              <SelectItem value="1year">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.150.000</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15.2% vs período anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negócios Fechados</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">328</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.7% vs período anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2%</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2.1% vs período anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 3.506</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +6.3% vs período anterior
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Desempenho</TabsTrigger>
          <TabsTrigger value="conversion">Conversão</TabsTrigger>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Vendas vs Meta</CardTitle>
                <CardDescription>
                  Comparação mensal de vendas realizadas com metas estabelecidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="vendas" fill="hsl(var(--primary))" name="Vendas" />
                    <Bar dataKey="meta" fill="hsl(var(--muted))" name="Meta" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evolução da Receita</CardTitle>
                <CardDescription>Crescimento da receita ao longo dos meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Area
                      type="monotone"
                      dataKey="receita"
                      stroke="hsl(var(--accent))"
                      fill="hsl(var(--accent))"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Funil de Conversão</CardTitle>
              <CardDescription>
                Análise do processo de conversão de leads em clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnelData.map((stage, index) => (
                  <div key={stage.stage} className="flex items-center space-x-4">
                    <div className="w-24 text-sm font-medium">{stage.stage}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">{stage.count} leads</span>
                        <span className="text-sm font-medium">{stage.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${stage.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receita por Fonte</CardTitle>
              <CardDescription>Distribuição da receita por canal de aquisição</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueBySourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ source, percentage }) =>
                      `${source} ${(percentage * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueBySourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance da Equipe</CardTitle>
              <CardDescription>Métricas individuais dos vendedores</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Negócios</TableHead>
                    <TableHead>Receita</TableHead>
                    <TableHead>Conversão</TableHead>
                    <TableHead>Ticket Médio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamPerformanceData.map((member) => (
                    <TableRow key={member.name}>
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
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{member.deals}</TableCell>
                      <TableCell>{formatCurrency(member.revenue)}</TableCell>
                      <TableCell>{member.conversionRate}%</TableCell>
                      <TableCell>{formatCurrency(member.avgDealSize)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Clients */}
        <Card>
          <CardHeader>
            <CardTitle>Top Clientes</CardTitle>
            <CardDescription>Clientes com maior valor total em negócios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClientsData.map((client, _index) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                      {index + 1}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={client.avatar || "/placeholder.svg"} alt={client.contact} />
                      <AvatarFallback>
                        {client.contact
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-muted-foreground">{client.contact}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(client.totalValue)}</div>
                    <div className="text-sm text-muted-foreground">{client.deals} negócios</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Deals */}
        <Card>
          <CardHeader>
            <CardTitle>Maiores Negócios</CardTitle>
            <CardDescription>Negócios com maior valor individual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDealsData.map((deal, _index) => (
                <div
                  key={deal.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{deal.title}</div>
                      <div className="text-sm text-muted-foreground">{deal.client}</div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-semibold">{formatCurrency(deal.value)}</div>
                    <Badge
                      className={statusColors[deal.stage as keyof typeof statusColors]}
                      variant="secondary"
                    >
                      {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "recharts";
import {
  Users,
  TrendingUp,
  CheckCircle,
  DollarSign,
  Phone,
  Mail,
  MoreHorizontal,
} from "lucide-react";

// Mock data for charts
const salesData = [
  { month: "Jan", vendas: 45, meta: 50 },
  { month: "Fev", vendas: 52, meta: 50 },
  { month: "Mar", vendas: 48, meta: 50 },
  { month: "Abr", vendas: 61, meta: 50 },
  { month: "Mai", vendas: 55, meta: 50 },
  { month: "Jun", vendas: 67, meta: 50 },
];

const pipelineData = [
  { name: "Leads", value: 120, color: "#8b5cf6" },
  { name: "Negociação", value: 45, color: "#3b82f6" },
  { name: "Fechados", value: 23, color: "#22c55e" },
];

const salesTeamData = [
  {
    id: 1,
    name: "Ana Silva",
    avatar: "/professional-woman-diverse.png",
    clientesAndamento: 12,
    clientesFechados: 8,
    clientesNaoFechados: 4,
    valorTotal: "R$ 125.000",
    performance: 85,
  },
  {
    id: 2,
    name: "Carlos Santos",
    avatar: "/professional-man.png",
    clientesAndamento: 15,
    clientesFechados: 12,
    clientesNaoFechados: 3,
    valorTotal: "R$ 180.000",
    performance: 92,
  },
  {
    id: 3,
    name: "Maria Oliveira",
    avatar: "/professional-woman-diverse.png",
    clientesAndamento: 8,
    clientesFechados: 6,
    clientesNaoFechados: 2,
    valorTotal: "R$ 95.000",
    performance: 78,
  },
  {
    id: 4,
    name: "João Costa",
    avatar: "/professional-man.png",
    clientesAndamento: 10,
    clientesFechados: 7,
    clientesNaoFechados: 3,
    valorTotal: "R$ 110.000",
    performance: 80,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta! Aqui está um resumo das suas atividades.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negócios em Andamento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+8%</span> em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+23%</span> em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 510.000</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sales Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Desempenho de Vendas</CardTitle>
            <CardDescription>Comparação entre vendas realizadas e metas mensais</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vendas" fill="hsl(var(--primary))" />
                <Bar dataKey="meta" fill="hsl(var(--muted))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pipeline Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline de Vendas</CardTitle>
            <CardDescription>Distribuição atual dos leads no funil de vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sales Team Table */}
      <Card>
        <CardHeader>
          <CardTitle>Equipe de Vendas</CardTitle>
          <CardDescription>Desempenho individual dos vendedores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesTeamData.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{member.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Em andamento: {member.clientesAndamento}</span>
                      <span>Fechados: {member.clientesFechados}</span>
                      <span>Não fechados: {member.clientesNaoFechados}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-semibold">{member.valorTotal}</div>
                    <div className="text-sm text-muted-foreground">Total em cotas</div>
                  </div>

                  <div className="w-24">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Performance</span>
                      <span>{member.performance}%</span>
                    </div>
                    <Progress value={member.performance} className="h-2" />
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

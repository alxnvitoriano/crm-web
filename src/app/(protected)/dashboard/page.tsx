"use client";

import { useState, useEffect } from "react";
import { headers } from "next/headers"; // This will be removed as it's a client component
import { redirect } from "next/navigation"; // This will be removed as it's a client component

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { auth } from "@/lib/auth"; // This will be removed as it's a client component
import { DatePicker } from "./_components/date-picker";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  TrendingUp,
  Users,
  Percent,
  ClipboardList,
  Wallet,
  DollarSign,
  Award,
} from "lucide-react";
import { useOrganizationContext } from "@/lib/use-organization-context"; // Assuming this context exists or will be created

interface SalesMetrics {
  leadsReceivedBySalesperson: Array<{
    salespersonId: string;
    salespersonName: string;
    count: number;
  }>;
  appointmentConversion: number;
  clientCount: number;
}

interface SalesRanking {
  salespersonId: string;
  salespersonName: string;
  salespersonAvatar?: string;
  leadsCount: number;
  clientsCount: number;
}

const DashboardPage = () => {
  // Changed to client component
  const { currentOrganization } = useOrganizationContext(); // Assuming this context provides the current organization ID
  const organizationId = currentOrganization?.id;

  const [metrics, setMetrics] = useState<SalesMetrics | null>(null);
  const [ranking, setRanking] = useState<SalesRanking[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingRanking, setLoadingRanking] = useState(true);
  const [errorMetrics, setErrorMetrics] = useState<string | null>(null);
  const [errorRanking, setErrorRanking] = useState<string | null>(null);

  useEffect(() => {
    if (!organizationId) {
      setLoadingMetrics(false);
      setLoadingRanking(false);
      return;
    }

    const fetchMetrics = async () => {
      setLoadingMetrics(true);
      setErrorMetrics(null);
      try {
        const response = await fetch(
          `/api/dashboard/sales-metrics?organizationId=${organizationId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch sales metrics");
        }
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        console.error("Error fetching sales metrics:", err);
        setErrorMetrics(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoadingMetrics(false);
      }
    };

    const fetchRanking = async () => {
      setLoadingRanking(true);
      setErrorRanking(null);
      try {
        const response = await fetch(
          `/api/dashboard/sales-ranking?organizationId=${organizationId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch sales ranking");
        }
        const data = await response.json();
        setRanking(data.ranking || []);
      } catch (err) {
        console.error("Error fetching sales ranking:", err);
        setErrorRanking(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoadingRanking(false);
      }
    };

    fetchMetrics();
    fetchRanking();
  }, [organizationId]);

  // Helper para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard de Vendas</PageTitle>
          <PageDescription>Tenha uma visão geral do seu negócio.</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <DatePicker />
        </PageActions>
      </PageHeader>
      <PageContent>
        {/* Sales Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quantidade de Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingMetrics ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : errorMetrics ? (
                <p className="text-sm text-destructive">Erro</p>
              ) : (
                <div className="text-2xl font-bold">{metrics?.clientCount || 0}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversão de Agendamentos</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingMetrics ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : errorMetrics ? (
                <p className="text-sm text-destructive">Erro</p>
              ) : (
                <div className="text-2xl font-bold">
                  {metrics?.appointmentConversion.toFixed(2) || 0}%
                </div>
              )}
            </CardContent>
          </Card>
          {/* TODO: Add these when schema is updated */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Vendido</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 0,00</div> {/* Placeholder */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 0,00</div> {/* Placeholder */}
            </CardContent>
          </Card>
        </div>

        {/* Leads Received by Salesperson */}
        <Card>
          <CardHeader>
            <CardTitle>Quantidade de Leads Recebidos por Vendedor</CardTitle>
            <PageDescription>Leads atribuídos a cada vendedor.</PageDescription>
          </CardHeader>
          <CardContent>
            {loadingMetrics ? (
              <div className="flex justify-center items-center h-24">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : errorMetrics ? (
              <p className="text-sm text-destructive text-center">
                Erro ao carregar leads por vendedor.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendedor</TableHead>
                    <TableHead className="text-right">Leads Recebidos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics?.leadsReceivedBySalesperson &&
                  metrics.leadsReceivedBySalesperson.length > 0 ? (
                    metrics.leadsReceivedBySalesperson.map((item) => (
                      <TableRow key={item.salespersonId}>
                        <TableCell>{item.salespersonName}</TableCell>
                        <TableCell className="text-right">{item.count}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground">
                        Nenhum lead encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Sales Ranking */}
        <Card>
          <CardHeader>
            <CardTitle>Ranking de Vendas</CardTitle>
            <PageDescription>
              Colocação dos vendedores por quantidade de clientes convertidos.
            </PageDescription>
          </CardHeader>
          <CardContent>
            {loadingRanking ? (
              <div className="flex justify-center items-center h-24">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : errorRanking ? (
              <p className="text-sm text-destructive text-center">
                Erro ao carregar ranking de vendas.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Colocação</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead className="text-right">Clientes Convertidos</TableHead>
                    <TableHead className="text-right">Leads</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ranking.length > 0 ? (
                    ranking.map((item, index) => (
                      <TableRow key={item.salespersonId}>
                        <TableCell className="font-medium">
                          <Badge variant="secondary" className="mr-2">
                            #{index + 1}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={item.salespersonAvatar || "/placeholder-user.jpg"}
                                alt={item.salespersonName}
                              />
                              <AvatarFallback>{item.salespersonName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{item.salespersonName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{item.clientsCount}</TableCell>
                        <TableCell className="text-right">{item.leadsCount}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Nenhum vendedor no ranking.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </PageContent>
    </PageContainer>
  );
};

export default DashboardPage;

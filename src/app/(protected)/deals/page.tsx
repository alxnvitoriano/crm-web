"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DealModal } from "@/components/deal-modal";
import { Plus, DollarSign, Calendar, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Deal {
  id: number;
  title: string;
  client: string;
  clientAvatar?: string;
  value: number;
  stage: "lead" | "negociacao" | "fechado";
  priority: "baixa" | "media" | "alta";
  dueDate: string;
  createdAt: string;
  description?: string;
}

const stages = [
  {
    id: "lead",
    title: "Leads",
    description: "Novos contatos e oportunidades",
    color: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
  },
  {
    id: "negociacao",
    title: "Negociação",
    description: "Em processo de negociação",
    color: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
  },
  {
    id: "fechado",
    title: "Fechados",
    description: "Negócios concluídos com sucesso",
    color: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
  },
];

const priorityColors = {
  baixa: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  media: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  alta: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);

  const handleAddDeal = () => {
    setEditingDeal(null);
    setIsModalOpen(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    setIsModalOpen(true);
  };

  const handleDeleteDeal = (dealId: number) => {
    setDeals(deals.filter((deal) => deal.id !== dealId));
  };

  const handleSaveDeal = (dealData: Omit<Deal, "id" | "createdAt">) => {
    if (editingDeal) {
      setDeals(deals.map((deal) => (deal.id === editingDeal.id ? { ...deal, ...dealData } : deal)));
    } else {
      const newDeal: Deal = {
        ...dealData,
        id: Math.max(...deals.map((d) => d.id)) + 1,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setDeals([...deals, newDeal]);
    }
    setIsModalOpen(false);
  };

  const handleDragStart = (deal: Deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStage: string) => {
    e.preventDefault();
    if (draggedDeal && draggedDeal.stage !== newStage) {
      setDeals(
        deals.map((deal) =>
          deal.id === draggedDeal.id ? { ...deal, stage: newStage as Deal["stage"] } : deal
        )
      );
    }
    setDraggedDeal(null);
  };

  const getDealsForStage = (stageId: string) => {
    return deals.filter((deal) => deal.stage === stageId);
  };

  const getTotalValueForStage = (stageId: string) => {
    return getDealsForStage(stageId).reduce((total, deal) => total + deal.value, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pipeline de Negócios</h1>
          <p className="text-muted-foreground">Gerencie seus negócios através do funil de vendas</p>
        </div>
        <Button onClick={handleAddDeal} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Negócio
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stages.map((stage) => {
          const stageDeals = getDealsForStage(stage.id);
          const totalValue = getTotalValueForStage(stage.id);

          return (
            <Card key={stage.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{stage.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stageDeals.length}</div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(totalValue)} em negócios
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={`rounded-lg border-2 border-dashed p-4 min-h-[600px] ${stage.color}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className="mb-4">
              <h3 className="font-semibold text-lg">{stage.title}</h3>
              <p className="text-sm text-muted-foreground">{stage.description}</p>
              <div className="mt-2 text-sm font-medium">
                {getDealsForStage(stage.id).length} negócio(s) •{" "}
                {formatCurrency(getTotalValueForStage(stage.id))}
              </div>
            </div>

            <div className="space-y-3">
              {getDealsForStage(stage.id).map((deal) => (
                <Card
                  key={deal.id}
                  className="cursor-move hover:shadow-md transition-shadow bg-card"
                  draggable
                  onDragStart={() => handleDragStart(deal)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-medium line-clamp-2">
                        {deal.title}
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditDeal(deal)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteDeal(deal.id)}
                            className="text-destructive"
                          >
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={deal.clientAvatar || "/placeholder.svg"}
                          alt={deal.client}
                        />
                        <AvatarFallback className="text-xs">
                          {deal.client
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{deal.client}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-sm font-semibold text-green-600">
                        <DollarSign className="h-3 w-3" />
                        <span>{formatCurrency(deal.value)}</span>
                      </div>
                      <Badge className={priorityColors[deal.priority]} variant="secondary">
                        {deal.priority.charAt(0).toUpperCase() + deal.priority.slice(1)}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Prazo: {new Date(deal.dueDate).toLocaleDateString("pt-BR")}</span>
                    </div>

                    {deal.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {deal.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Deal Modal */}
      <DealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDeal}
        deal={editingDeal}
      />
    </div>
  );
}

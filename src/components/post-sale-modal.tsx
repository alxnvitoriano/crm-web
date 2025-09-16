"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface PostSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postSale: Omit<PostSale, "id" | "createdAt">) => void;
  postSale?: PostSale | null;
}

export function PostSaleModal({ isOpen, onClose, onSubmit, postSale }: PostSaleModalProps) {
  const [formData, setFormData] = useState({
    client: "",
    contact: "",
    cpf: "",
    administrator: "",
    contract: "",
    group: "",
    quota: "",
    credit: 0,
    tableCommission: "",
    installment: 0,
    installmentNumber: 2,
    bidOffer: 0,
    assemblyDay: 1,
    dueDay: 1,
    seller: "",
    billingStatus: "unpaid" as const,
    lastContact: "",
    notes: "",
  });

  useEffect(() => {
    if (postSale) {
      setFormData({
        client: postSale.client,
        contact: postSale.contact,
        cpf: postSale.cpf,
        administrator: postSale.administrator,
        contract: postSale.contract,
        group: postSale.group,
        quota: postSale.quota,
        credit: postSale.credit,
        tableCommission: postSale.tableCommission,
        installment: postSale.installment,
        installmentNumber: postSale.installmentNumber,
        bidOffer: postSale.bidOffer,
        assemblyDay: postSale.assemblyDay,
        dueDay: postSale.dueDay,
        seller: postSale.seller,
        billingStatus: postSale.billingStatus as any,
        lastContact: postSale.lastContact,
        notes: postSale.notes,
      });
    } else {
      setFormData({
        client: "",
        contact: "",
        cpf: "",
        administrator: "",
        contract: "",
        group: "",
        quota: "",
        credit: 0,
        tableCommission: "",
        installment: 0,
        installmentNumber: 2,
        bidOffer: 0,
        assemblyDay: 1,
        dueDay: 1,
        seller: "",
        billingStatus: "unpaid",
        lastContact: "",
        notes: "",
      });
    }
  }, [postSale, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const administrators = [
    "Administradora ABC",
    "Administradora XYZ",
    "Administradora DEF",
    "Administradora GHI",
    "Administradora JKL",
  ];

  const tableCommissions = [
    "Tabela A - 3%",
    "Tabela B - 2.5%",
    "Tabela C - 4%",
    "Tabela D - 3.5%",
    "Tabela E - 2%",
  ];

  const sellers = [
    "Carlos Vendedor",
    "Ana Vendedora",
    "Pedro Vendedor",
    "Lucas Vendedor",
    "Maria Vendedora",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{postSale ? "Editar Pós Venda" : "Novo Pós Venda"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados do Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Cliente *</Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) => handleInputChange("client", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contato *</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => handleInputChange("contact", e.target.value)}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange("cpf", e.target.value)}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seller">Vendedor *</Label>
                <Select
                  value={formData.seller}
                  onValueChange={(value) => handleInputChange("seller", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o vendedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {sellers.map((seller) => (
                      <SelectItem key={seller} value={seller}>
                        {seller}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Dados do Contrato */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados do Contrato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="administrator">Administradora *</Label>
                <Select
                  value={formData.administrator}
                  onValueChange={(value) => handleInputChange("administrator", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a administradora" />
                  </SelectTrigger>
                  <SelectContent>
                    {administrators.map((admin) => (
                      <SelectItem key={admin} value={admin}>
                        {admin}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contract">Contrato *</Label>
                <Input
                  id="contract"
                  value={formData.contract}
                  onChange={(e) => handleInputChange("contract", e.target.value)}
                  placeholder="CT001234"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group">Grupo *</Label>
                <Input
                  id="group"
                  value={formData.group}
                  onChange={(e) => handleInputChange("group", e.target.value)}
                  placeholder="G001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quota">Cota *</Label>
                <Input
                  id="quota"
                  value={formData.quota}
                  onChange={(e) => handleInputChange("quota", e.target.value)}
                  placeholder="Q005"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credit">Crédito (R$) *</Label>
                <Input
                  id="credit"
                  type="number"
                  value={formData.credit}
                  onChange={(e) => handleInputChange("credit", Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tableCommission">Tabela/Comissão *</Label>
                <Select
                  value={formData.tableCommission}
                  onValueChange={(value) => handleInputChange("tableCommission", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a tabela de comissão" />
                  </SelectTrigger>
                  <SelectContent>
                    {tableCommissions.map((table) => (
                      <SelectItem key={table} value={table}>
                        {table}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Dados Financeiros */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados Financeiros</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="installment">Parcela (R$) *</Label>
                <Input
                  id="installment"
                  type="number"
                  value={formData.installment}
                  onChange={(e) => handleInputChange("installment", Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="installmentNumber">Nº da Parcela (2-15) *</Label>
                <Input
                  id="installmentNumber"
                  type="number"
                  min="2"
                  max="15"
                  value={formData.installmentNumber}
                  onChange={(e) => handleInputChange("installmentNumber", Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bidOffer">Oferta de Lance (R$)</Label>
                <Input
                  id="bidOffer"
                  type="number"
                  value={formData.bidOffer}
                  onChange={(e) => handleInputChange("bidOffer", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingStatus">Situação da Cobrança *</Label>
                <Select
                  value={formData.billingStatus}
                  onValueChange={(value) => handleInputChange("billingStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paga</SelectItem>
                    <SelectItem value="unpaid">Não Paga</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                    <SelectItem value="reduction">Redução</SelectItem>
                    <SelectItem value="dilution">Diluição</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Datas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Datas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assemblyDay">Dia da Assembleia *</Label>
                <Input
                  id="assemblyDay"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.assemblyDay}
                  onChange={(e) => handleInputChange("assemblyDay", Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDay">Dia do Vencimento *</Label>
                <Input
                  id="dueDay"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.dueDay}
                  onChange={(e) => handleInputChange("dueDay", Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastContact">Último Contato</Label>
                <Input
                  id="lastContact"
                  type="date"
                  value={formData.lastContact}
                  onChange={(e) => handleInputChange("lastContact", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Observações</h3>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas do pós-venda</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Descreva o acompanhamento do cliente, situação atual, próximas ações..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{postSale ? "Atualizar" : "Salvar"} Pós Venda</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

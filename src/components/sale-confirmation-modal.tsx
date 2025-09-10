"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileSignature, CreditCard, FileText, CheckCircle, X, Upload } from "lucide-react";

interface SaleConfirmation {
  id: string;
  client: string;
  cpf: string;
  contract: string;
  credit: number;
  installment: number;
  seller: string;
  signature: {
    status: "pending" | "signed" | "rejected";
    signedAt?: string;
    signedBy?: string;
  };
  payment: {
    status: "pending" | "paid" | "failed";
    method?: string;
    amount?: number;
    paidAt?: string;
    transactionId?: string;
  };
  documentation: {
    status: "pending" | "sent" | "received" | "complete";
    sentAt?: string;
    receivedAt?: string;
    documents: string[];
  };
  overallStatus: "pending" | "in-progress" | "completed" | "cancelled";
  createdAt: string;
}

interface SaleConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (confirmationData: any) => void;
  confirmation?: SaleConfirmation | null;
}

export function SaleConfirmationModal({
  isOpen,
  onClose,
  onSubmit,
  confirmation,
}: SaleConfirmationModalProps) {
  const [activeTab, setActiveTab] = useState<"signature" | "payment" | "documentation">(
    "signature"
  );
  const [formData, setFormData] = useState({
    signature: {
      status: "pending" as const,
      signedAt: "",
      signedBy: "",
    },
    payment: {
      status: "pending" as const,
      method: "",
      amount: 0,
      paidAt: "",
      transactionId: "",
    },
    documentation: {
      status: "pending" as const,
      sentAt: "",
      receivedAt: "",
      documents: [] as string[],
    },
  });

  useEffect(() => {
    if (confirmation) {
      setFormData({
        signature: confirmation.signature,
        payment: confirmation.payment,
        documentation: confirmation.documentation,
      });
    }
  }, [confirmation, isOpen]);

  const handleSubmit = () => {
    // Calculate overall status based on individual statuses
    let overallStatus: SaleConfirmation["overallStatus"] = "pending";

    if (
      formData.signature.status === "signed" &&
      formData.payment.status === "paid" &&
      formData.documentation.status === "complete"
    ) {
      overallStatus = "completed";
    } else if (formData.signature.status === "rejected" || formData.payment.status === "failed") {
      overallStatus = "cancelled";
    } else if (
      formData.signature.status === "signed" ||
      formData.payment.status === "paid" ||
      formData.documentation.status !== "pending"
    ) {
      overallStatus = "in-progress";
    }

    onSubmit({
      ...formData,
      overallStatus,
    });
  };

  const handleSignatureUpdate = (status: "signed" | "rejected") => {
    setFormData((prev) => ({
      ...prev,
      signature: {
        ...prev.signature,
        status,
        signedAt: status === "signed" ? new Date().toISOString().split("T")[0] : "",
        signedBy: status === "signed" ? confirmation?.client || "" : "",
      },
    }));
  };

  const handlePaymentUpdate = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        [field]: value,
        ...(field === "status" && value === "paid"
          ? { paidAt: new Date().toISOString().split("T")[0] }
          : field === "status" && value !== "paid"
            ? { paidAt: "" }
            : {}),
      },
    }));
  };

  const handleDocumentationUpdate = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      documentation: {
        ...prev.documentation,
        [field]: value,
        ...(field === "status" && value === "sent"
          ? { sentAt: new Date().toISOString().split("T")[0] }
          : field === "status" && value === "received"
            ? { receivedAt: new Date().toISOString().split("T")[0] }
            : field === "status" && value === "complete"
              ? {
                  sentAt: prev.documentation.sentAt || new Date().toISOString().split("T")[0],
                  receivedAt: new Date().toISOString().split("T")[0],
                }
              : {}),
      },
    }));
  };

  const addDocument = () => {
    const newDoc = `Documento ${formData.documentation.documents.length + 1}`;
    setFormData((prev) => ({
      ...prev,
      documentation: {
        ...prev.documentation,
        documents: [...prev.documentation.documents, newDoc],
      },
    }));
  };

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documentation: {
        ...prev.documentation,
        documents: prev.documentation.documents.filter((_, i) => i !== index),
      },
    }));
  };

  if (!confirmation) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "signed":
      case "paid":
      case "complete":
        return "text-green-600";
      case "rejected":
      case "failed":
        return "text-red-600";
      case "sent":
      case "received":
        return "text-blue-600";
      default:
        return "text-gray-400";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Confirmação de Venda - {confirmation.client}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações da Venda</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Cliente</Label>
                <p className="font-medium">{confirmation.client}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">CPF</Label>
                <p className="font-mono">{confirmation.cpf}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Contrato</Label>
                <p className="font-medium">{confirmation.contract}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Crédito</Label>
                <p className="font-medium">R$ {confirmation.credit.toLocaleString("pt-BR")}</p>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <Button
              variant={activeTab === "signature" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("signature")}
              className="flex-1"
            >
              <FileSignature className="h-4 w-4 mr-2" />
              Assinatura
            </Button>
            <Button
              variant={activeTab === "payment" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("payment")}
              className="flex-1"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Pagamento
            </Button>
            <Button
              variant={activeTab === "documentation" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("documentation")}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              Documentação
            </Button>
          </div>

          {/* Tab Content */}
          {activeTab === "signature" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSignature
                    className={`h-5 w-5 ${getStatusColor(formData.signature.status)}`}
                  />
                  Assinatura Digital
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      formData.signature.status === "signed"
                        ? "default"
                        : formData.signature.status === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {formData.signature.status === "signed"
                      ? "Assinado"
                      : formData.signature.status === "rejected"
                        ? "Rejeitado"
                        : "Pendente"}
                  </Badge>
                </div>

                {formData.signature.status === "pending" && (
                  <div className="flex gap-4">
                    <Button onClick={() => handleSignatureUpdate("signed")} className="gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Confirmar Assinatura
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleSignatureUpdate("rejected")}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Rejeitar
                    </Button>
                  </div>
                )}

                {formData.signature.status === "signed" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Assinado por
                      </Label>
                      <p>{formData.signature.signedBy}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Data da assinatura
                      </Label>
                      <p>
                        {formData.signature.signedAt &&
                          new Date(formData.signature.signedAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className={`h-5 w-5 ${getStatusColor(formData.payment.status)}`} />
                  Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentStatus">Status do Pagamento</Label>
                    <Select
                      value={formData.payment.status}
                      onValueChange={(value) => handlePaymentUpdate("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="paid">Pago</SelectItem>
                        <SelectItem value="failed">Falhou</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Método de Pagamento</Label>
                    <Select
                      value={formData.payment.method || ""}
                      onValueChange={(value) => handlePaymentUpdate("method", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PIX">PIX</SelectItem>
                        <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                        <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                        <SelectItem value="Transferência Bancária">
                          Transferência Bancária
                        </SelectItem>
                        <SelectItem value="Boleto">Boleto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentAmount">Valor (R$)</Label>
                    <Input
                      id="paymentAmount"
                      type="number"
                      value={formData.payment.amount || ""}
                      onChange={(e) => handlePaymentUpdate("amount", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transactionId">ID da Transação</Label>
                    <Input
                      id="transactionId"
                      value={formData.payment.transactionId || ""}
                      onChange={(e) => handlePaymentUpdate("transactionId", e.target.value)}
                      placeholder="ID ou referência do pagamento"
                    />
                  </div>
                </div>

                {formData.payment.status === "paid" && formData.payment.paidAt && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Data do Pagamento
                    </Label>
                    <p>{new Date(formData.payment.paidAt).toLocaleDateString("pt-BR")}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "documentation" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText
                    className={`h-5 w-5 ${getStatusColor(formData.documentation.status)}`}
                  />
                  Documentação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="docStatus">Status da Documentação</Label>
                  <Select
                    value={formData.documentation.status}
                    onValueChange={(value) => handleDocumentationUpdate("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="sent">Enviada</SelectItem>
                      <SelectItem value="received">Recebida</SelectItem>
                      <SelectItem value="complete">Completa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Documentos</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addDocument}
                      className="gap-2 bg-transparent"
                    >
                      <Upload className="h-4 w-4" />
                      Adicionar Documento
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {formData.documentation.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <span>{doc}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeDocument(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {formData.documentation.documents.length === 0 && (
                      <p className="text-muted-foreground text-sm">Nenhum documento adicionado</p>
                    )}
                  </div>
                </div>

                {(formData.documentation.sentAt || formData.documentation.receivedAt) && (
                  <div className="grid grid-cols-2 gap-4">
                    {formData.documentation.sentAt && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Data de Envio
                        </Label>
                        <p>{new Date(formData.documentation.sentAt).toLocaleDateString("pt-BR")}</p>
                      </div>
                    )}
                    {formData.documentation.receivedAt && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Data de Recebimento
                        </Label>
                        <p>
                          {new Date(formData.documentation.receivedAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Salvar Alterações</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

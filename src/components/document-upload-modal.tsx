"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Eye } from "lucide-react";

interface CustomerDocument {
  id: string;
  customerId: string;
  customerName: string;
  customerCpf: string;
  documents: {
    cpfFront?: string;
    cpfBack?: string;
    rgFront?: string;
    rgBack?: string;
  };
  status: "pending" | "approved" | "rejected" | "incomplete";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (documentData: any) => void;
  document?: CustomerDocument | null;
}

export function DocumentUploadModal({
  isOpen,
  onClose,
  onSubmit,
  document,
}: DocumentUploadModalProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerCpf: "",
    documents: {
      cpfFront: "",
      cpfBack: "",
      rgFront: "",
      rgBack: "",
    },
    notes: "",
  });

  useEffect(() => {
    if (document) {
      setFormData({
        customerName: document.customerName,
        customerCpf: document.customerCpf,
        documents: {
          cpfFront: document.documents?.cpfFront || "",
          cpfBack: document.documents?.cpfBack || "",
          rgFront: document.documents?.rgFront || "",
          rgBack: document.documents?.rgBack || "",
        },
        notes: document.notes || "",
      });
    } else {
      setFormData({
        customerName: "",
        customerCpf: "",
        documents: {
          cpfFront: "",
          cpfBack: "",
          rgFront: "",
          rgBack: "",
        },
        notes: "",
      });
    }
  }, [document, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDocumentChange = (docType: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: value,
      },
    }));
  };

  const handleFileUpload = (docType: string) => {
    // Simular upload de arquivo
    const placeholderUrl = `/placeholder.svg?height=200&width=300&query=${docType} documento`;
    handleDocumentChange(docType, placeholderUrl);
  };

  const removeDocument = (docType: string) => {
    handleDocumentChange(docType, "");
  };

  const documentTypes = [
    { key: "cpfFront", label: "CPF - Frente" },
    { key: "cpfBack", label: "CPF - Verso" },
    { key: "rgFront", label: "RG - Frente" },
    { key: "rgBack", label: "RG - Verso" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {document ? "Visualizar Ficha Cadastral" : "Nova Ficha Cadastral Digital"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados do Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nome do Cliente *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  required
                  disabled={!!document}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerCpf">CPF *</Label>
                <Input
                  id="customerCpf"
                  value={formData.customerCpf}
                  onChange={(e) => handleInputChange("customerCpf", e.target.value)}
                  placeholder="000.000.000-00"
                  required
                  disabled={!!document}
                />
              </div>
            </div>
          </div>

          {/* Upload de Documentos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Documentos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentTypes.map(({ key, label }) => (
                <Card key={key}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {formData.documents[key as keyof typeof formData.documents] ? (
                      <div className="space-y-2">
                        <div className="relative">
                          <img
                            src={
                              formData.documents[key as keyof typeof formData.documents] ||
                              "/placeholder.svg"
                            }
                            alt={label}
                            className="w-full h-32 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => removeDocument(key)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(
                                formData.documents[key as keyof typeof formData.documents],
                                "_blank"
                              )
                            }
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </Button>
                          {!document && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleFileUpload(key)}
                              className="flex-1"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Substituir
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-32 border-dashed bg-transparent"
                        onClick={() => handleFileUpload(key)}
                        disabled={!!document}
                      >
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Clique para fazer upload</p>
                        </div>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Observações */}
          {document && document.notes && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Observações</h3>
              <div className="space-y-2">
                <Label htmlFor="notes">Notas da Revisão</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Observações sobre a análise dos documentos..."
                  rows={3}
                  disabled
                />
              </div>
            </div>
          )}

          {!document && (
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Ficha Cadastral</Button>
            </div>
          )}

          {document && (
            <div className="flex justify-end">
              <Button type="button" onClick={onClose}>
                Fechar
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

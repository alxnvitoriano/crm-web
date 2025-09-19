"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Camera, Upload } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, isLoading, refreshSession } = useSession();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      setFirstName(user.name?.split(" ")[0] || "");
      setLastName(user.name?.split(" ").slice(1).join(" ") || "");
      setImage(user.image || null);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          image,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Perfil atualizado com sucesso");
        refreshSession();
        router.refresh();
      } else {
        toast.error(data.error || "Erro ao atualizar perfil");
      }
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas preferências e configurações da conta.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Atualize suas informações pessoais.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="image-upload" className="cursor-pointer">
                <Avatar className="h-20 w-20">
                  {image ? (
                    <AvatarImage src={image} alt="Avatar" />
                  ) : (
                    <>
                      <AvatarFallback>
                        <Camera className="h-8 w-8" />
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Seu sobrenome"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email || ""} disabled readOnly />
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Configure como você deseja receber notificações.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por email</Label>
                <p className="text-sm text-muted-foreground">Receba atualizações por email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações push</Label>
                <p className="text-sm text-muted-foreground">Receba notificações no navegador</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>Gerencie a segurança da sua conta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">Alterar Senha</Button>
            <Separator />
            <div className="space-y-2">
              <Label>Autenticação de dois fatores</Label>
              <p className="text-sm text-muted-foreground">
                Adicione uma camada extra de segurança à sua conta.
              </p>
              <Button variant="outline">Configurar 2FA</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

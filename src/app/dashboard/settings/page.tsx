"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "next-themes";
import { User, Bell, Shield, Palette, Globe, Save, Eye, EyeOff, Camera, Phone } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "João Silva",
    email: "joao@empresa.com",
    phone: "(11) 99999-9999",
    position: "Gerente de Vendas",
    department: "Vendas",
    location: "São Paulo, SP",
    bio: "Especialista em vendas com mais de 5 anos de experiência em CRM e gestão de relacionamento com clientes.",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    taskReminders: true,
    dealUpdates: true,
    clientMessages: true,
    weeklyReports: true,
    marketingEmails: false,
  });

  // System preferences state
  const [systemPreferences, setSystemPreferences] = useState({
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
    dateFormat: "DD/MM/YYYY",
    currency: "BRL",
    startPage: "dashboard",
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update
    console.warn("Profile updated:", profileData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change
    console.warn("Password changed");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handlePreferenceChange = (key: string, value: string) => {
    setSystemPreferences((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências e configurações da conta</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>Aparência</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Segurança</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações de perfil e dados de contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/professional-user.png" alt="Profile" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Alterar Foto
                  </Button>
                  <p className="text-xs text-muted-foreground">JPG, PNG ou GIF. Máximo 2MB.</p>
                </div>
              </div>

              <Separator />

              {/* Profile Form */}
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Cargo</Label>
                    <Input
                      id="position"
                      value={profileData.position}
                      onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Departamento</Label>
                    <Select
                      value={profileData.department}
                      onValueChange={(value) =>
                        setProfileData({ ...profileData, department: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vendas">Vendas</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Suporte">Suporte</SelectItem>
                        <SelectItem value="Administração">Administração</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Localização</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure como e quando você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações por E-mail</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações importantes por e-mail
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("emailNotifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações Push</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações no navegador
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("pushNotifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações por SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba alertas importantes por SMS
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("smsNotifications", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Lembretes de Tarefas</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificações sobre tarefas pendentes
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.taskReminders}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("taskReminders", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Atualizações de Negócios</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificações sobre mudanças nos negócios
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.dealUpdates}
                    onCheckedChange={(checked) => handleNotificationChange("dealUpdates", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mensagens de Clientes</Label>
                    <p className="text-sm text-muted-foreground">Notificações de novas mensagens</p>
                  </div>
                  <Switch
                    checked={notificationSettings.clientMessages}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("clientMessages", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Relatórios Semanais</Label>
                    <p className="text-sm text-muted-foreground">Resumo semanal de atividades</p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("weeklyReports", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>E-mails de Marketing</Label>
                    <p className="text-sm text-muted-foreground">
                      Novidades e dicas sobre o sistema
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("marketingEmails", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aparência e Tema</CardTitle>
              <CardDescription>Personalize a aparência da interface do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("light")}
                    >
                      Claro
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("dark")}
                    >
                      Escuro
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("system")}
                    >
                      Sistema
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Escolha entre tema claro, escuro ou seguir as configurações do sistema
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Idioma</Label>
                    <Select
                      value={systemPreferences.language}
                      onValueChange={(value) => handlePreferenceChange("language", value)}
                    >
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Fuso Horário</Label>
                    <Select
                      value={systemPreferences.timezone}
                      onValueChange={(value) => handlePreferenceChange("timezone", value)}
                    >
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                        <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Formato de Data</Label>
                    <Select
                      value={systemPreferences.dateFormat}
                      onValueChange={(value) => handlePreferenceChange("dateFormat", value)}
                    >
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Moeda</Label>
                    <Select
                      value={systemPreferences.currency}
                      onValueChange={(value) => handlePreferenceChange("currency", value)}
                    >
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">Real (R$)</SelectItem>
                        <SelectItem value="USD">Dólar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Página Inicial</Label>
                    <Select
                      value={systemPreferences.startPage}
                      onValueChange={(value) => handlePreferenceChange("startPage", value)}
                    >
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dashboard">Dashboard</SelectItem>
                        <SelectItem value="clients">Clientes</SelectItem>
                        <SelectItem value="deals">Negócios</SelectItem>
                        <SelectItem value="tasks">Tarefas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>Mantenha sua conta segura com uma senha forte</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit">Alterar Senha</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessões Ativas</CardTitle>
              <CardDescription>Gerencie onde você está conectado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span className="font-medium">Chrome no Windows</span>
                      <Badge variant="secondary">Atual</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">São Paulo, Brasil • Agora</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">Safari no iPhone</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      São Paulo, Brasil • 2 horas atrás
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Encerrar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

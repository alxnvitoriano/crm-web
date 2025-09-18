"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskModal } from "@/components/task-modal";
import {
  Plus,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  MoreHorizontal,
  Bell,
} from "lucide-react";

interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  dueTime: string;
  priority: "baixa" | "media" | "alta";
  status: "pendente" | "concluida" | "atrasada";
  assignedTo?: string;
  assignedAvatar?: string;
  category: "reuniao" | "followup" | "proposta" | "ligacao" | "email" | "outros";
  createdAt: string;
  completedAt?: string;
}

const mockTasks: Task[] = [
  {
    id: 1,
    title: "Reunião com cliente Ana Silva",
    description: "Apresentar proposta do sistema de gestão",
    dueDate: "2024-01-25",
    dueTime: "14:00",
    priority: "alta",
    status: "pendente",
    assignedTo: "João Silva",
    assignedAvatar: "/professional-user.png",
    category: "reuniao",
    createdAt: "2024-01-20",
  },
  {
    id: 2,
    title: "Follow-up com Carlos Santos",
    description: "Verificar interesse na consultoria de marketing",
    dueDate: "2024-01-25",
    dueTime: "10:30",
    priority: "media",
    status: "pendente",
    assignedTo: "Maria Costa",
    assignedAvatar: "/professional-woman-diverse.png",
    category: "followup",
    createdAt: "2024-01-22",
  },
  {
    id: 3,
    title: "Enviar proposta para Maria Oliveira",
    description: "Proposta de desenvolvimento de e-commerce",
    dueDate: "2024-01-24",
    dueTime: "16:00",
    priority: "alta",
    status: "atrasada",
    assignedTo: "Pedro Santos",
    assignedAvatar: "/professional-man.png",
    category: "proposta",
    createdAt: "2024-01-18",
  },
  {
    id: 4,
    title: "Ligação para João Costa",
    description: "Discutir detalhes do projeto de automação",
    dueDate: "2024-01-23",
    dueTime: "09:00",
    priority: "media",
    status: "concluida",
    assignedTo: "Ana Lima",
    category: "ligacao",
    createdAt: "2024-01-20",
    completedAt: "2024-01-23",
  },
  {
    id: 5,
    title: "Preparar relatório mensal",
    description: "Compilar dados de vendas do mês",
    dueDate: "2024-01-26",
    dueTime: "17:00",
    priority: "baixa",
    status: "pendente",
    assignedTo: "Fernanda Silva",
    category: "outros",
    createdAt: "2024-01-21",
  },
];

const priorityColors = {
  baixa: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  media: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  alta: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const statusColors = {
  pendente: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  concluida: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  atrasada: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const categoryIcons = {
  reuniao: Calendar,
  followup: Bell,
  proposta: CheckCircle2,
  ligacao: Clock,
  email: AlertCircle,
  outros: Clock,
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState("hoje");

  // Update task status based on due date
  useEffect(() => {
    const updateTaskStatus = () => {
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const currentTime = now.toTimeString().slice(0, 5);

      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.status === "concluida") return task;

          const isOverdue =
            task.dueDate < today || (task.dueDate === today && task.dueTime < currentTime);

          return {
            ...task,
            status: isOverdue ? "atrasada" : "pendente",
          };
        })
      );
    };

    updateTaskStatus();
    const interval = setInterval(updateTaskStatus, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleToggleComplete = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "concluida" ? "pendente" : "concluida",
              completedAt:
                task.status === "concluida" ? undefined : new Date().toISOString().split("T")[0],
            }
          : task
      )
    );
  };

  const handleSaveTask = (taskData: Omit<Task, "id" | "createdAt" | "completedAt">) => {
    if (editingTask) {
      setTasks(tasks.map((task) => (task.id === editingTask.id ? { ...task, ...taskData } : task)));
    } else {
      const newTask: Task = {
        ...taskData,
        id: Math.max(...tasks.map((t) => t.id)) + 1,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setTasks([...tasks, newTask]);
    }
    setIsModalOpen(false);
  };

  const getFilteredTasks = (filter: string) => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

    switch (filter) {
      case "hoje":
        return tasks.filter((task) => task.dueDate === today);
      case "proximas":
        return tasks.filter((task) => task.dueDate > today && task.status !== "concluida");
      case "concluidas":
        return tasks.filter((task) => task.status === "concluida");
      case "atrasadas":
        return tasks.filter((task) => task.status === "atrasada");
      default:
        return tasks;
    }
  };

  const getTaskStats = () => {
    const today = new Date().toISOString().split("T")[0];
    return {
      hoje: tasks.filter((task) => task.dueDate === today).length,
      proximas: tasks.filter((task) => task.dueDate > today && task.status !== "concluida").length,
      concluidas: tasks.filter((task) => task.status === "concluida").length,
      atrasadas: tasks.filter((task) => task.status === "atrasada").length,
    };
  };

  const stats = getTaskStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tarefas e Lembretes</h1>
          <p className="text-muted-foreground">Gerencie suas tarefas e mantenha-se organizado</p>
        </div>
        <Button onClick={handleAddTask} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hoje}</div>
            <p className="text-xs text-muted-foreground">tarefas para hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Próximas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.proximas}</div>
            <p className="text-xs text-muted-foreground">tarefas futuras</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.concluidas}</div>
            <p className="text-xs text-muted-foreground">tarefas finalizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.atrasadas}</div>
            <p className="text-xs text-muted-foreground">precisam de atenção</p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Tarefas</CardTitle>
          <CardDescription>Organize suas atividades por período</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="hoje">Hoje ({stats.hoje})</TabsTrigger>
              <TabsTrigger value="proximas">Próximas ({stats.proximas})</TabsTrigger>
              <TabsTrigger value="concluidas">Concluídas ({stats.concluidas})</TabsTrigger>
              <TabsTrigger value="atrasadas">Atrasadas ({stats.atrasadas})</TabsTrigger>
            </TabsList>

            {["hoje", "proximas", "concluidas", "atrasadas"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-6">
                <div className="space-y-3">
                  {getFilteredTasks(tab).map((task) => {
                    const CategoryIcon = categoryIcons[task.category];

                    return (
                      <Card key={task.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <Checkbox
                              checked={task.status === "concluida"}
                              onCheckedChange={() => handleToggleComplete(task.id)}
                              className="mt-1"
                            />

                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <h4
                                    className={`font-medium ${task.status === "concluida" ? "line-through text-muted-foreground" : ""}`}
                                  >
                                    {task.title}
                                  </h4>
                                  {task.description && (
                                    <p className="text-sm text-muted-foreground">
                                      {task.description}
                                    </p>
                                  )}
                                </div>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleEditTask(task)}>
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="text-destructive"
                                    >
                                      Excluir
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                    <CategoryIcon className="h-3 w-3" />
                                    <span>
                                      {new Date(`${task.dueDate}T${task.dueTime}`).toLocaleString(
                                        "pt-BR"
                                      )}
                                    </span>
                                  </div>

                                  {task.assignedTo && (
                                    <div className="flex items-center space-x-2">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage
                                          src={task.assignedAvatar || "/placeholder.svg"}
                                          alt={task.assignedTo}
                                        />
                                        <AvatarFallback className="text-xs">
                                          {task.assignedTo
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm text-muted-foreground">
                                        {task.assignedTo}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Badge
                                    className={priorityColors[task.priority]}
                                    variant="secondary"
                                  >
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                  </Badge>
                                  <Badge className={statusColors[task.status]} variant="secondary">
                                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {getFilteredTasks(tab).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma tarefa encontrada para este período</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
}

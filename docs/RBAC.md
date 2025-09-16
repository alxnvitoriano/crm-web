# Sistema RBAC (Role-Based Access Control)

Este documento explica como usar o sistema RBAC implementado no projeto CRM.

## Visão Geral

O sistema RBAC permite controlar o acesso de usuários a diferentes recursos e ações baseado em seus roles (funções) e permissões. Cada usuário pertence a uma organização e tem um role específico que define suas permissões.

## Estrutura do Banco de Dados

### Tabelas Principais

- **`roles`**: Define os roles disponíveis (Owner, Admin, Vendedor, etc.)
- **`permissions`**: Define as permissões específicas (create:client, read:reports, etc.)
- **`roles_to_permissions`**: Associa roles às suas permissões
- **`member`**: Associa usuários a organizações com um role específico

### Relacionamentos

```
User → Member → Role → Permissions
  ↓       ↓
Organization
```

## Roles Pré-definidos

### 1. Owner

- **Descrição**: Proprietário da organização com acesso total
- **Permissões**: Todas as permissões do sistema
- **Uso**: Acesso completo a todas as funcionalidades

### 2. Admin

- **Descrição**: Administrador com acesso total exceto gestão de organizações
- **Permissões**: Todas exceto gestão de organizações
- **Uso**: Gerenciamento completo da organização

### 3. Gerente de Vendas

- **Descrição**: Gerente de vendas com acesso a equipe e relatórios
- **Permissões**: Clientes, vendedores, agendamentos, relatórios
- **Uso**: Gerenciamento da equipe de vendas

### 4. Vendedor

- **Descrição**: Vendedor com acesso limitado aos próprios clientes
- **Permissões**: Clientes (criar, ler, atualizar), agendamentos
- **Uso**: Operações básicas de vendas

### 5. Administrativo

- **Descrição**: Funcionário administrativo com acesso a dados
- **Permissões**: Leitura e atualização de dados, relatórios
- **Uso**: Suporte administrativo

### 6. Pós-Venda

- **Descrição**: Equipe de pós-venda com acesso limitado
- **Permissões**: Clientes (ler, atualizar), agendamentos
- **Uso**: Atendimento pós-venda

## Permissões Disponíveis

### Clientes

- `create:client` - Criar novos clientes
- `read:client` - Visualizar clientes
- `update:client` - Editar clientes
- `delete:client` - Excluir clientes

### Vendedores

- `create:salesperson` - Criar novos vendedores
- `read:salesperson` - Visualizar vendedores
- `update:salesperson` - Editar vendedores
- `delete:salesperson` - Excluir vendedores

### Agendamentos

- `create:appointment` - Criar novos agendamentos
- `read:appointment` - Visualizar agendamentos
- `update:appointment` - Editar agendamentos
- `delete:appointment` - Excluir agendamentos

### Relatórios

- `read:reports` - Visualizar relatórios
- `export:reports` - Exportar relatórios

### Usuários

- `create:user` - Criar novos usuários
- `read:user` - Visualizar usuários
- `update:user` - Editar usuários
- `delete:user` - Excluir usuários

### Roles

- `create:role` - Criar novos roles
- `read:role` - Visualizar roles
- `update:role` - Editar roles
- `delete:role` - Excluir roles

### Organizações

- `create:organization` - Criar novas organizações
- `read:organization` - Visualizar organizações
- `update:organization` - Editar organizações
- `delete:organization` - Excluir organizações

## Como Usar

### 1. Configuração Inicial

```bash
# Executar migrações e seeds
npm run db:setup

# Ou apenas os seeds
npm run db:seed
```

### 2. Hooks React

#### usePermissions

```tsx
import { usePermissions } from "@/hooks/use-permissions";

function MyComponent() {
  const { permissions, loading, canCreate, canRead, canUpdate, canDelete } = usePermissions({
    userId: "user-123",
    organizationId: "org-456",
  });

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      {canCreate("client") && <button>Criar Cliente</button>}
      {canRead("reports") && <button>Ver Relatórios</button>}
    </div>
  );
}
```

#### useHasPermission

```tsx
import { useHasPermission } from "@/hooks/use-permissions";

function MyComponent() {
  const { hasPermission, loading } = useHasPermission("user-123", "org-456", "create:client");

  if (loading) return <div>Carregando...</div>;

  return <div>{hasPermission && <button>Criar Cliente</button>}</div>;
}
```

### 3. Componentes de Proteção

#### PermissionGuard

```tsx
import { PermissionGuard } from "@/components/rbac/permission-guard";

function MyComponent() {
  return (
    <PermissionGuard userId="user-123" organizationId="org-456" permission="create:client">
      <div>Conteúdo protegido</div>
    </PermissionGuard>
  );
}
```

#### PermissionButton

```tsx
import { PermissionButton } from "@/components/rbac/permission-guard";

function MyComponent() {
  return (
    <PermissionButton
      userId="user-123"
      organizationId="org-456"
      permission="create:client"
      className="btn btn-primary"
      onClick={() => console.log("Criar cliente")}
    >
      Criar Cliente
    </PermissionButton>
  );
}
```

### 4. Verificação Programática

```tsx
import { hasPermission, getUserPermissions } from "@/lib/rbac/permissions";

// Verificar permissão específica
const canCreate = await hasPermission("user-123", "org-456", "create:client");

// Obter todas as permissões do usuário
const userPermissions = await getUserPermissions("user-123", "org-456");
```

## Exemplos Práticos

### 1. Página de Clientes

```tsx
function ClientsPage() {
  const { canCreate, canUpdate, canDelete } = usePermissions({
    userId: "user-123",
    organizationId: "org-456",
  });

  return (
    <div>
      <h1>Clientes</h1>

      {canCreate("client") && <button onClick={createClient}>Novo Cliente</button>}

      <ClientList canEdit={canUpdate("client")} canDelete={canDelete("client")} />
    </div>
  );
}
```

### 2. Menu de Navegação

```tsx
function NavigationMenu() {
  const { canRead } = usePermissions({
    userId: "user-123",
    organizationId: "org-456",
  });

  return (
    <nav>
      <Link href="/clients">Clientes</Link>

      {canRead("reports") && <Link href="/reports">Relatórios</Link>}

      {canRead("user") && <Link href="/users">Usuários</Link>}
    </nav>
  );
}
```

### 3. Formulário de Cliente

```tsx
function ClientForm({ clientId }: { clientId?: string }) {
  const { canCreate, canUpdate } = usePermissions({
    userId: "user-123",
    organizationId: "org-456",
  });

  const isEditing = !!clientId;
  const canSave = isEditing ? canUpdate("client") : canCreate("client");

  return (
    <form>
      {/* Campos do formulário */}

      {canSave && <button type="submit">{isEditing ? "Atualizar" : "Criar"} Cliente</button>}
    </form>
  );
}
```

## Gerenciamento de Roles

### Criar Role Personalizado

```tsx
import { createCustomRole } from "@/lib/rbac/permissions";

const newRole = await createCustomRole(
  "Vendedor Sênior",
  "Vendedor com permissões estendidas",
  "org-456",
  ["create:client", "read:client", "update:client", "read:reports"]
);
```

### Obter Roles da Organização

```tsx
import { getOrganizationRoles } from "@/lib/rbac/permissions";

const roles = await getOrganizationRoles("org-456");
```

## Boas Práticas

1. **Sempre verificar permissões no frontend e backend**
2. **Use componentes de proteção para UI consistente**
3. **Implemente fallbacks apropriados para usuários sem permissão**
4. **Documente as permissões necessárias para cada funcionalidade**
5. **Teste diferentes roles para garantir comportamento correto**

## Troubleshooting

### Problema: Permissões não carregam

- Verifique se o usuário está associado à organização
- Confirme se o role está associado às permissões
- Verifique se os seeds foram executados

### Problema: Componente não renderiza

- Verifique se as permissões estão corretas
- Confirme se o `fallback` está configurado
- Verifique se não há erros no console

### Problema: Performance lenta

- Considere cachear as permissões do usuário
- Use `useHasPermission` para verificações simples
- Evite múltiplas chamadas desnecessárias

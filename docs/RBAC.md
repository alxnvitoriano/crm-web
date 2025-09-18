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

### 1. Gerente Geral

- **Descrição**: Acesso total a todas as funcionalidades e etapas do processo de vendas
- **Permissões**: Todas as permissões do sistema + todas as etapas do processo de vendas (1-8)
- **Etapas do Processo**: Acesso completo a todas as 8 etapas
- **Uso**: Controle total da organização e processo de vendas

### 2. Administrativo

- **Descrição**: Acesso às etapas 4 a 7 do processo de vendas
- **Permissões**: Etapas 4-7 (Negociação, Fechamento, Contrato, Pagamento) + permissões básicas
- **Etapas do Processo**:
  - ✅ **Editável**: Etapas 4, 5, 6, 7
  - ❌ **Sem acesso**: Etapas 1, 2, 3, 8
- **Uso**: Processamento de negócios fechados e administrativo

### 3. Pós-Venda

- **Descrição**: Acesso somente à etapa 8 (Pós-venda) e visualização das outras etapas
- **Permissões**: Etapa 8 (Pós-venda) + visualização das outras etapas
- **Etapas do Processo**:
  - ✅ **Editável**: Etapa 8 (Pós-venda)
  - 👁️ **Visualização**: Etapas 1, 2, 3, 4, 5, 6, 7
- **Uso**: Atendimento pós-venda e suporte ao cliente

### 4. Gerente de Vendas

- **Descrição**: Acesso a vendedores da equipe e todas as etapas do processo (1-8)
- **Permissões**: Todas as etapas do processo + gestão de equipe + relatórios
- **Etapas do Processo**: Acesso completo a todas as 8 etapas
- **Uso**: Gerenciamento da equipe de vendas e acompanhamento do processo

### 5. Vendedor

- **Descrição**: Acesso editável às etapas 1-4 e 8, visualização das etapas 5-7
- **Permissões**: Etapas 1-4 e 8 (editável) + visualização das etapas 5-7
- **Etapas do Processo**:
  - ✅ **Editável**: Etapas 1, 2, 3, 4, 8
  - 👁️ **Visualização**: Etapas 5, 6, 7
- **Uso**: Operações de vendas e acompanhamento pós-venda

## Permissões Disponíveis

### Etapas do Processo de Vendas

#### Etapa 1 - Primeiro Contato/Lead

- `create:stage_1` - Criar leads e primeiro contato
- `read:stage_1` - Visualizar leads e primeiro contato
- `update:stage_1` - Editar leads e primeiro contato
- `delete:stage_1` - Excluir leads e primeiro contato

#### Etapa 2 - Qualificação

- `create:stage_2` - Criar qualificação de leads
- `read:stage_2` - Visualizar qualificação de leads
- `update:stage_2` - Editar qualificação de leads
- `delete:stage_2` - Excluir qualificação de leads

#### Etapa 3 - Proposta

- `create:stage_3` - Criar propostas comerciais
- `read:stage_3` - Visualizar propostas comerciais
- `update:stage_3` - Editar propostas comerciais
- `delete:stage_3` - Excluir propostas comerciais

#### Etapa 4 - Negociação

- `create:stage_4` - Criar negociações
- `read:stage_4` - Visualizar negociações
- `update:stage_4` - Editar negociações
- `delete:stage_4` - Excluir negociações

#### Etapa 5 - Fechamento

- `create:stage_5` - Criar fechamentos de vendas
- `read:stage_5` - Visualizar fechamentos de vendas
- `update:stage_5` - Editar fechamentos de vendas
- `delete:stage_5` - Excluir fechamentos de vendas

#### Etapa 6 - Contrato

- `create:stage_6` - Criar contratos
- `read:stage_6` - Visualizar contratos
- `update:stage_6` - Editar contratos
- `delete:stage_6` - Excluir contratos

#### Etapa 7 - Pagamento

- `create:stage_7` - Criar registros de pagamento
- `read:stage_7` - Visualizar registros de pagamento
- `update:stage_7` - Editar registros de pagamento
- `delete:stage_7` - Excluir registros de pagamento

#### Etapa 8 - Pós-venda

- `create:stage_8` - Criar registros de pós-venda
- `read:stage_8` - Visualizar registros de pós-venda
- `update:stage_8` - Editar registros de pós-venda
- `delete:stage_8` - Excluir registros de pós-venda

### Permissões Especiais

- `manage:team` - Gerenciar equipe de vendas
- `view:all_stages` - Visualizar todas as etapas do processo
- `manage:organization` - Gerenciar organização

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
  const { permissions, loading, canCreate, canUpdate, canDelete } = usePermissions({
    userId: "user-123",
    organizationId: "org-456",
  });

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <button>Criar Cliente</button>
      <button>Ver Relatórios</button>
    </div>
  );
}
```

#### useSalesStagePermissions

```tsx
import { useSalesStagePermissions } from "@/hooks/use-sales-stage-permissions";
import { SALES_STAGES } from "@/lib/rbac/sales-process-permissions";

function SalesProcessComponent() {
  const { canCreateStage, canUpdateStage, canDeleteStage, getAccessibleStages, loading } =
    useSalesStagePermissions({
      userId: "user-123",
      organizationId: "org-456",
    });

  if (loading) return <div>Carregando...</div>;

  const { editable, viewOnly } = getAccessibleStages();

  return (
    <div>
      <h2>Etapas Editáveis</h2>
      {editable.map((stage) => (
        <div key={stage}>
          {canCreateStage(stage) && <button>Criar {stage}</button>}
          {canUpdateStage(stage) && <button>Editar {stage}</button>}
        </div>
      ))}
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

#### SalesStageGuard

```tsx
import { SalesStageGuard } from "@/components/rbac/sales-stage-guard";
import { SALES_STAGES } from "@/lib/rbac/sales-process-permissions";

function SalesProcessComponent() {
  return (
    <SalesStageGuard
      userId="user-123"
      organizationId="org-456"
      stage={SALES_STAGES.STAGE_1}
      action="create"
      fallback={<div>Você não tem permissão para criar leads</div>}
    >
      <div>Formulário de criação de lead</div>
    </SalesStageGuard>
  );
}
```

#### SalesStageButton

```tsx
import { SalesStageButton } from "@/components/rbac/sales-stage-guard";
import { SALES_STAGES } from "@/lib/rbac/sales-process-permissions";

function SalesProcessComponent() {
  return (
    <SalesStageButton
      userId="user-123"
      organizationId="org-456"
      stage={SALES_STAGES.STAGE_2}
      action="update"
      onClick={() => console.log("Atualizando qualificação")}
      className="btn btn-primary"
    >
      Atualizar Qualificação
    </SalesStageButton>
  );
}
```

#### AccessibleStagesInfo

```tsx
import { AccessibleStagesInfo } from "@/components/rbac/sales-stage-guard";

function UserPermissionsComponent() {
  return <AccessibleStagesInfo userId="user-123" organizationId="org-456" />;
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
return (
  <nav>
    <Link href="/clients">Clientes</Link>
  </nav>
);
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

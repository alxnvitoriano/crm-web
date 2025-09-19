import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid, unique, integer } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users_table", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  userToCompanyTable: many(usersToCompanyTable),
}));

export const sessionsTable = pgTable("sessions_table", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  activeOrganizationId: text("active_organization_id"),
});

export const accountsTable = pgTable("accounts_table", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verificationsTable = pgTable("verifications_table", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const usersToCompanyTable = pgTable("users_to_company", {
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companyTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const companyTable = pgTable("company", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createAt: timestamp("create_at").defaultNow().notNull(),
  updateAt: timestamp("update_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const companyTableRelations = relations(companyTable, ({ many }) => ({
  salesperson: many(salespersonTable),
  clients: many(clientsTable),
  appointments: many(appointmentsTable),
  usersToCompany: many(usersToCompanyTable),
}));

export const salespersonTable = pgTable("salesperson", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companyTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  avatarImageUrl: text("avatar_image_url"),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  createAt: timestamp("create_at").defaultNow().notNull(),
  updateAt: timestamp("update_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const salespersonTableRelations = relations(salespersonTable, ({ many, one }) => ({
  company: one(companyTable, {
    fields: [salespersonTable.companyId],
    references: [companyTable.id],
  }),
  appointments: many(appointmentsTable),
}));

export const clientsTable = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  status: text("status").notNull(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companyTable.id, { onDelete: "cascade" }),
  salespersonId: uuid("salesperson_id")
    .notNull()
    .references(() => salespersonTable.id, { onDelete: "cascade" }),
  createAt: timestamp("create_at").defaultNow().notNull(),
  updateAt: timestamp("update_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const clientsTableRelations = relations(clientsTable, ({ many, one }) => ({
  company: one(companyTable, {
    fields: [clientsTable.companyId],
    references: [companyTable.id],
  }),
  salesperson: one(salespersonTable, {
    fields: [clientsTable.salespersonId],
    references: [salespersonTable.id],
  }),
  appointments: many(appointmentsTable),
}));

export const appointmentsTable = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: timestamp("date").notNull(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companyTable.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clientsTable.id, { onDelete: "cascade" }),
  salespersonId: uuid("salesperson_id")
    .notNull()
    .references(() => salespersonTable.id, { onDelete: "cascade" }),
  createAt: timestamp("create_at").defaultNow().notNull(),
  updateAt: timestamp("update_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const appointmentsTableRelations = relations(appointmentsTable, ({ one }) => ({
  company: one(companyTable, {
    fields: [appointmentsTable.companyId],
    references: [companyTable.id],
  }),
  clients: one(clientsTable, {
    fields: [appointmentsTable.clientId],
    references: [clientsTable.id],
  }),
  salesperson: one(salespersonTable, {
    fields: [appointmentsTable.salespersonId],
    references: [salespersonTable.id],
  }),
}));

export const usersToCompanyTableRelations = relations(usersToCompanyTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [usersToCompanyTable.userId],
    references: [usersTable.id],
  }),
  company: one(companyTable, {
    fields: [usersToCompanyTable.companyId],
    references: [companyTable.id],
  }),
}));

export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at").notNull(),
  metadata: text("metadata"),
});

export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
  deals: many(dealsTable),
}));

export type Organization = typeof organization.$inferSelect;

export const rolesTable = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(), // Ex: "Administrativo", "Vendedor Pleno"
  description: text("description"),
  organizationId: text("organization_id").references(() => organization.id, {
    onDelete: "cascade",
  }), // Roles podem ser globais ou específicos da organização
  isSystemRole: boolean("is_system_role").default(false).notNull(), // Roles do sistema (owner, admin) vs roles customizados
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const rolesTableRelations = relations(rolesTable, ({ many, one }) => ({
  organization: one(organization, {
    fields: [rolesTable.organizationId],
    references: [organization.id],
  }),
  members: many(member),
  rolesToPermissions: many(rolesToPermissionsTable),
}));

export const member = pgTable("member", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  roleId: uuid("role_id")
    .notNull()
    .references(() => rolesTable.id, { onDelete: "restrict" }), // restrict para não apagar um role em uso
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  user: one(usersTable, {
    fields: [member.userId],
    references: [usersTable.id],
  }),
  role: one(rolesTable, {
    fields: [member.roleId],
    references: [rolesTable.id],
  }),
}));

// Tabela temporária para convites (até implementar sistema completo)
export const invitationsTable = pgTable("invitations", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  organizationId: text("organization_id").notNull(),
  roleId: uuid("role_id").notNull(),
  inviterId: text("inviter_id").notNull(), // Quem enviou o convite
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  status: text("status").notNull().default("pending"), // pending, accepted, expired, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const invitationsTableRelations = relations(invitationsTable, ({ one }) => ({
  organization: one(organization, {
    fields: [invitationsTable.organizationId],
    references: [organization.id],
  }),
  role: one(rolesTable, {
    fields: [invitationsTable.roleId],
    references: [rolesTable.id],
  }),
  inviter: one(usersTable, {
    fields: [invitationsTable.inviterId],
    references: [usersTable.id],
  }),
}));

export type Member = typeof member.$inferSelect & {
  user: typeof usersTable.$inferSelect;
};

export const invitation = pgTable("invitation", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").default("pending").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const permissionsTable = pgTable("permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  // Ex: "create:client", "read:appointment", "delete:salesperson"
  slug: text("slug").notNull().unique(),
  description: text("description"),
  resource: text("resource").notNull(), // Ex: "client", "appointment", "salesperson"
  action: text("action").notNull(), // Ex: "create", "read", "update", "delete"
  isSystemPermission: boolean("is_system_permission").default(false).notNull(), // Permissões do sistema vs customizadas
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const permissionsTableRelations = relations(permissionsTable, ({ many }) => ({
  rolesToPermissions: many(rolesToPermissionsTable),
}));

export const rolesToPermissionsTable = pgTable(
  "roles_to_permissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    roleId: uuid("role_id")
      .notNull()
      .references(() => rolesTable.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissionsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    // Índice único para evitar duplicatas
    uniqueRolePermission: unique("unique_role_permission").on(table.roleId, table.permissionId),
  })
);

export const rolesToPermissionsTableRelations = relations(rolesToPermissionsTable, ({ one }) => ({
  role: one(rolesTable, {
    fields: [rolesToPermissionsTable.roleId],
    references: [rolesTable.id],
  }),
  permission: one(permissionsTable, {
    fields: [rolesToPermissionsTable.permissionId],
    references: [permissionsTable.id],
  }),
}));

export const dealsTable = pgTable("deals", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  client: text("client").notNull(),
  clientAvatar: text("client_avatar"),
  value: integer("value").notNull(),
  stage: text("stage").notNull(), // "lead", "negociacao", "fechado"
  priority: text("priority").notNull(), // "baixa", "media", "alta"
  dueDate: timestamp("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  description: text("description"),
});

export const dealsTableRelations = relations(dealsTable, ({ one }) => ({
  organization: one(organization, {
    fields: [dealsTable.organizationId],
    references: [organization.id],
  }),
}));

export const tasksTable = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: text("due_date").notNull(), // YYYY-MM-DD
  dueTime: text("due_time").notNull(), // HH:MM
  priority: text("priority").notNull(), // "baixa", "media", "alta"
  status: text("status").notNull().default("pendente"), // "pendente", "concluida", "atrasada"
  assignedTo: text("assigned_to"), // user id
  category: text("category").notNull(), // "reuniao", "followup", "proposta", "ligacao", "email", "outros"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  completedAt: timestamp("completed_at"),
});

export const tasksTableRelations = relations(tasksTable, ({ one }) => ({
  organization: one(organization, {
    fields: [tasksTable.organizationId],
    references: [organization.id],
  }),
}));

export const notificationsTable = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  time: text("time").notNull(), // e.g., "5 min atrás"
  unread: boolean("unread").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notificationsTableRelations = relations(notificationsTable, ({ one }) => ({
  organization: one(organization, {
    fields: [notificationsTable.organizationId],
    references: [organization.id],
  }),
  user: one(usersTable, {
    fields: [notificationsTable.userId],
    references: [usersTable.id],
  }),
}));

export const schema = {
  usersTable,
  sessionsTable,
  accountsTable,
  verificationsTable,
  organization,
  member,
  invitation,
  invitationsTable,
  rolesTable,
  permissionsTable,
  rolesToPermissionsTable,
  organizationRelations,
  memberRelations,
  invitationsTableRelations,
  rolesTableRelations,
  permissionsTableRelations,
  rolesToPermissionsTableRelations,
  dealsTable,
  tasksTable,
  notificationsTable,
};

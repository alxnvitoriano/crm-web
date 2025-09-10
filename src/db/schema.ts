import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  userToCompanyTable: many(usersToCompanyTable),
}));

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const accountsTable = pgTable("accounts", {
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
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verificationsTable = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
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

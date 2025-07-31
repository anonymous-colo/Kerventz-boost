import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  suffix: text("suffix").notNull(),
  country: text("country").notNull().default("HT"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const suffixes = pgTable("suffixes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  value: text("value").notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adminSessions = pgTable("admin_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionToken: text("session_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
}).extend({
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  suffix: z.string().min(1, "Un suffixe est requis"),
  country: z.string().min(2, "Code pays requis"),
});

export const insertSuffixSchema = createInsertSchema(suffixes).omit({
  id: true,
  createdAt: true,
});

export const insertAdminSessionSchema = createInsertSchema(adminSessions).omit({
  id: true,
  createdAt: true,
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Suffix = typeof suffixes.$inferSelect;
export type InsertSuffix = z.infer<typeof insertSuffixSchema>;
export type AdminSession = typeof adminSessions.$inferSelect;
export type InsertAdminSession = z.infer<typeof insertAdminSessionSchema>;

import { type Contact, type InsertContact, type Suffix, type InsertSuffix, type AdminSession, type InsertAdminSession, contacts, suffixes, adminSessions } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, desc, sql, gte, lt, and, isNotNull } from "drizzle-orm";

export interface IStorage {
  // Contact operations
  getContacts(): Promise<Contact[]>;
  getContact(id: string): Promise<Contact | undefined>;
  getContactByPhone(phone: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  deleteContact(id: string): Promise<boolean>;
  deleteAllContacts(): Promise<void>;
  getContactsCreatedToday(): Promise<Contact[]>;
  getContactsWithEmail(): Promise<Contact[]>;
  getRecentContacts(limit: number): Promise<Contact[]>;

  // Suffix operations
  getSuffixes(): Promise<Suffix[]>;
  getActiveSuffixes(): Promise<Suffix[]>;
  createSuffix(suffix: InsertSuffix): Promise<Suffix>;
  updateSuffix(id: string, suffix: Partial<Suffix>): Promise<Suffix | undefined>;
  deleteSuffix(id: string): Promise<boolean>;

  // Admin session operations
  createAdminSession(session: InsertAdminSession): Promise<AdminSession>;
  getAdminSession(sessionToken: string): Promise<AdminSession | undefined>;
  deleteAdminSession(sessionToken: string): Promise<boolean>;
  cleanupExpiredSessions(): Promise<void>;
}

export class DbStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    this.db = drizzle(pool);
    this.seedInitialData();
  }

  private async seedInitialData() {
    try {
      // Check if suffixes already exist
      const existingSuffixes = await this.db.select().from(suffixes).limit(1);
      
      if (existingSuffixes.length === 0) {
        // Initialize with default suffixes
        const defaultSuffixes = [
          { value: "BOOST.1🚀", isActive: true },
          { value: "BOOST.2🔥", isActive: true },
          { value: "BOOST.3⚡", isActive: true }
        ];

        for (const suffix of defaultSuffixes) {
          await this.db.insert(suffixes).values({
            id: randomUUID(),
            value: suffix.value,
            isActive: suffix.isActive,
            createdAt: new Date(),
          });
        }
      }
    } catch (error) {
      console.error("Error seeding initial data:", error);
    }
  }

  // Contact operations
  async getContacts(): Promise<Contact[]> {
    return await this.db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async getContact(id: string): Promise<Contact | undefined> {
    const result = await this.db.select().from(contacts).where(eq(contacts.id, id));
    return result[0];
  }

  async getContactByPhone(phone: string): Promise<Contact | undefined> {
    const result = await this.db.select().from(contacts).where(eq(contacts.phone, phone));
    return result[0];
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      id,
      email: insertContact.email || null,
      createdAt: new Date()
    };
    
    await this.db.insert(contacts).values(contact);
    return contact;
  }

  async deleteContact(id: string): Promise<boolean> {
    const result = await this.db.delete(contacts).where(eq(contacts.id, id));
    return result.rowCount > 0;
  }

  async deleteAllContacts(): Promise<void> {
    await this.db.delete(contacts);
  }

  async getContactsCreatedToday(): Promise<Contact[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return await this.db.select().from(contacts)
      .where(and(
        gte(contacts.createdAt, today),
        lt(contacts.createdAt, tomorrow)
      ));
  }

  async getContactsWithEmail(): Promise<Contact[]> {
    return await this.db.select().from(contacts)
      .where(isNotNull(contacts.email));
  }

  async getRecentContacts(limit: number): Promise<Contact[]> {
    return await this.db.select().from(contacts)
      .orderBy(desc(contacts.createdAt))
      .limit(limit);
  }

  // Suffix operations
  async getSuffixes(): Promise<Suffix[]> {
    return await this.db.select().from(suffixes).orderBy(desc(suffixes.createdAt));
  }

  async getActiveSuffixes(): Promise<Suffix[]> {
    return await this.db.select().from(suffixes).where(eq(suffixes.isActive, true));
  }

  async createSuffix(insertSuffix: InsertSuffix): Promise<Suffix> {
    const id = randomUUID();
    const suffix: Suffix = {
      ...insertSuffix,
      id,
      isActive: insertSuffix.isActive ?? true,
      createdAt: new Date()
    };
    
    await this.db.insert(suffixes).values(suffix);
    return suffix;
  }

  async updateSuffix(id: string, updates: Partial<Suffix>): Promise<Suffix | undefined> {
    const result = await this.db.update(suffixes)
      .set(updates)
      .where(eq(suffixes.id, id))
      .returning();
    
    return result[0];
  }

  async deleteSuffix(id: string): Promise<boolean> {
    const result = await this.db.delete(suffixes).where(eq(suffixes.id, id));
    return result.rowCount > 0;
  }

  // Admin session operations
  async createAdminSession(insertSession: InsertAdminSession): Promise<AdminSession> {
    const id = randomUUID();
    const session: AdminSession = {
      ...insertSession,
      id,
      createdAt: new Date()
    };
    
    await this.db.insert(adminSessions).values(session);
    return session;
  }

  async getAdminSession(sessionToken: string): Promise<AdminSession | undefined> {
    const result = await this.db.select().from(adminSessions)
      .where(and(
        eq(adminSessions.sessionToken, sessionToken),
        gte(adminSessions.expiresAt, new Date())
      ));
    
    return result[0];
  }

  async deleteAdminSession(sessionToken: string): Promise<boolean> {
    const result = await this.db.delete(adminSessions)
      .where(eq(adminSessions.sessionToken, sessionToken));
    
    return result.rowCount > 0;
  }

  async cleanupExpiredSessions(): Promise<void> {
    await this.db.delete(adminSessions)
      .where(lt(adminSessions.expiresAt, new Date()));
  }
}

export const storage = new DbStorage();
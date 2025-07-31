import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertSuffixSchema } from "@shared/schema";
import { randomBytes } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Cleanup expired sessions periodically
  setInterval(() => {
    storage.cleanupExpiredSessions();
  }, 60 * 60 * 1000); // Every hour

  // Public API routes
  app.get("/api/suffixes", async (req, res) => {
    try {
      const suffixes = await storage.getActiveSuffixes();
      res.json(suffixes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suffixes" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      
      // Check for duplicate phone number
      const existingContact = await storage.getContactByPhone(validatedData.phone);
      if (existingContact) {
        return res.status(409).json({ message: "Phone number already registered" });
      }

      const contact = await storage.createContact(validatedData);
      
      // TODO: Send email if provided
      if (contact.email) {
        console.log(`Sending welcome email to: ${contact.email}`);
        // Implement email sending logic here
      }

      res.status(201).json(contact);
    } catch (error) {
      res.status(400).json({ message: "Invalid contact data", error });
    }
  });

  app.get("/api/contacts/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const contacts = await storage.getRecentContacts(limit);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent contacts" });
    }
  });

  // Admin authentication
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    
    if (username === "admin" && password === "kerventz2025") {
      const sessionToken = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      const session = await storage.createAdminSession({
        sessionToken,
        expiresAt
      });
      
      res.json({ sessionToken: session.sessionToken, expiresAt: session.expiresAt });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  app.post("/api/admin/logout", async (req, res) => {
    const { sessionToken } = req.body;
    await storage.deleteAdminSession(sessionToken);
    res.json({ success: true });
  });

  // Admin middleware
  const adminAuth = async (req: any, res: any, next: any) => {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');
    if (!sessionToken) {
      return res.status(401).json({ message: "No session token provided" });
    }

    const session = await storage.getAdminSession(sessionToken);
    if (!session) {
      return res.status(401).json({ message: "Invalid or expired session" });
    }

    req.adminSession = session;
    next();
  };

  // Admin API routes
  app.get("/api/admin/contacts", adminAuth, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.get("/api/admin/stats", adminAuth, async (req, res) => {
    try {
      const totalContacts = (await storage.getContacts()).length;
      const todayContacts = (await storage.getContactsCreatedToday()).length;
      const emailContacts = (await storage.getContactsWithEmail()).length;
      
      res.json({
        totalContacts,
        todayContacts,
        emailContacts
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.delete("/api/admin/contacts/:id", adminAuth, async (req, res) => {
    try {
      const success = await storage.deleteContact(req.params.id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Contact not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete contact" });
    }
  });

  app.delete("/api/admin/contacts", adminAuth, async (req, res) => {
    try {
      await storage.deleteAllContacts();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete all contacts" });
    }
  });

  app.get("/api/admin/export/vcf", adminAuth, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      let vcfContent = "";
      
      contacts.forEach(contact => {
        vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${contact.fullName}\nTEL:${contact.phone}\n`;
        if (contact.email) {
          vcfContent += `EMAIL:${contact.email}\n`;
        }
        vcfContent += `END:VCARD\n`;
      });
      
      res.setHeader('Content-Type', 'text/vcard');
      res.setHeader('Content-Disposition', 'attachment; filename="kerventz_contacts.vcf"');
      res.send(vcfContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to export VCF" });
    }
  });

  app.get("/api/admin/export/csv", adminAuth, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      let csvContent = "Name,Phone,Email,Country,Suffix,Date\n";
      
      contacts.forEach(contact => {
        csvContent += `"${contact.fullName}","${contact.phone}","${contact.email || ''}","${contact.country}","${contact.suffix}","${new Date(contact.createdAt).toISOString()}"\n`;
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="kerventz_contacts.csv"');
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to export CSV" });
    }
  });

  // Suffix management
  app.get("/api/admin/suffixes", adminAuth, async (req, res) => {
    try {
      const suffixes = await storage.getSuffixes();
      res.json(suffixes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suffixes" });
    }
  });

  app.post("/api/admin/suffixes", adminAuth, async (req, res) => {
    try {
      const validatedData = insertSuffixSchema.parse(req.body);
      const suffix = await storage.createSuffix(validatedData);
      res.status(201).json(suffix);
    } catch (error) {
      res.status(400).json({ message: "Invalid suffix data", error });
    }
  });

  app.put("/api/admin/suffixes/:id", adminAuth, async (req, res) => {
    try {
      const updates = req.body;
      const suffix = await storage.updateSuffix(req.params.id, updates);
      if (suffix) {
        res.json(suffix);
      } else {
        res.status(404).json({ message: "Suffix not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update suffix" });
    }
  });

  app.delete("/api/admin/suffixes/:id", adminAuth, async (req, res) => {
    try {
      const success = await storage.deleteSuffix(req.params.id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Suffix not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete suffix" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

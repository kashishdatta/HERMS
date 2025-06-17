import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertDepartmentSchema,
  insertStaffSchema,
  insertDeviceSchema,
  insertRentalSchema,
  insertMaintenanceSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const staffMember = await storage.getStaffByUserId(userId);
      
      res.json({
        ...user,
        staff: staffMember,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Department routes
  app.get("/api/departments", isAuthenticated, async (req, res) => {
    try {
      const departments = await storage.getDepartments();
      res.json(departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });

  app.get("/api/departments/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const department = await storage.getDepartment(id);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
      res.json(department);
    } catch (error) {
      console.error("Error fetching department:", error);
      res.status(500).json({ message: "Failed to fetch department" });
    }
  });

  app.post("/api/departments", isAuthenticated, async (req, res) => {
    try {
      const departmentData = insertDepartmentSchema.parse(req.body);
      const department = await storage.createDepartment(departmentData);
      res.status(201).json(department);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid department data", errors: error.errors });
      }
      console.error("Error creating department:", error);
      res.status(500).json({ message: "Failed to create department" });
    }
  });

  // Staff routes
  app.get("/api/staff", isAuthenticated, async (req, res) => {
    try {
      const staff = await storage.getStaff();
      res.json(staff);
    } catch (error) {
      console.error("Error fetching staff:", error);
      res.status(500).json({ message: "Failed to fetch staff" });
    }
  });

  app.post("/api/staff", isAuthenticated, async (req, res) => {
    try {
      const staffData = insertStaffSchema.parse(req.body);
      const staff = await storage.createStaff(staffData);
      res.status(201).json(staff);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid staff data", errors: error.errors });
      }
      console.error("Error creating staff:", error);
      res.status(500).json({ message: "Failed to create staff" });
    }
  });

  // Device routes
  app.get("/api/devices", isAuthenticated, async (req, res) => {
    try {
      const { status } = req.query;
      let devices;
      
      if (status && typeof status === 'string') {
        devices = await storage.getDevicesByStatus(status);
      } else {
        devices = await storage.getDevices();
      }
      
      res.json(devices);
    } catch (error) {
      console.error("Error fetching devices:", error);
      res.status(500).json({ message: "Failed to fetch devices" });
    }
  });

  app.get("/api/devices/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const device = await storage.getDevice(id);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      res.json(device);
    } catch (error) {
      console.error("Error fetching device:", error);
      res.status(500).json({ message: "Failed to fetch device" });
    }
  });

  app.post("/api/devices", isAuthenticated, async (req, res) => {
    try {
      const deviceData = insertDeviceSchema.parse(req.body);
      const device = await storage.createDevice(deviceData);
      res.status(201).json(device);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid device data", errors: error.errors });
      }
      console.error("Error creating device:", error);
      res.status(500).json({ message: "Failed to create device" });
    }
  });

  app.put("/api/devices/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deviceData = insertDeviceSchema.partial().parse(req.body);
      const device = await storage.updateDevice(id, deviceData);
      res.json(device);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid device data", errors: error.errors });
      }
      console.error("Error updating device:", error);
      res.status(500).json({ message: "Failed to update device" });
    }
  });

  // Rental routes
  app.get("/api/rentals", isAuthenticated, async (req, res) => {
    try {
      const { active } = req.query;
      let rentals;
      
      if (active === 'true') {
        rentals = await storage.getActiveRentals();
      } else {
        rentals = await storage.getRentals();
      }
      
      res.json(rentals);
    } catch (error) {
      console.error("Error fetching rentals:", error);
      res.status(500).json({ message: "Failed to fetch rentals" });
    }
  });

  app.post("/api/rentals", isAuthenticated, async (req, res) => {
    try {
      const rentalData = insertRentalSchema.parse(req.body);
      
      // Check for overlapping rentals
      const hasOverlap = await storage.checkRentalOverlap(
        rentalData.deviceId,
        rentalData.rentStartDate,
        rentalData.rentEndDate
      );
      
      if (hasOverlap) {
        return res.status(400).json({ 
          message: "Device is already rented for the specified period" 
        });
      }
      
      const rental = await storage.createRental(rentalData);
      res.status(201).json(rental);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid rental data", errors: error.errors });
      }
      console.error("Error creating rental:", error);
      res.status(500).json({ message: "Failed to create rental" });
    }
  });

  app.post("/api/rentals/:id/return", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const rental = await storage.returnRental(id);
      res.json(rental);
    } catch (error) {
      console.error("Error returning rental:", error);
      res.status(500).json({ message: "Failed to return rental" });
    }
  });

  // Maintenance routes (Technician only)
  app.get("/api/maintenance", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const staffMember = await storage.getStaffByUserId(userId);
      
      if (!staffMember || staffMember.role !== 'Technician') {
        return res.status(403).json({ message: "Access denied. Technician role required." });
      }
      
      const maintenance = await storage.getMaintenance();
      res.json(maintenance);
    } catch (error) {
      console.error("Error fetching maintenance:", error);
      res.status(500).json({ message: "Failed to fetch maintenance" });
    }
  });

  app.post("/api/maintenance", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const staffMember = await storage.getStaffByUserId(userId);
      
      if (!staffMember || staffMember.role !== 'Technician') {
        return res.status(403).json({ message: "Access denied. Technician role required." });
      }
      
      const maintenanceData = insertMaintenanceSchema.parse(req.body);
      maintenanceData.staffId = staffMember.id;
      
      const maintenance = await storage.createMaintenance(maintenanceData);
      res.status(201).json(maintenance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid maintenance data", errors: error.errors });
      }
      console.error("Error creating maintenance:", error);
      res.status(500).json({ message: "Failed to create maintenance" });
    }
  });

  app.put("/api/maintenance/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const staffMember = await storage.getStaffByUserId(userId);
      
      if (!staffMember || staffMember.role !== 'Technician') {
        return res.status(403).json({ message: "Access denied. Technician role required." });
      }
      
      const id = parseInt(req.params.id);
      const maintenanceData = insertMaintenanceSchema.partial().parse(req.body);
      
      const maintenance = await storage.updateMaintenance(id, maintenanceData);
      res.json(maintenance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid maintenance data", errors: error.errors });
      }
      console.error("Error updating maintenance:", error);
      res.status(500).json({ message: "Failed to update maintenance" });
    }
  });

  // Report routes
  app.get("/api/reports/currently-rented", isAuthenticated, async (req, res) => {
    try {
      const devices = await storage.getCurrentlyRentedDevices();
      res.json(devices);
    } catch (error) {
      console.error("Error fetching currently rented devices:", error);
      res.status(500).json({ message: "Failed to fetch currently rented devices" });
    }
  });

  app.get("/api/reports/maintenance-needed", isAuthenticated, async (req, res) => {
    try {
      const devices = await storage.getDevicesNeedingMaintenance();
      res.json(devices);
    } catch (error) {
      console.error("Error fetching devices needing maintenance:", error);
      res.status(500).json({ message: "Failed to fetch devices needing maintenance" });
    }
  });

  app.get("/api/reports/maintenance-history", isAuthenticated, async (req, res) => {
    try {
      const { deviceId } = req.query;
      const history = await storage.getMaintenanceHistory(
        deviceId ? parseInt(deviceId as string) : undefined
      );
      res.json(history);
    } catch (error) {
      console.error("Error fetching maintenance history:", error);
      res.status(500).json({ message: "Failed to fetch maintenance history" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", isAuthenticated, async (req, res) => {
    try {
      const [allDevices, rentedDevices, maintenanceDevices, availableDevices] = await Promise.all([
        storage.getDevices(),
        storage.getDevicesByStatus("Rented"),
        storage.getDevicesByStatus("Under Maintenance"),
        storage.getDevicesByStatus("Available"),
      ]);

      const stats = {
        totalEquipment: allDevices.length,
        currentlyRented: rentedDevices.length,
        underMaintenance: maintenanceDevices.length,
        available: availableDevices.length,
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

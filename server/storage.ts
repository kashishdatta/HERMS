import {
  users,
  departments,
  staff,
  devices,
  rentals,
  maintenance,
  type User,
  type UpsertUser,
  type Department,
  type InsertDepartment,
  type Staff,
  type InsertStaff,
  type Device,
  type InsertDevice,
  type Rental,
  type InsertRental,
  type Maintenance,
  type InsertMaintenance,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, or, desc, asc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Department operations
  getDepartments(): Promise<Department[]>;
  getDepartment(id: number): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  updateDepartment(id: number, department: Partial<InsertDepartment>): Promise<Department>;
  deleteDepartment(id: number): Promise<void>;

  // Staff operations
  getStaff(): Promise<Staff[]>;
  getStaffById(id: number): Promise<Staff | undefined>;
  getStaffByUserId(userId: string): Promise<Staff | undefined>;
  createStaff(staff: InsertStaff): Promise<Staff>;
  updateStaff(id: number, staff: Partial<InsertStaff>): Promise<Staff>;
  deleteStaff(id: number): Promise<void>;

  // Device operations
  getDevices(): Promise<Device[]>;
  getDevice(id: number): Promise<Device | undefined>;
  getDevicesByStatus(status: string): Promise<Device[]>;
  createDevice(device: InsertDevice): Promise<Device>;
  updateDevice(id: number, device: Partial<InsertDevice>): Promise<Device>;
  deleteDevice(id: number): Promise<void>;

  // Rental operations
  getRentals(): Promise<Rental[]>;
  getRental(id: number): Promise<Rental | undefined>;
  getActiveRentals(): Promise<Rental[]>;
  getRentalsByDevice(deviceId: number): Promise<Rental[]>;
  getRentalsByStaff(staffId: number): Promise<Rental[]>;
  createRental(rental: InsertRental): Promise<Rental>;
  updateRental(id: number, rental: Partial<InsertRental>): Promise<Rental>;
  returnRental(id: number): Promise<Rental>;
  checkRentalOverlap(deviceId: number, startDate: string, endDate: string): Promise<boolean>;

  // Maintenance operations
  getMaintenance(): Promise<Maintenance[]>;
  getMaintenanceById(id: number): Promise<Maintenance | undefined>;
  getMaintenanceByDevice(deviceId: number): Promise<Maintenance[]>;
  createMaintenance(maintenance: InsertMaintenance): Promise<Maintenance>;
  updateMaintenance(id: number, maintenance: Partial<InsertMaintenance>): Promise<Maintenance>;
  deleteMaintenance(id: number): Promise<void>;

  // Report operations
  getCurrentlyRentedDevices(): Promise<any[]>;
  getDevicesNeedingMaintenance(): Promise<any[]>;
  getMaintenanceHistory(deviceId?: number): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Department operations
  async getDepartments(): Promise<Department[]> {
    return await db.select().from(departments).orderBy(asc(departments.name));
  }

  async getDepartment(id: number): Promise<Department | undefined> {
    const [department] = await db.select().from(departments).where(eq(departments.id, id));
    return department;
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const [newDepartment] = await db.insert(departments).values(department).returning();
    return newDepartment;
  }

  async updateDepartment(id: number, department: Partial<InsertDepartment>): Promise<Department> {
    const [updatedDepartment] = await db
      .update(departments)
      .set(department)
      .where(eq(departments.id, id))
      .returning();
    return updatedDepartment;
  }

  async deleteDepartment(id: number): Promise<void> {
    await db.delete(departments).where(eq(departments.id, id));
  }

  // Staff operations
  async getStaff(): Promise<Staff[]> {
    return await db.select().from(staff).orderBy(asc(staff.firstName));
  }

  async getStaffById(id: number): Promise<Staff | undefined> {
    const [staffMember] = await db.select().from(staff).where(eq(staff.id, id));
    return staffMember;
  }

  async getStaffByUserId(userId: string): Promise<Staff | undefined> {
    const [staffMember] = await db.select().from(staff).where(eq(staff.userId, userId));
    return staffMember;
  }

  async createStaff(staffData: InsertStaff): Promise<Staff> {
    const [newStaff] = await db.insert(staff).values(staffData).returning();
    return newStaff;
  }

  async updateStaff(id: number, staffData: Partial<InsertStaff>): Promise<Staff> {
    const [updatedStaff] = await db
      .update(staff)
      .set(staffData)
      .where(eq(staff.id, id))
      .returning();
    return updatedStaff;
  }

  async deleteStaff(id: number): Promise<void> {
    await db.delete(staff).where(eq(staff.id, id));
  }

  // Device operations
  async getDevices(): Promise<Device[]> {
    return await db.select().from(devices).orderBy(asc(devices.deviceName));
  }

  async getDevice(id: number): Promise<Device | undefined> {
    const [device] = await db.select().from(devices).where(eq(devices.id, id));
    return device;
  }

  async getDevicesByStatus(status: string): Promise<Device[]> {
    return await db.select().from(devices).where(eq(devices.status, status));
  }

  async createDevice(device: InsertDevice): Promise<Device> {
    const [newDevice] = await db.insert(devices).values(device).returning();
    return newDevice;
  }

  async updateDevice(id: number, device: Partial<InsertDevice>): Promise<Device> {
    const [updatedDevice] = await db
      .update(devices)
      .set(device)
      .where(eq(devices.id, id))
      .returning();
    return updatedDevice;
  }

  async deleteDevice(id: number): Promise<void> {
    await db.delete(devices).where(eq(devices.id, id));
  }

  // Rental operations
  async getRentals(): Promise<Rental[]> {
    return await db.select().from(rentals).orderBy(desc(rentals.createdAt));
  }

  async getRental(id: number): Promise<Rental | undefined> {
    const [rental] = await db.select().from(rentals).where(eq(rentals.id, id));
    return rental;
  }

  async getActiveRentals(): Promise<Rental[]> {
    return await db
      .select()
      .from(rentals)
      .where(eq(rentals.rentalStatus, "Active"))
      .orderBy(asc(rentals.rentEndDate));
  }

  async getRentalsByDevice(deviceId: number): Promise<Rental[]> {
    return await db
      .select()
      .from(rentals)
      .where(eq(rentals.deviceId, deviceId))
      .orderBy(desc(rentals.createdAt));
  }

  async getRentalsByStaff(staffId: number): Promise<Rental[]> {
    return await db
      .select()
      .from(rentals)
      .where(eq(rentals.staffId, staffId))
      .orderBy(desc(rentals.createdAt));
  }

  async createRental(rental: InsertRental): Promise<Rental> {
    const [newRental] = await db.insert(rentals).values(rental).returning();
    
    // Update device status to Rented
    await db
      .update(devices)
      .set({ status: "Rented" })
      .where(eq(devices.id, rental.deviceId));
    
    return newRental;
  }

  async updateRental(id: number, rental: Partial<InsertRental>): Promise<Rental> {
    const [updatedRental] = await db
      .update(rentals)
      .set(rental)
      .where(eq(rentals.id, id))
      .returning();
    return updatedRental;
  }

  async returnRental(id: number): Promise<Rental> {
    const [rental] = await db
      .update(rentals)
      .set({ 
        rentalStatus: "Returned",
        actualReturnDate: new Date().toISOString().split('T')[0]
      })
      .where(eq(rentals.id, id))
      .returning();
    
    // Update device status to Available
    await db
      .update(devices)
      .set({ status: "Available" })
      .where(eq(devices.id, rental.deviceId));
    
    return rental;
  }

  async checkRentalOverlap(deviceId: number, startDate: string, endDate: string): Promise<boolean> {
    const overlappingRentals = await db
      .select()
      .from(rentals)
      .where(
        and(
          eq(rentals.deviceId, deviceId),
          eq(rentals.rentalStatus, "Active"),
          or(
            and(
              lte(rentals.rentStartDate, startDate),
              gte(rentals.rentEndDate, startDate)
            ),
            and(
              lte(rentals.rentStartDate, endDate),
              gte(rentals.rentEndDate, endDate)
            ),
            and(
              gte(rentals.rentStartDate, startDate),
              lte(rentals.rentEndDate, endDate)
            )
          )
        )
      );
    
    return overlappingRentals.length > 0;
  }

  // Maintenance operations
  async getMaintenance(): Promise<Maintenance[]> {
    return await db.select().from(maintenance).orderBy(desc(maintenance.createdAt));
  }

  async getMaintenanceById(id: number): Promise<Maintenance | undefined> {
    const [maintenanceRecord] = await db.select().from(maintenance).where(eq(maintenance.id, id));
    return maintenanceRecord;
  }

  async getMaintenanceByDevice(deviceId: number): Promise<Maintenance[]> {
    return await db
      .select()
      .from(maintenance)
      .where(eq(maintenance.deviceId, deviceId))
      .orderBy(desc(maintenance.createdAt));
  }

  async createMaintenance(maintenanceData: InsertMaintenance): Promise<Maintenance> {
    const [newMaintenance] = await db.insert(maintenance).values(maintenanceData).returning();
    
    // Update device status to Under Maintenance
    await db
      .update(devices)
      .set({ status: "Under Maintenance" })
      .where(eq(devices.id, maintenanceData.deviceId));
    
    return newMaintenance;
  }

  async updateMaintenance(id: number, maintenanceData: Partial<InsertMaintenance>): Promise<Maintenance> {
    const [updatedMaintenance] = await db
      .update(maintenance)
      .set(maintenanceData)
      .where(eq(maintenance.id, id))
      .returning();
    
    // If maintenance is completed, update device status to Available
    if (maintenanceData.status === "Completed") {
      await db
        .update(devices)
        .set({ status: "Available" })
        .where(eq(devices.id, updatedMaintenance.deviceId));
    }
    
    return updatedMaintenance;
  }

  async deleteMaintenance(id: number): Promise<void> {
    const [maintenanceRecord] = await db.select().from(maintenance).where(eq(maintenance.id, id));
    if (maintenanceRecord) {
      await db.delete(maintenance).where(eq(maintenance.id, id));
      
      // Update device status to Available if no other active maintenance
      const activeMaintenance = await db
        .select()
        .from(maintenance)
        .where(
          and(
            eq(maintenance.deviceId, maintenanceRecord.deviceId),
            or(
              eq(maintenance.status, "Pending"),
              eq(maintenance.status, "In Progress")
            )
          )
        );
      
      if (activeMaintenance.length === 0) {
        await db
          .update(devices)
          .set({ status: "Available" })
          .where(eq(devices.id, maintenanceRecord.deviceId));
      }
    }
  }

  // Report operations
  async getCurrentlyRentedDevices(): Promise<any[]> {
    return await db
      .select({
        rentalId: rentals.id,
        deviceName: devices.deviceName,
        deviceType: devices.deviceType,
        staffName: sql<string>`${staff.firstName} || ' ' || ${staff.lastName}`,
        departmentName: departments.name,
        rentStartDate: rentals.rentStartDate,
        rentEndDate: rentals.rentEndDate,
        purpose: rentals.purpose,
      })
      .from(rentals)
      .innerJoin(devices, eq(rentals.deviceId, devices.id))
      .innerJoin(staff, eq(rentals.staffId, staff.id))
      .innerJoin(departments, eq(rentals.departmentId, departments.id))
      .where(eq(rentals.rentalStatus, "Active"))
      .orderBy(asc(rentals.rentEndDate));
  }

  async getDevicesNeedingMaintenance(): Promise<any[]> {
    return await db
      .select({
        deviceId: devices.id,
        deviceName: devices.deviceName,
        deviceType: devices.deviceType,
        manufacturer: devices.manufacturer,
        currentLocation: devices.currentLocation,
        lastMaintenanceDate: sql<string>`MAX(${maintenance.endDate})`,
      })
      .from(devices)
      .leftJoin(maintenance, eq(devices.id, maintenance.deviceId))
      .where(eq(devices.status, "Available"))
      .groupBy(devices.id)
      .having(
        or(
          sql`MAX(${maintenance.endDate}) IS NULL`,
          sql`MAX(${maintenance.endDate}) < DATE('now', '-6 months')`
        )
      )
      .orderBy(asc(devices.deviceName));
  }

  async getMaintenanceHistory(deviceId?: number): Promise<any[]> {
    let query = db
      .select({
        maintenanceId: maintenance.id,
        deviceName: devices.deviceName,
        deviceType: devices.deviceType,
        technicianName: sql<string>`${staff.firstName} || ' ' || ${staff.lastName}`,
        maintenanceType: maintenance.maintenanceType,
        startDate: maintenance.startDate,
        endDate: maintenance.endDate,
        cost: maintenance.cost,
        status: maintenance.status,
        description: maintenance.description,
      })
      .from(maintenance)
      .innerJoin(devices, eq(maintenance.deviceId, devices.id))
      .innerJoin(staff, eq(maintenance.staffId, staff.id));
    
    if (deviceId) {
      query = query.where(eq(maintenance.deviceId, deviceId));
    }
    
    return await query.orderBy(desc(maintenance.createdAt));
  }
}

export const storage = new DatabaseStorage();

import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  date,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Department table
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  location: varchar("location", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  contactPerson: varchar("contact_person", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Staff table
export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(), // 'Staff' or 'Technician'
  email: varchar("email", { length: 255 }).notNull().unique(),
  contact: varchar("contact", { length: 20 }),
  departmentId: integer("department_id").references(() => departments.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Device table
export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  deviceName: varchar("device_name", { length: 255 }).notNull(),
  deviceType: varchar("device_type", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("Available"), // 'Available', 'Rented', 'Under Maintenance'
  currentLocation: varchar("current_location", { length: 255 }),
  purchaseDate: date("purchase_date"),
  manufacturer: varchar("manufacturer", { length: 255 }),
  model: varchar("model", { length: 255 }),
  serialNumber: varchar("serial_number", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Rental table
export const rentals = pgTable("rentals", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id").references(() => devices.id).notNull(),
  staffId: integer("staff_id").references(() => staff.id).notNull(),
  departmentId: integer("department_id").references(() => departments.id).notNull(),
  rentStartDate: date("rent_start_date").notNull(),
  rentEndDate: date("rent_end_date").notNull(),
  actualReturnDate: date("actual_return_date"),
  rentalStatus: varchar("rental_status", { length: 50 }).notNull().default("Active"), // 'Active', 'Returned', 'Overdue'
  purpose: text("purpose"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Maintenance table
export const maintenance = pgTable("maintenance", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id").references(() => devices.id).notNull(),
  staffId: integer("staff_id").references(() => staff.id).notNull(),
  maintenanceType: varchar("maintenance_type", { length: 100 }).notNull(), // 'Preventive', 'Repair', 'Calibration', 'Inspection'
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 50 }).notNull().default("Pending"), // 'Pending', 'In Progress', 'Completed'
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const departmentRelations = relations(departments, ({ many }) => ({
  staff: many(staff),
  rentals: many(rentals),
}));

export const staffRelations = relations(staff, ({ one, many }) => ({
  department: one(departments, {
    fields: [staff.departmentId],
    references: [departments.id],
  }),
  user: one(users, {
    fields: [staff.userId],
    references: [users.id],
  }),
  rentals: many(rentals),
  maintenance: many(maintenance),
}));

export const deviceRelations = relations(devices, ({ many }) => ({
  rentals: many(rentals),
  maintenance: many(maintenance),
}));

export const rentalRelations = relations(rentals, ({ one }) => ({
  device: one(devices, {
    fields: [rentals.deviceId],
    references: [devices.id],
  }),
  staff: one(staff, {
    fields: [rentals.staffId],
    references: [staff.id],
  }),
  department: one(departments, {
    fields: [rentals.departmentId],
    references: [departments.id],
  }),
}));

export const maintenanceRelations = relations(maintenance, ({ one }) => ({
  device: one(devices, {
    fields: [maintenance.deviceId],
    references: [devices.id],
  }),
  staff: one(staff, {
    fields: [maintenance.staffId],
    references: [staff.id],
  }),
}));

// Insert schemas
export const insertDepartmentSchema = createInsertSchema(departments).omit({
  id: true,
  createdAt: true,
});

export const insertStaffSchema = createInsertSchema(staff).omit({
  id: true,
  createdAt: true,
});

export const insertDeviceSchema = createInsertSchema(devices).omit({
  id: true,
  createdAt: true,
});

export const insertRentalSchema = createInsertSchema(rentals).omit({
  id: true,
  createdAt: true,
  actualReturnDate: true,
});

export const insertMaintenanceSchema = createInsertSchema(maintenance).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Staff = typeof staff.$inferSelect;
export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type Device = typeof devices.$inferSelect;
export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type Rental = typeof rentals.$inferSelect;
export type InsertRental = z.infer<typeof insertRentalSchema>;
export type Maintenance = typeof maintenance.$inferSelect;
export type InsertMaintenance = z.infer<typeof insertMaintenanceSchema>;

// Mock data for the application
export const mockStats = {
  totalEquipment: 45,
  currentlyRented: 12,
  underMaintenance: 3,
  available: 30,
};

export const mockDevices = [
  {
    id: 1,
    deviceName: "X-Ray Machine Model A",
    deviceType: "Diagnostic",
    status: "Available",
    currentLocation: "Radiology Dept - Room 101",
    manufacturer: "MedTech Industries",
    model: "XR-2024",
    serialNumber: "XR2024001",
    purchaseDate: "2023-01-15",
    createdAt: new Date(),
  },
  {
    id: 2,
    deviceName: "Patient Monitor Pro",
    deviceType: "Monitoring",
    status: "Rented",
    currentLocation: "ICU - Room 203",
    manufacturer: "HealthCare Systems",
    model: "PM-500",
    serialNumber: "PM500002",
    purchaseDate: "2023-03-20",
    createdAt: new Date(),
  },
  {
    id: 3,
    deviceName: "Ultrasound Scanner",
    deviceType: "Diagnostic",
    status: "Under Maintenance",
    currentLocation: "Maintenance Workshop",
    manufacturer: "SonoMed Corp",
    model: "US-Pro",
    serialNumber: "USP003",
    purchaseDate: "2023-05-10",
    createdAt: new Date(),
  },
  {
    id: 4,
    deviceName: "Ventilator Advanced",
    deviceType: "Respiratory",
    status: "Available",
    currentLocation: "Emergency Dept",
    manufacturer: "RespiCare",
    model: "VA-300",
    serialNumber: "VA300004",
    purchaseDate: "2023-07-12",
    createdAt: new Date(),
  },
  {
    id: 5,
    deviceName: "Surgical Robot",
    deviceType: "Surgical",
    status: "Available",
    currentLocation: "OR-5",
    manufacturer: "RoboSurg",
    model: "RS-1000",
    serialNumber: "RS1000005",
    purchaseDate: "2023-09-01",
    createdAt: new Date(),
  }
];

export const mockDepartments = [
  {
    id: 1,
    name: "Radiology",
    location: "Building A, Floor 2",
    phone: "+1-555-0101",
    contactPerson: "Dr. Sarah Johnson",
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Intensive Care Unit",
    location: "Building B, Floor 3",
    phone: "+1-555-0102",
    contactPerson: "Nurse Manager Jane Smith",
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "Emergency Department",
    location: "Building A, Floor 1",
    phone: "+1-555-0103",
    contactPerson: "Dr. Michael Brown",
    createdAt: new Date(),
  },
  {
    id: 4,
    name: "Surgery",
    location: "Building C, Floor 2",
    phone: "+1-555-0104",
    contactPerson: "Dr. Emily Davis",
    createdAt: new Date(),
  }
];

export const mockStaff = [
  {
    id: 1,
    userId: null,
    firstName: "John",
    lastName: "Doe",
    role: "Staff",
    email: "john.doe@hospital.com",
    contact: "+1-555-1001",
    departmentId: 1,
    createdAt: new Date(),
  },
  {
    id: 2,
    userId: null,
    firstName: "Alice",
    lastName: "Smith",
    role: "Technician",
    email: "alice.smith@hospital.com",
    contact: "+1-555-1002",
    departmentId: 2,
    createdAt: new Date(),
  },
  {
    id: 3,
    userId: null,
    firstName: "Bob",
    lastName: "Wilson",
    role: "Staff",
    email: "bob.wilson@hospital.com",
    contact: "+1-555-1003",
    departmentId: 3,
    createdAt: new Date(),
  },
  {
    id: 4,
    userId: null,
    firstName: "Carol",
    lastName: "Johnson",
    role: "Technician",
    email: "carol.johnson@hospital.com",
    contact: "+1-555-1004",
    departmentId: 1,
    createdAt: new Date(),
  }
];

export const mockRentals = [
  {
    rentalId: 1,
    deviceName: "Patient Monitor Pro",
    deviceType: "Monitoring",
    staffName: "John Doe",
    departmentName: "Intensive Care Unit",
    rentStartDate: "2024-06-10",
    rentEndDate: "2024-06-20",
    purpose: "Patient monitoring in ICU",
  },
  {
    rentalId: 2,
    deviceName: "Portable X-Ray",
    deviceType: "Diagnostic",
    staffName: "Bob Wilson",
    departmentName: "Emergency Department",
    rentStartDate: "2024-06-12",
    rentEndDate: "2024-06-22",
    purpose: "Emergency diagnostics",
  }
];

export const mockMaintenanceHistory = [
  {
    maintenanceId: 1,
    deviceName: "Ultrasound Scanner",
    deviceType: "Diagnostic",
    technicianName: "Alice Smith",
    maintenanceType: "Repair",
    startDate: "2024-06-01",
    endDate: "2024-06-05",
    cost: "850.00",
    status: "Completed",
    description: "Replaced probe cable and calibrated system",
  },
  {
    maintenanceId: 2,
    deviceName: "X-Ray Machine Model A",
    deviceType: "Diagnostic",
    technicianName: "Carol Johnson",
    maintenanceType: "Preventive",
    startDate: "2024-06-15",
    endDate: null,
    cost: "1200.00",
    status: "In Progress",
    description: "Annual maintenance and calibration",
  }
];

export const mockMaintenanceNeeded = [
  {
    deviceId: 4,
    deviceName: "Ventilator Advanced",
    deviceType: "Respiratory",
    manufacturer: "RespiCare",
    currentLocation: "Emergency Dept",
    lastMaintenanceDate: "2023-12-15",
  },
  {
    deviceId: 5,
    deviceName: "Surgical Robot",
    deviceType: "Surgical",
    manufacturer: "RoboSurg",
    currentLocation: "OR-5",
    lastMaintenanceDate: null,
  }
];

export const mockNotifications = [
  {
    id: 1,
    type: "overdue",
    title: "Overdue Return",
    message: "Patient Monitor Pro (Rental #1) was due on 2024-06-20",
    timestamp: new Date("2024-06-21T10:00:00"),
    read: false,
  },
  {
    id: 2,
    type: "maintenance",
    title: "Maintenance Required",
    message: "Ventilator Advanced requires scheduled maintenance",
    timestamp: new Date("2024-06-17T14:30:00"),
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "Equipment Added",
    message: "New MRI Scanner added to inventory",
    timestamp: new Date("2024-06-16T09:15:00"),
    read: true,
  }
];

export const mockAuditTrail = [
  {
    id: 1,
    action: "Equipment Added",
    details: "X-Ray Machine Model A added to inventory",
    user: "Admin User",
    timestamp: new Date("2024-06-15T08:30:00"),
    entityType: "Device",
    entityId: 1,
  },
  {
    id: 2,
    action: "Rental Created",
    details: "Patient Monitor Pro rented to ICU",
    user: "John Doe",
    timestamp: new Date("2024-06-10T14:20:00"),
    entityType: "Rental",
    entityId: 1,
  },
  {
    id: 3,
    action: "Maintenance Completed",
    details: "Ultrasound Scanner maintenance completed",
    user: "Alice Smith",
    timestamp: new Date("2024-06-05T16:45:00"),
    entityType: "Maintenance",
    entityId: 1,
  }
];
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import StatusBadge from "@/components/ui/status-badge";

export default function Reports() {
  const [reportType, setReportType] = useState<string>("currently-rented");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: currentlyRented, isLoading: currentlyRentedLoading } = useQuery({
    queryKey: ["/api/reports/currently-rented"],
    enabled: reportType === "currently-rented",
  });

  const { data: maintenanceNeeded, isLoading: maintenanceNeededLoading } = useQuery({
    queryKey: ["/api/reports/maintenance-needed"],
    enabled: reportType === "maintenance-needed",
  });

  const { data: maintenanceHistory, isLoading: maintenanceHistoryLoading } = useQuery({
    queryKey: ["/api/reports/maintenance-history"],
    enabled: reportType === "maintenance-history",
  });

  const { data: departments } = useQuery({
    queryKey: ["/api/departments"],
  });

  const handleExportCSV = () => {
    let data: any[] = [];
    let filename = "";

    switch (reportType) {
      case "currently-rented":
        data = currentlyRented || [];
        filename = "currently-rented-equipment.csv";
        break;
      case "maintenance-needed":
        data = maintenanceNeeded || [];
        filename = "equipment-needing-maintenance.csv";
        break;
      case "maintenance-history":
        data = maintenanceHistory || [];
        filename = "maintenance-history.csv";
        break;
    }

    if (data.length === 0) {
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row => headers.map(header => `"${row[header] || ""}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderReportContent = () => {
    const isLoading = currentlyRentedLoading || maintenanceNeededLoading || maintenanceHistoryLoading;

    if (isLoading) {
      return (
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      );
    }

    switch (reportType) {
      case "currently-rented":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Rental Period</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentlyRented && currentlyRented.length > 0 ? (
                currentlyRented.map((rental: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{rental.deviceName}</TableCell>
                    <TableCell>{rental.departmentName}</TableCell>
                    <TableCell>{rental.staffName}</TableCell>
                    <TableCell>{rental.rentStartDate} - {rental.rentEndDate}</TableCell>
                    <TableCell>
                      <StatusBadge status="active" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-calendar-check text-gray-400 text-2xl"></i>
                    </div>
                    <p className="text-gray-600">No currently rented equipment</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        );

      case "maintenance-needed":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Maintenance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenanceNeeded && maintenanceNeeded.length > 0 ? (
                maintenanceNeeded.map((device: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{device.deviceName}</TableCell>
                    <TableCell>{device.deviceType}</TableCell>
                    <TableCell>{device.manufacturer || "N/A"}</TableCell>
                    <TableCell>{device.currentLocation || "N/A"}</TableCell>
                    <TableCell>{device.lastMaintenanceDate || "Never"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-tools text-gray-400 text-2xl"></i>
                    </div>
                    <p className="text-gray-600">No equipment needs maintenance</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        );

      case "maintenance-history":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenanceHistory && maintenanceHistory.length > 0 ? (
                maintenanceHistory.map((maintenance: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{maintenance.deviceName}</TableCell>
                    <TableCell>{maintenance.technicianName}</TableCell>
                    <TableCell>{maintenance.maintenanceType}</TableCell>
                    <TableCell>{maintenance.startDate}</TableCell>
                    <TableCell>{maintenance.cost ? `$${maintenance.cost}` : "N/A"}</TableCell>
                    <TableCell>
                      <StatusBadge status={maintenance.status} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-history text-gray-400 text-2xl"></i>
                    </div>
                    <p className="text-gray-600">No maintenance history found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        );

      default:
        return null;
    }
  };

  const getReportTitle = () => {
    switch (reportType) {
      case "currently-rented":
        return "Currently Rented Equipment Report";
      case "maintenance-needed":
        return "Equipment Needing Maintenance Report";
      case "maintenance-history":
        return "Maintenance History Report";
      default:
        return "Report";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Header title="Reports & Analytics" description="Generate reports and view analytics" />
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Quick Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className={`w-full justify-start ${reportType === 'currently-rented' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setReportType('currently-rented')}
                >
                  <i className="fas fa-calendar-check mr-3"></i>
                  Currently Rented Equipment
                </Button>
                <Button 
                  className={`w-full justify-start ${reportType === 'maintenance-needed' ? 'bg-warning text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setReportType('maintenance-needed')}
                >
                  <i className="fas fa-tools mr-3"></i>
                  Equipment Needing Maintenance
                </Button>
                <Button 
                  className={`w-full justify-start ${reportType === 'maintenance-history' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setReportType('maintenance-history')}
                >
                  <i className="fas fa-history mr-3"></i>
                  Maintenance History
                </Button>
              </CardContent>
            </Card>

            {/* Report Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      type="date" 
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                    <Input 
                      type="date" 
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments?.map((dept: any) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full bg-primary hover:bg-blue-700">
                  Apply Filters
                </Button>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full justify-start bg-success hover:bg-green-600 text-white"
                  onClick={handleExportCSV}
                >
                  <i className="fas fa-file-csv mr-3"></i>
                  Export as CSV
                </Button>
                <Button className="w-full justify-start bg-error hover:bg-red-600 text-white">
                  <i className="fas fa-file-pdf mr-3"></i>
                  Export as PDF
                </Button>
                <Button className="w-full justify-start bg-gray-100 text-gray-700 hover:bg-gray-200">
                  <i className="fas fa-envelope mr-3"></i>
                  Email Report
                </Button>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Schedule Reports</h4>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="No Schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Schedule</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Data */}
          <Card>
            <CardHeader>
              <CardTitle>{getReportTitle()}</CardTitle>
              <p className="text-sm text-gray-600">
                Generated on: {new Date().toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              {renderReportContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

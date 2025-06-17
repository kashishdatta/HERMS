import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Download, FileText, TrendingUp, Activity } from "lucide-react";
import Papa from "papaparse";
import { mockDevices, mockRentals, mockMaintenanceHistory } from "@/lib/mockData";

interface AnalyticsProps {
  userRole: 'Staff' | 'Technician';
}

export default function AdvancedAnalytics({ userRole }: AnalyticsProps) {
  // Equipment by type data
  const equipmentByType = mockDevices.reduce((acc, device) => {
    const type = device.deviceType;
    const existing = acc.find(item => item.name === type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: type, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Equipment status data
  const equipmentByStatus = mockDevices.reduce((acc, device) => {
    const status = device.status;
    const existing = acc.find(item => item.name === status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: status, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Monthly rental trends (simulated data)
  const monthlyRentals = [
    { month: 'Jan', rentals: 15, returns: 12 },
    { month: 'Feb', rentals: 23, returns: 18 },
    { month: 'Mar', rentals: 18, returns: 20 },
    { month: 'Apr', rentals: 28, returns: 25 },
    { month: 'May', rentals: 32, returns: 30 },
    { month: 'Jun', rentals: 45, returns: 38 },
  ];

  // Maintenance cost trends
  const maintenanceCosts = [
    { month: 'Jan', cost: 2500 },
    { month: 'Feb', cost: 3200 },
    { month: 'Mar', cost: 1800 },
    { month: 'Apr', cost: 4100 },
    { month: 'May', cost: 2900 },
    { month: 'Jun', cost: 3500 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const exportToCSV = (data: any[], filename: string) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportEquipmentReport = () => {
    const reportData = mockDevices.map(device => ({
      'Device Name': device.deviceName,
      'Type': device.deviceType,
      'Status': device.status,
      'Location': device.currentLocation,
      'Manufacturer': device.manufacturer,
      'Model': device.model,
      'Serial Number': device.serialNumber,
      'Purchase Date': device.purchaseDate,
    }));
    exportToCSV(reportData, 'equipment-report.csv');
  };

  const exportRentalsReport = () => {
    const reportData = mockRentals.map(rental => ({
      'Rental ID': rental.rentalId,
      'Device Name': rental.deviceName,
      'Staff Name': rental.staffName,
      'Department': rental.departmentName,
      'Start Date': rental.rentStartDate,
      'End Date': rental.rentEndDate,
      'Purpose': rental.purpose,
    }));
    exportToCSV(reportData, 'rentals-report.csv');
  };

  const exportMaintenanceReport = () => {
    const reportData = mockMaintenanceHistory.map(maintenance => ({
      'Maintenance ID': maintenance.maintenanceId,
      'Device Name': maintenance.deviceName,
      'Technician': maintenance.technicianName,
      'Type': maintenance.maintenanceType,
      'Start Date': maintenance.startDate,
      'End Date': maintenance.endDate || 'In Progress',
      'Cost': maintenance.cost,
      'Status': maintenance.status,
      'Description': maintenance.description,
    }));
    exportToCSV(reportData, 'maintenance-report.csv');
  };

  return (
    <div className="space-y-6">
      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={exportEquipmentReport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Equipment Report
            </Button>
            <Button onClick={exportRentalsReport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Rentals Report
            </Button>
            {userRole === 'Technician' && (
              <Button onClick={exportMaintenanceReport} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Maintenance Report
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Equipment Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Equipment by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={equipmentByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {equipmentByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={equipmentByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trend Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Rental Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRentals}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="rentals" stroke="#8884d8" name="Rentals" />
                <Line type="monotone" dataKey="returns" stroke="#82ca9d" name="Returns" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {userRole === 'Technician' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Maintenance Costs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={maintenanceCosts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Cost']} />
                  <Bar dataKey="cost" fill="#ff7300" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Key Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Utilization Rate</p>
                  <p className="text-2xl font-bold text-blue-700">67%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">On-Time Returns</p>
                  <p className="text-2xl font-bold text-green-700">94%</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Good</Badge>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Avg Rental Duration</p>
                  <p className="text-2xl font-bold text-yellow-700">8.5 days</p>
                </div>
                <Activity className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Overdue Items</p>
                  <p className="text-2xl font-bold text-red-700">3</p>
                </div>
                <Badge variant="destructive">Action Needed</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
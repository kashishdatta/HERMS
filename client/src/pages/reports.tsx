import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import AdvancedAnalytics from "@/components/reports/advanced-analytics";
import AuditTrail from "@/components/audit/audit-trail";
import { mockRentals, mockMaintenanceHistory, mockMaintenanceNeeded } from "@/lib/mockData";

interface ReportsProps {
  userRole: 'Staff' | 'Technician';
  onLogout: () => void;
}

export default function Reports({ userRole, onLogout }: ReportsProps) {
  const currentlyRented = mockRentals;
  const maintenanceHistory = mockMaintenanceHistory;
  const maintenanceNeeded = mockMaintenanceNeeded;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar userRole={userRole} onLogout={onLogout} />
      <div className="ml-64 flex-1">
        <Header 
          title="Reports & Analytics" 
          description="Comprehensive reporting and system insights"
        />
        
        <div className="p-6">
          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="rentals">Current Rentals</TabsTrigger>
              {userRole === 'Technician' && (
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              )}
              <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-6">
              <AdvancedAnalytics userRole={userRole} />
            </TabsContent>

            <TabsContent value="rentals" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Currently Rented Equipment</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Staff</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentlyRented.map((rental) => (
                        <TableRow key={rental.rentalId}>
                          <TableCell className="font-medium">{rental.deviceName}</TableCell>
                          <TableCell>{rental.deviceType}</TableCell>
                          <TableCell>{rental.staffName}</TableCell>
                          <TableCell>{rental.departmentName}</TableCell>
                          <TableCell>{rental.rentStartDate}</TableCell>
                          <TableCell>{rental.rentEndDate}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">Active</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {userRole === 'Technician' && (
              <TabsContent value="maintenance" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Maintenance History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Device</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Technician</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Cost</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {maintenanceHistory.map((maintenance) => (
                            <TableRow key={maintenance.maintenanceId}>
                              <TableCell className="font-medium">{maintenance.deviceName}</TableCell>
                              <TableCell>{maintenance.maintenanceType}</TableCell>
                              <TableCell>{maintenance.technicianName}</TableCell>
                              <TableCell>
                                <Badge variant={maintenance.status === 'Completed' ? 'default' : 'secondary'}>
                                  {maintenance.status}
                                </Badge>
                              </TableCell>
                              <TableCell>${maintenance.cost}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Equipment Needing Maintenance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Device</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Last Maintenance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {maintenanceNeeded.map((device) => (
                            <TableRow key={device.deviceId}>
                              <TableCell className="font-medium">{device.deviceName}</TableCell>
                              <TableCell>{device.deviceType}</TableCell>
                              <TableCell>{device.currentLocation}</TableCell>
                              <TableCell>
                                {device.lastMaintenanceDate || (
                                  <Badge variant="destructive">Never</Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            )}

            <TabsContent value="audit" className="space-y-6">
              <AuditTrail userRole={userRole} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
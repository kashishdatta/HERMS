import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { mockStats, mockRentals, mockNotifications } from "@/lib/mockData";

interface DashboardProps {
  userRole: 'Staff' | 'Technician';
  onLogout: () => void;
}

export default function Dashboard({ userRole, onLogout }: DashboardProps) {
  const stats = mockStats;
  const currentlyRented = mockRentals;
  const notifications = mockNotifications;



  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Header 
          title="Dashboard" 
          description="Overview of equipment and activities"
        />
        
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Equipment</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats?.totalEquipment || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-medical-bag text-primary text-xl"></i>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-success flex items-center">
                    <i className="fas fa-check-circle mr-1"></i>
                    Active
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Currently Rented</p>
                    <p className="text-3xl font-bold text-warning mt-2">
                      {stats?.currentlyRented || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-calendar-check text-warning text-xl"></i>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-600">In use</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Under Maintenance</p>
                    <p className="text-3xl font-bold text-error mt-2">
                      {stats?.underMaintenance || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-tools text-error text-xl"></i>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-error">Service required</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available</p>
                    <p className="text-3xl font-bold text-success mt-2">
                      {stats?.available || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-check-circle text-success text-xl"></i>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-success">Ready for rental</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Rentals */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Currently Rented Equipment</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentlyRented && currentlyRented.length > 0 ? (
                    <div className="space-y-4">
                      {currentlyRented.slice(0, 5).map((rental: any) => (
                        <div key={rental.rentalId} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <i className="fas fa-medical-bag text-primary"></i>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{rental.deviceName}</h4>
                              <p className="text-sm text-gray-600">
                                {rental.departmentName} • {rental.staffName}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="mb-1">
                              Active
                            </Badge>
                            <p className="text-sm text-gray-500">
                              Due: {rental.rentEndDate}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-calendar-check text-gray-400 text-2xl"></i>
                      </div>
                      <p className="text-gray-600">No active rentals</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start bg-primary hover:bg-blue-700">
                  <i className="fas fa-plus mr-3"></i>
                  Request Equipment
                </Button>
                <Button className="w-full justify-start bg-warning hover:bg-orange-600">
                  <i className="fas fa-undo mr-3"></i>
                  Return Equipment
                </Button>
                {user?.staff?.role === 'Technician' && (
                  <Button className="w-full justify-start bg-secondary hover:bg-teal-700">
                    <i className="fas fa-tools mr-3"></i>
                    Log Maintenance
                  </Button>
                )}
                <Button variant="outline" className="w-full justify-start">
                  <i className="fas fa-file-alt mr-3"></i>
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

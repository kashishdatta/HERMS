import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import StatusBadge from "@/components/ui/status-badge";
import MaintenanceForm from "@/components/maintenance/maintenance-form";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Maintenance() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isNewMaintenanceDialogOpen, setIsNewMaintenanceDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isTechnician = user?.staff?.role === 'Technician';

  const { data: maintenanceHistory, isLoading } = useQuery({
    queryKey: ["/api/reports/maintenance-history"],
    enabled: isTechnician,
  });

  const { data: devices } = useQuery({
    queryKey: ["/api/devices"],
    enabled: isTechnician,
  });

  const createMaintenanceMutation = useMutation({
    mutationFn: async (maintenanceData: any) => {
      await apiRequest("POST", "/api/maintenance", maintenanceData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports/maintenance-history"] });
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      toast({
        title: "Success",
        description: "Maintenance logged successfully",
      });
      setIsNewMaintenanceDialogOpen(false);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredMaintenance = maintenanceHistory?.filter((maintenance: any) => {
    return statusFilter === "all" || maintenance.status.toLowerCase() === statusFilter.toLowerCase();
  }) || [];

  const handleCreateMaintenance = (maintenanceData: any) => {
    createMaintenanceMutation.mutate(maintenanceData);
  };

  // Redirect to unauthorized page if not a technician
  useEffect(() => {
    if (user && !isTechnician) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [user, isTechnician, toast]);

  if (!isTechnician) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <div className="ml-64 flex-1">
          <Header title="Maintenance Management" description="Log and track maintenance activities" />
          <div className="p-6">
            <Card>
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-lock text-gray-400 text-2xl"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
                <p className="text-sm text-gray-600">Only technicians can access maintenance features.</p>
                <p className="text-xs text-gray-500 mt-2">Contact your administrator if you need access.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <div className="ml-64 flex-1">
          <Header title="Maintenance Management" description="Log and track maintenance activities" />
          <div className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="h-96 bg-gray-200 rounded-xl"></div>
                <div className="col-span-2 h-96 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Header title="Maintenance Management" description="Log and track maintenance activities" />
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Maintenance Form */}
            <Card>
              <CardHeader>
                <CardTitle>Log Maintenance</CardTitle>
                <p className="text-sm text-gray-600">Available for technicians only</p>
              </CardHeader>
              <CardContent>
                <Dialog open={isNewMaintenanceDialogOpen} onOpenChange={setIsNewMaintenanceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-secondary hover:bg-teal-700">
                      <i className="fas fa-tools mr-2"></i>
                      Log New Maintenance
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Log Maintenance Activity</DialogTitle>
                    </DialogHeader>
                    <MaintenanceForm
                      devices={devices || []}
                      onSubmit={handleCreateMaintenance}
                      isLoading={createMaintenanceMutation.isPending}
                    />
                  </DialogContent>
                </Dialog>
                
                <div className="mt-6 space-y-4">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">Maintenance Types:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Preventive - Regular scheduled maintenance</li>
                      <li>• Repair - Fix broken or malfunctioning equipment</li>
                      <li>• Calibration - Adjust equipment precision</li>
                      <li>• Inspection - Safety and compliance checks</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Maintenance History */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Maintenance History</CardTitle>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredMaintenance.length > 0 ? (
                    <div className="space-y-4">
                      {filteredMaintenance.map((maintenance: any) => (
                        <div key={maintenance.maintenanceId} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
                                <i className="fas fa-tools text-error"></i>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{maintenance.deviceName}</h4>
                                <p className="text-sm text-gray-600">
                                  {maintenance.maintenanceType} • {maintenance.technicianName}
                                </p>
                                {maintenance.description && (
                                  <p className="text-xs text-gray-500 mt-1">{maintenance.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <StatusBadge status={maintenance.status} />
                              <p className="text-sm text-gray-500 mt-1">
                                {maintenance.startDate}
                                {maintenance.cost && ` • $${maintenance.cost}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-tools text-gray-400 text-2xl"></i>
                      </div>
                      <p className="text-gray-600">No maintenance records found</p>
                      <p className="text-sm text-gray-500 mt-1">Log your first maintenance activity to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

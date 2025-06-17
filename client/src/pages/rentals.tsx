import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import StatusBadge from "@/components/ui/status-badge";
import RentalForm from "@/components/rentals/rental-form";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Rentals() {
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [isNewRentalDialogOpen, setIsNewRentalDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: activeRentals, isLoading } = useQuery({
    queryKey: ["/api/reports/currently-rented"],
  });

  const { data: departments } = useQuery({
    queryKey: ["/api/departments"],
  });

  const { data: devices } = useQuery({
    queryKey: ["/api/devices", "Available"],
  });

  const { data: staff } = useQuery({
    queryKey: ["/api/staff"],
  });

  const createRentalMutation = useMutation({
    mutationFn: async (rentalData: any) => {
      await apiRequest("POST", "/api/rentals", rentalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports/currently-rented"] });
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      toast({
        title: "Success",
        description: "Rental request submitted successfully",
      });
      setIsNewRentalDialogOpen(false);
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

  const returnRentalMutation = useMutation({
    mutationFn: async (rentalId: number) => {
      await apiRequest("POST", `/api/rentals/${rentalId}/return`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports/currently-rented"] });
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      toast({
        title: "Success",
        description: "Equipment returned successfully",
      });
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

  const filteredRentals = activeRentals?.filter((rental: any) => {
    return departmentFilter === "all" || rental.departmentName === departmentFilter;
  }) || [];

  const handleCreateRental = (rentalData: any) => {
    createRentalMutation.mutate(rentalData);
  };

  const handleReturnRental = (rentalId: number) => {
    returnRentalMutation.mutate(rentalId);
  };

  const isOverdue = (endDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    return endDate < today;
  };

  const isDueToday = (endDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    return endDate === today;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <div className="ml-64 flex-1">
          <Header title="Rental Management" description="Handle equipment rentals and returns" />
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
        <Header title="Rental Management" description="Handle equipment rentals and returns" />
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* New Rental Form */}
            <Card>
              <CardHeader>
                <CardTitle>New Rental Request</CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog open={isNewRentalDialogOpen} onOpenChange={setIsNewRentalDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-primary hover:bg-blue-700">
                      <i className="fas fa-plus mr-2"></i>
                      Create Rental Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>New Rental Request</DialogTitle>
                    </DialogHeader>
                    <RentalForm
                      devices={devices || []}
                      departments={departments || []}
                      staff={staff || []}
                      onSubmit={handleCreateRental}
                      isLoading={createRentalMutation.isPending}
                    />
                  </DialogContent>
                </Dialog>
                
                <div className="mt-6 space-y-4">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">Rental Guidelines:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Equipment must be available</li>
                      <li>• No overlapping rentals allowed</li>
                      <li>• Maximum rental period: 30 days</li>
                      <li>• Return equipment on time</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Rentals */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Active Rentals</CardTitle>
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger className="w-48">
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
                </CardHeader>
                <CardContent>
                  {filteredRentals.length > 0 ? (
                    <div className="space-y-4">
                      {filteredRentals.map((rental: any) => (
                        <div key={rental.rentalId} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <i className="fas fa-medical-bag text-primary"></i>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{rental.deviceName}</h4>
                                <p className="text-sm text-gray-600">
                                  {rental.departmentName} • {rental.staffName}
                                </p>
                                {rental.purpose && (
                                  <p className="text-xs text-gray-500 mt-1">{rental.purpose}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-2 mb-2">
                                {isOverdue(rental.rentEndDate) ? (
                                  <StatusBadge status="overdue" />
                                ) : isDueToday(rental.rentEndDate) ? (
                                  <StatusBadge status="due today" />
                                ) : (
                                  <StatusBadge status="active" />
                                )}
                                <Button 
                                  size="sm" 
                                  className="bg-success hover:bg-green-600"
                                  onClick={() => handleReturnRental(rental.rentalId)}
                                  disabled={returnRentalMutation.isPending}
                                >
                                  {returnRentalMutation.isPending ? (
                                    <i className="fas fa-spinner fa-spin"></i>
                                  ) : (
                                    "Return"
                                  )}
                                </Button>
                              </div>
                              <p className="text-sm text-gray-500">
                                {rental.rentStartDate} - {rental.rentEndDate}
                              </p>
                            </div>
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
                      <p className="text-sm text-gray-500 mt-1">Create a new rental request to get started</p>
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

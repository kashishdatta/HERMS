import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import StatusBadge from "@/components/ui/status-badge";
import EquipmentForm from "@/components/equipment/equipment-form";
import { apiRequest } from "@/lib/queryClient";
import type { Device } from "@shared/schema";

export default function Equipment() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: devices, isLoading } = useQuery({
    queryKey: ["/api/devices"],
  });

  const addDeviceMutation = useMutation({
    mutationFn: async (deviceData: any) => {
      await apiRequest("POST", "/api/devices", deviceData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      toast({
        title: "Success",
        description: "Equipment added successfully",
      });
      setIsAddDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredDevices = devices?.filter((device: Device) => {
    const matchesStatus = statusFilter === "all" || device.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === "all" || device.deviceType.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesSearch = device.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  }) || [];

  const handleAddDevice = (deviceData: any) => {
    addDeviceMutation.mutate(deviceData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <div className="ml-64 flex-1">
          <Header title="Equipment Management" description="Manage and track all medical equipment" />
          <div className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-32 bg-gray-200 rounded-xl"></div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
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
        <Header title="Equipment Management" description="Manage and track all medical equipment" />
        
        <div className="p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Equipment Inventory</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Manage and track all medical equipment</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Input
                    placeholder="Search equipment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-80"
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="under maintenance">Under Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="diagnostic">Diagnostic</SelectItem>
                      <SelectItem value="therapeutic">Therapeutic</SelectItem>
                      <SelectItem value="monitoring">Monitoring</SelectItem>
                      <SelectItem value="respiratory">Respiratory</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-blue-700">
                        <i className="fas fa-plus mr-2"></i>
                        Add Equipment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Equipment</DialogTitle>
                      </DialogHeader>
                      <EquipmentForm 
                        onSubmit={handleAddDevice}
                        isLoading={addDeviceMutation.isPending}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevices.length > 0 ? (
                    filteredDevices.map((device: Device) => (
                      <TableRow key={device.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <i className="fas fa-medical-bag text-primary"></i>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{device.deviceName}</div>
                              <div className="text-sm text-gray-500">ID: {device.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{device.deviceType}</div>
                          {device.model && (
                            <div className="text-sm text-gray-500">{device.model}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={device.status} />
                        </TableCell>
                        <TableCell>{device.currentLocation || "Not specified"}</TableCell>
                        <TableCell>{device.manufacturer || "Not specified"}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <i className="fas fa-eye"></i>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <i className="fas fa-edit"></i>
                            </Button>
                            {device.status === "Available" && (
                              <Button variant="ghost" size="sm" className="text-warning">
                                <i className="fas fa-calendar-plus"></i>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="fas fa-medical-bag text-gray-400 text-2xl"></i>
                        </div>
                        <p className="text-gray-600">No equipment found</p>
                        <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search terms</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

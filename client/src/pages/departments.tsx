import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertDepartmentSchema, insertStaffSchema } from "@shared/schema";
import type { Department, Staff } from "@shared/schema";

export default function Departments() {
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: departments, isLoading: departmentsLoading } = useQuery({
    queryKey: ["/api/departments"],
  });

  const { data: staff, isLoading: staffLoading } = useQuery({
    queryKey: ["/api/staff"],
  });

  const departmentForm = useForm({
    resolver: zodResolver(insertDepartmentSchema),
    defaultValues: {
      name: "",
      location: "",
      phone: "",
      contactPerson: "",
    },
  });

  const staffForm = useForm({
    resolver: zodResolver(insertStaffSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      role: "",
      email: "",
      contact: "",
      departmentId: undefined,
    },
  });

  const createDepartmentMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/departments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/departments"] });
      toast({
        title: "Success",
        description: "Department created successfully",
      });
      setIsDepartmentDialogOpen(false);
      departmentForm.reset();
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

  const createStaffMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/staff", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      toast({
        title: "Success",
        description: "Staff member added successfully",
      });
      setIsStaffDialogOpen(false);
      staffForm.reset();
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

  const filteredStaff = staff?.filter((member: Staff) => {
    if (departmentFilter === "all") return true;
    const department = departments?.find((d: Department) => d.id === member.departmentId);
    return department?.name === departmentFilter;
  }) || [];

  const getStaffCountForDepartment = (departmentId: number) => {
    return staff?.filter((member: Staff) => member.departmentId === departmentId).length || 0;
  };

  const getDepartmentName = (departmentId: number | null) => {
    if (!departmentId) return "No Department";
    const department = departments?.find((d: Department) => d.id === departmentId);
    return department?.name || "Unknown";
  };

  const onSubmitDepartment = (data: any) => {
    createDepartmentMutation.mutate(data);
  };

  const onSubmitStaff = (data: any) => {
    createStaffMutation.mutate(data);
  };

  if (departmentsLoading || staffLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <div className="ml-64 flex-1">
          <Header title="Department Management" description="Manage departments and staff" />
          <div className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="h-96 bg-gray-200 rounded-xl"></div>
                <div className="h-96 bg-gray-200 rounded-xl"></div>
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
        <Header title="Department Management" description="Manage departments and staff" />
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Departments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Departments</CardTitle>
                  <Dialog open={isDepartmentDialogOpen} onOpenChange={setIsDepartmentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-blue-700 text-sm">
                        <i className="fas fa-plus mr-2"></i>
                        Add Department
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Department</DialogTitle>
                      </DialogHeader>
                      <Form {...departmentForm}>
                        <form onSubmit={departmentForm.handleSubmit(onSubmitDepartment)} className="space-y-4">
                          <FormField
                            control={departmentForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Department Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter department name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={departmentForm.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                  <Input placeholder="Building, Floor, Room" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={departmentForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                  <Input placeholder="Department phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={departmentForm.control}
                            name="contactPerson"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Person</FormLabel>
                                <FormControl>
                                  <Input placeholder="Department head or contact" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-blue-700"
                            disabled={createDepartmentMutation.isPending}
                          >
                            {createDepartmentMutation.isPending ? (
                              <i className="fas fa-spinner fa-spin mr-2"></i>
                            ) : (
                              <i className="fas fa-plus mr-2"></i>
                            )}
                            Add Department
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {departments && departments.length > 0 ? (
                  <div className="space-y-4">
                    {departments.map((department: Department) => (
                      <div key={department.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{department.name}</h4>
                            {department.location && (
                              <p className="text-sm text-gray-600">
                                <i className="fas fa-map-marker-alt mr-1"></i>
                                {department.location}
                              </p>
                            )}
                            {department.contactPerson && (
                              <p className="text-sm text-gray-500 mt-1">
                                Contact: {department.contactPerson}
                              </p>
                            )}
                            {department.phone && (
                              <p className="text-sm text-gray-500">
                                Phone: {department.phone}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {getStaffCountForDepartment(department.id)}
                            </div>
                            <div className="text-sm text-gray-500">Staff Members</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-building text-gray-400 text-2xl"></i>
                    </div>
                    <p className="text-gray-600">No departments found</p>
                    <p className="text-sm text-gray-500 mt-1">Add your first department to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Staff */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Staff Members</CardTitle>
                  <div className="flex items-center space-x-3">
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments?.map((dept: Department) => (
                          <SelectItem key={dept.id} value={dept.name}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Dialog open={isStaffDialogOpen} onOpenChange={setIsStaffDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-blue-700 text-sm">
                          <i className="fas fa-plus mr-2"></i>
                          Add Staff
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Staff Member</DialogTitle>
                        </DialogHeader>
                        <Form {...staffForm}>
                          <form onSubmit={staffForm.handleSubmit(onSubmitStaff)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={staffForm.control}
                                name="firstName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter first name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={staffForm.control}
                                name="lastName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter last name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={staffForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="Enter email address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={staffForm.control}
                                name="role"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="Staff">Staff</SelectItem>
                                        <SelectItem value="Technician">Technician</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={staffForm.control}
                                name="departmentId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Department</FormLabel>
                                    <Select 
                                      onValueChange={(value) => field.onChange(parseInt(value))} 
                                      defaultValue={field.value?.toString()}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {departments?.map((dept: Department) => (
                                          <SelectItem key={dept.id} value={dept.id.toString()}>
                                            {dept.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={staffForm.control}
                              name="contact"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Contact Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter contact number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="submit"
                              className="w-full bg-primary hover:bg-blue-700"
                              disabled={createStaffMutation.isPending}
                            >
                              {createStaffMutation.isPending ? (
                                <i className="fas fa-spinner fa-spin mr-2"></i>
                              ) : (
                                <i className="fas fa-plus mr-2"></i>
                              )}
                              Add Staff Member
                            </Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredStaff.length > 0 ? (
                  <div className="space-y-4">
                    {filteredStaff.map((member: Staff) => (
                      <div key={member.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <i className="fas fa-user text-gray-600"></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {member.firstName} {member.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {member.role} • {getDepartmentName(member.departmentId)}
                            </p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={member.role === 'Technician' ? 'secondary' : 'outline'}
                            className={member.role === 'Technician' ? 'bg-secondary/10 text-secondary' : ''}
                          >
                            {member.role}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <i className="fas fa-edit"></i>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-users text-gray-400 text-2xl"></i>
                    </div>
                    <p className="text-gray-600">No staff members found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {departmentFilter === "all" 
                        ? "Add your first staff member to get started"
                        : "No staff members in selected department"
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

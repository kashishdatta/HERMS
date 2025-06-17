import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Equipment from "@/pages/equipment";
import Rentals from "@/pages/rentals";
import Maintenance from "@/pages/maintenance";
import Departments from "@/pages/departments";
import Reports from "@/pages/reports";
import NotFound from "@/pages/not-found";

type UserRole = 'Staff' | 'Technician' | null;

function Router() {
  const [userRole, setUserRole] = useState<UserRole>(null);

  const handleRoleSelect = (role: 'Staff' | 'Technician') => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  if (!userRole) {
    return <Login onRoleSelect={handleRoleSelect} />;
  }

  return (
    <Switch>
      <Route path="/" component={() => <Dashboard userRole={userRole} onLogout={handleLogout} />} />
      <Route path="/equipment" component={() => <Equipment userRole={userRole} onLogout={handleLogout} />} />
      <Route path="/rentals" component={() => <Rentals userRole={userRole} onLogout={handleLogout} />} />
      {userRole === 'Technician' && (
        <Route path="/maintenance" component={() => <Maintenance userRole={userRole} onLogout={handleLogout} />} />
      )}
      <Route path="/departments" component={() => <Departments userRole={userRole} onLogout={handleLogout} />} />
      <Route path="/reports" component={() => <Reports userRole={userRole} onLogout={handleLogout} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

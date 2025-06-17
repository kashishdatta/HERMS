import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  userRole: 'Staff' | 'Technician';
  onLogout: () => void;
}

export default function Sidebar({ userRole, onLogout }: SidebarProps) {
  const [location] = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: "fas fa-tachometer-alt",
      current: location === "/",
    },
    {
      name: "Equipment",
      href: "/equipment",
      icon: "fas fa-medical-bag",
      current: location === "/equipment",
    },
    {
      name: "Rentals",
      href: "/rentals",
      icon: "fas fa-calendar-alt",
      current: location === "/rentals",
    },
    {
      name: "Maintenance",
      href: "/maintenance",
      icon: "fas fa-tools",
      current: location === "/maintenance",
      requiresTechnician: true,
    },
    {
      name: "Departments",
      href: "/departments",
      icon: "fas fa-building",
      current: location === "/departments",
    },
    {
      name: "Reports",
      href: "/reports",
      icon: "fas fa-chart-bar",
      current: location === "/reports",
    },
  ];

  const isTechnician = userRole === 'Technician';

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg border-r border-gray-200 z-30">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <i className="fas fa-hospital text-white"></i>
          </div>
          <div className="ml-3">
            <h1 className="font-bold text-gray-900">HERMS</h1>
            <p className="text-xs text-gray-500">Equipment Management</p>
          </div>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <i className="fas fa-user text-gray-600"></i>
              )}
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-900">
                {user?.firstName || user?.lastName 
                  ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                  : user?.email?.split('@')[0] || 'User'
                }
              </p>
              <p className="text-sm text-gray-600">
                <span className="capitalize">
                  {user?.staff?.role || 'Staff'}
                </span>
                {user?.staff?.departmentId && (
                  <span> • Department</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigation.map((item) => {
            // Hide maintenance if user is not a technician
            if (item.requiresTechnician && !isTechnician) {
              return null;
            }

            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                    item.current
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <i className={`${item.icon} w-5`}></i>
                  <span className="ml-3">{item.name}</span>
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 space-y-2">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-gray-100"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

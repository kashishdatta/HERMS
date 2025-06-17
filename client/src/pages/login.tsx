import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LoginProps {
  onRoleSelect: (role: 'Staff' | 'Technician') => void;
}

export default function Login({ onRoleSelect }: LoginProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-hospital text-white text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">HERMS</h1>
            <p className="text-gray-600 mt-2">Healthcare Equipment Rental & Maintenance System</p>
          </div>
          
          <div className="space-y-4">
            <p className="text-center text-gray-700 font-medium">Select Your Role</p>
            
            <Button 
              onClick={() => onRoleSelect('Staff')}
              className="w-full bg-primary hover:bg-blue-700 text-white py-4 rounded-lg font-medium transition-colors"
            >
              <i className="fas fa-user-md mr-3"></i>
              Staff Member
            </Button>
            
            <Button 
              onClick={() => onRoleSelect('Technician')}
              className="w-full bg-secondary hover:bg-teal-700 text-white py-4 rounded-lg font-medium transition-colors"
            >
              <i className="fas fa-tools mr-3"></i>
              Technician
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Welcome to HERMS</p>
            <div className="mt-2 text-xs text-gray-500">
              <p>Secure healthcare equipment management system</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

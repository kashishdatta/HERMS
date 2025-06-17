import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Login() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

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
          
          <Button 
            onClick={handleLogin}
            className="w-full bg-primary hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Sign In with Replit
          </Button>
          
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

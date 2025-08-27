import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Users, Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { LoginCredentials } from "@/types/auth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState<'organizer' | 'participant'>('participant');
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    role: 'participant'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || (selectedRole === 'organizer' ? '/organizer' : '/');

  const handleRoleSelect = (role: 'organizer' | 'participant') => {
    setSelectedRole(role);
    setCredentials(prev => ({ ...prev, role }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(credentials);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid credentials. Please check your email and password.');
    }
  };

  const demoCredentials = {
    organizer: { email: 'admin@aegiscare.com', password: 'admin123' },
    participant: { email: 'riya@student.edu', password: 'student123' }
  };

  const fillDemoCredentials = () => {
    const demo = demoCredentials[selectedRole];
    setCredentials(prev => ({
      ...prev,
      email: demo.email,
      password: demo.password
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Building2 className="h-12 w-12 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AegisCare Simulation</h1>
            <p className="text-muted-foreground">Sign in to continue</p>
          </div>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-3">
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedRole === 'organizer' 
                ? 'border-primary bg-primary/5 shadow-md' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => handleRoleSelect('organizer')}
          >
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Organizer</h3>
              <p className="text-xs text-muted-foreground">Full access & control</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedRole === 'participant' 
                ? 'border-primary bg-primary/5 shadow-md' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => handleRoleSelect('participant')}
          >
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Participant</h3>
              <p className="text-xs text-muted-foreground">Team member access</p>
            </CardContent>
          </Card>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedRole === 'organizer' ? <Shield className="h-5 w-5" /> : <Users className="h-5 w-5" />}
              {selectedRole === 'organizer' ? 'Organizer Login' : 'Participant Login'}
            </CardTitle>
            <CardDescription>
              {selectedRole === 'organizer' 
                ? 'Access simulation management and participant data'
                : 'Join your team and participate in the simulation'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={fillDemoCredentials}
                disabled={isLoading}
              >
                Use Demo Credentials
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <Card className="border-muted">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Demo Accounts
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <Badge variant="outline">Organizer</Badge>
                <span className="text-muted-foreground">admin@aegiscare.com / admin123</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">Participant</Badge>
                <span className="text-muted-foreground">riya@student.edu / student123</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import GlassCard from '@/components/ui/GlassCard';
import { toast } from '@/components/ui/use-toast';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, allow any login
      toast({
        title: "Logged in successfully",
        description: "Welcome back to FinanceIQ",
      });
      navigate('/dashboard');
      setLoading(false);
    }, 1000);
  };

  return (
    <GlassCard className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-lg bg-primary mx-auto flex items-center justify-center mb-4">
          <span className="text-lg font-bold text-primary-foreground">FI</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-muted-foreground mt-2">
          Enter your credentials to access your dashboard
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            className="transition-all duration-200"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a 
              href="#" 
              className="text-sm text-primary hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="transition-all duration-200"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="text-sm font-normal">Remember me</Label>
        </div>
        
        <Button
          type="submit"
          className="w-full transition-all duration-300"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Don't have an account?</span>{" "}
        <a 
          href="#" 
          className="text-primary hover:underline"
          onClick={(e) => {
            e.preventDefault();
            // For demo purposes, just navigate to dashboard
            navigate('/dashboard');
          }}
        >
          Sign up
        </a>
      </div>
    </GlassCard>
  );
};

export default LoginForm;

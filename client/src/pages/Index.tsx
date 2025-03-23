
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, ShieldCheck, LineChart, Zap } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import GlassCard from '@/components/ui/GlassCard';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16">
          <div className="max-w-xl mx-auto lg:mx-0 animate-fade-in">
            <div className="inline-flex items-center px-3 py-1 mb-6 text-sm rounded-full bg-primary/10 text-primary">
              <Zap size={14} className="mr-1" />
              <span>AI-Powered Investment Intelligence</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Smart investing for <span className="text-primary">retail investors</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              Leverage AI-powered insights to make informed investment decisions. Track your portfolio, analyze market trends, and receive personalized recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="gap-2"
                onClick={() => navigate('/dashboard')}
              >
                Try Dashboard
                <ArrowRight size={16} />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  const loginSection = document.getElementById('login-section');
                  loginSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-1/2 bg-muted/30 flex items-center justify-center p-8">
          <div className="relative w-full max-w-md aspect-video animate-float">
            <img 
              src="https://images.unsplash.com/photo-1642790551116-18e150f248e5?q=80&w=2940&auto=format&fit=crop"
              alt="Dashboard Preview" 
              className="rounded-lg shadow-xl object-cover"
            />
            <div className="absolute -bottom-6 -right-6">
              <img 
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2940&auto=format&fit=crop" 
                alt="Chart Detail" 
                className="h-32 w-32 rounded-lg shadow-lg border border-white/20 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Retail Investors</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered dashboard provides all the tools you need to make informed investment decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <GlassCard>
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Market Analysis</h3>
                <p className="text-muted-foreground">
                  Real-time market data and trend analysis to help you stay informed about market movements.
                </p>
              </div>
            </GlassCard>
            
            <GlassCard>
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Regulatory Compliance</h3>
                <p className="text-muted-foreground">
                  Stay compliant with investment regulations and tax requirements with automated tools.
                </p>
              </div>
            </GlassCard>
            
            <GlassCard>
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <LineChart size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Advisory</h3>
                <p className="text-muted-foreground">
                  Personalized investment recommendations based on your risk profile and financial goals.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
      
      {/* Login Section */}
      <div id="login-section" className="py-16 px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get Started Today</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sign in to your account or create a new one to access all features.
            </p>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Index;


import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Sun, Moon, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initializeAnimations } from "@/utils/animation";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Initialize animations when component mounts
  useEffect(() => {
    initializeAnimations();
  }, []);
  
  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'ml-[70px]' : 'ml-[240px]'
        }`}
      >
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center w-96">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-9 bg-muted/40 border-none h-9"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Bell size={18} />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto p-6 animate-fade-in">
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer className="py-4 px-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2024 FinanceIQ | AI-Powered Retail Investor Dashboard</p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;

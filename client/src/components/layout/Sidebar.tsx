
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  Home, 
  BarChart3, 
  Briefcase, 
  GanttChart, 
  Wallet, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  BellDot 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { userData } from "@/utils/mockData";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/portfolio', label: 'Portfolio', icon: <Briefcase size={20} /> },
    { path: '/market', label: 'Market', icon: <BarChart3 size={20} /> },
    { path: '/transactions', label: 'Transactions', icon: <Wallet size={20} /> },
    { path: '/analysis', label: 'Analysis', icon: <GanttChart size={20} /> },
    { path: '/reports', label: 'Reports', icon: <FileText size={20} /> },
  ];
  
  const bottomItems = [
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
    { path: '/', label: 'Logout', icon: <LogOut size={20} /> },
  ];
  
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname === path;
  };
  
  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-20 h-full flex flex-col bg-white dark:bg-gray-900 border-r border-border transition-all duration-300 ease-in-out shadow-sm",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-sm bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">GL</span>
            </div>
            <span className="font-semibold tracking-tight">Growlio</span>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto">
            <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">FI</span>
            </div>
          </div>
        )}
        {!collapsed && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(true)} 
            className="h-8 w-8"
          >
            <ChevronLeft size={16} />
          </Button>
        )}
      </div>
      
      {!collapsed && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
                   <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{userData.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{userData.email}</p>
            </div>
          </div>
        </div>
      )}
      
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "sidebar-item",
                  isActive(item.path) && "active",
                  collapsed && "justify-center px-2"
                )}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-2 border-t border-border">
        <ul className="space-y-1">
          {bottomItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "sidebar-item",
                  isActive(item.path) && "active",
                  collapsed && "justify-center px-2"
                )}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      {collapsed && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(false)} 
          className="mb-4 mx-auto h-8 w-8"
        >
          <ChevronRight size={16} />
        </Button>
      )}
    </aside>
  );
};

export default Sidebar;

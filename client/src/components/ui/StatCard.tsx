
import React from 'react';
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string | number;
  className?: string;
}

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  trendValue,
  className = "" 
}: StatCardProps) => {
  const renderTrend = () => {
    if (!trend || !trendValue) return null;
    
    const trendClasses = {
      up: "text-finance-green",
      down: "text-finance-red",
      neutral: "text-finance-neutral"
    };
    
    const trendIcons = {
      up: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z" clipRule="evenodd" />
        </svg>
      ),
      down: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-.997.33l-4.286-2.475a.75.75 0 01.75-1.3l2.685 1.55a19.385 19.385 0 00-3.585-6.534l-3.18 3.18a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 010-1.06z" clipRule="evenodd" />
        </svg>
      ),
      neutral: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" />
        </svg>
      )
    };
    
    return (
      <div className={`flex items-center gap-1 mt-1 ${trendClasses[trend]}`}>
        {trendIcons[trend]}
        <span>{trendValue}</span>
      </div>
    );
  };
  
  return (
    <div className={cn("stat-card group animate-scale-in", className)}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="mt-2 flex items-baseline space-x-2">
            <p className="text-2xl font-semibold tracking-tight transition-all duration-300 group-hover:scale-105 origin-left">
              {value}
            </p>
            {renderTrend()}
          </div>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-full bg-muted/50 text-muted-foreground group-hover:bg-muted transition-colors duration-300">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

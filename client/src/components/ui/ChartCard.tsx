
import React from 'react';
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
}

const ChartCard = ({ 
  title, 
  subtitle, 
  children, 
  className = "", 
  action,
  footer
}: ChartCardProps) => {
  return (
    <div className={cn("chart-card flex flex-col animate-scale-in", className)}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action && (
          <div className="ml-auto">{action}</div>
        )}
      </div>
      
      <div className="flex-grow">
        {children}
      </div>
      
      {footer && (
        <div className="mt-4 pt-3 border-t">
          {footer}
        </div>
      )}
    </div>
  );
};

export default ChartCard;

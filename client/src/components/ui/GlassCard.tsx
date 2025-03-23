
import React from 'react';
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard = ({ 
  children, 
  className = "",
  hoverEffect = true,
}: GlassCardProps) => {
  return (
    <div 
      className={cn(
        "glass-card p-6 animate-fade-in", 
        hoverEffect && "hover:-translate-y-1", 
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;

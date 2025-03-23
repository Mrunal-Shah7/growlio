
import React from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  Info, 
  TrendingUp, 
  Coins, 
  Sparkles 
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { Button } from '@/components/ui/button';
import { aiInsights } from '@/utils/mockData';

const AIAdvisor = () => {
  const [expanded, setExpanded] = React.useState<number | null>(null);
  
  const toggleExpand = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };
  
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'portfolio':
        return <Coins className="text-finance-blue h-5 w-5" />;
      case 'market':
        return <TrendingUp className="text-finance-purple h-5 w-5" />;
      case 'tax':
        return <AlertCircle className="text-finance-green h-5 w-5" />;
      case 'opportunity':
        return <Sparkles className="text-finance-neutral h-5 w-5" />;
      default:
        return <Info className="text-finance-blue h-5 w-5" />;
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-finance-red/10 text-finance-red';
      case 'medium':
        return 'bg-finance-blue/10 text-finance-blue';
      case 'low':
        return 'bg-finance-green/10 text-finance-green';
      default:
        return 'bg-finance-neutral/10 text-finance-neutral';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">AI Financial Advisor</h2>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {aiInsights.map((insight) => (
          <GlassCard 
            key={insight.id} 
            className={`overflow-hidden transition-all duration-300 ${
              expanded === insight.id ? 'max-h-96' : 'max-h-24'
            }`}
            hoverEffect={false}
          >
            <div 
              className="flex items-start cursor-pointer"
              onClick={() => toggleExpand(insight.id)}
            >
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 mr-4">
                {getInsightIcon(insight.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-base">{insight.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(insight.priority)}`}>
                    {insight.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {insight.description}
                </p>
              </div>
              
              <div className="flex items-center ml-4">
                <span className="text-xs text-muted-foreground mr-2">
                  {insight.timestamp}
                </span>
                {expanded === insight.id ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
            
            {expanded === insight.id && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm mb-4">
                  {insight.description}
                </p>
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm">Dismiss</Button>
                  <Button size="sm">Take Action</Button>
                </div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default AIAdvisor;

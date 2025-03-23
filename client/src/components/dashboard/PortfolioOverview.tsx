
import React from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Briefcase, DollarSign, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import ChartCard from '../ui/ChartCard';
import StatCard from '../ui/StatCard';
import { portfolioData } from '@/utils/mockData';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const PortfolioOverview = () => {
  const formatPerformanceDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short' });
  };
  
  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-border">
          <p className="font-medium">{formatCurrency(payload[0].value)}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(payload[0].payload.date).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Portfolio Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Portfolio Value"
          value={formatCurrency(portfolioData.totalValue)}
          icon={<Briefcase size={18} />}
        />
        
        <StatCard
          title="Today's Change"
          value={formatCurrency(portfolioData.change)}
          trend={portfolioData.change >= 0 ? 'up' : 'down'}
          trendValue={`${portfolioData.changePercent.toFixed(2)}%`}
          icon={portfolioData.change >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
        />
        
        <StatCard
          title="Annual Returns"
          value="12.8%"
          trend="up"
          trendValue="+2.5%"
          icon={<TrendingUp size={18} />}
          description="YTD Performance"
        />
        
        <StatCard
          title="Cash Balance"
          value={formatCurrency(portfolioData.allocation[3].value)}
          description="Available to invest"
          icon={<DollarSign size={18} />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard 
          title="Portfolio Performance" 
          subtitle="12-month history"
          className="lg:col-span-2"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={portfolioData.performance}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatPerformanceDate}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                  dx={-10}
                />
                <Tooltip content={renderCustomTooltip} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        
        <ChartCard 
          title="Asset Allocation" 
          subtitle="Current distribution"
        >
          <div className="h-72 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="70%">
              <PieChart>
                <Pie
                  data={portfolioData.allocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {portfolioData.allocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={() => ''}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2">
              {portfolioData.allocation.map((item) => (
                <div key={item.category} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="text-sm">
                    <span className="text-xs font-medium">{item.category}</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default PortfolioOverview;

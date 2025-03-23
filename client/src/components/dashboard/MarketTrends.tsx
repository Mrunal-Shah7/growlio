
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import ChartCard from '../ui/ChartCard';
import StatCard from '../ui/StatCard';
import { marketIndices, economicData } from '@/utils/mockData';

const MarketTrends = () => {
  const renderMarketTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-border">
          <p className="font-medium">{payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Market Trends</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketIndices.map((index) => (
          <StatCard
            key={index.name}
            title={index.name}
            value={index.value.toLocaleString()}
            trend={index.change >= 0 ? 'up' : 'down'}
            trendValue={`${index.change.toFixed(2)}%`}
            icon={index.change >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="Market Indices" 
          subtitle="Last 7 days performance"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                {marketIndices.map((index, idx) => (
                  <Line 
                    key={index.name}
                    data={index.data.map((value, i) => ({ value, index: i }))}
                    type="monotone"
                    dataKey="value"
                    name={index.name}
                    stroke={getIndexColor(idx)}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                ))}
                <XAxis 
                  dataKey="index"
                  axisLine={false}
                  tickLine={false}
                  tick={false}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  dx={-10}
                />
                <Tooltip content={renderMarketTooltip} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            {marketIndices.map((index, idx) => (
              <div key={index.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getIndexColor(idx) }}
                />
                <span className="text-xs font-medium">{index.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>
        
        <ChartCard
          title="Economic Indicators"
          subtitle="Current values vs previous period"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={economicData.map(item => ({
                  name: item.metric,
                  current: parseFloat(item.value.replace('%', '')),
                  previous: parseFloat(item.previousValue.replace('%', '')),
                }))}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                layout="vertical"
              >
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  domain={[0, 'dataMax + 1']}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  width={100}
                />
                <Tooltip
                  formatter={(value: number) => `${value}%`}
                />
                <Bar
                  dataKey="previous"
                  fill="#94A3B8"
                  radius={[0, 0, 0, 0]}
                  barSize={10}
                />
                <Bar
                  dataKey="current"
                  fill="#0EA5E9"
                  radius={[0, 4, 4, 0]}
                  barSize={10}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#0EA5E9]" />
              <span className="text-xs font-medium">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#94A3B8]" />
              <span className="text-xs font-medium">Previous</span>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

function getIndexColor(index: number) {
  const colors = ['#0EA5E9', '#8B5CF6', '#0CAF82', '#64748B'];
  return colors[index % colors.length];
}

export default MarketTrends;

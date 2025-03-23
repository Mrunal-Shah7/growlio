
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  ReferenceLine 
} from 'recharts';
import { Button } from '@/components/ui/button';
import ChartCard from '../ui/ChartCard';
import { holdingsData } from '@/utils/mockData';

const StockChart = () => {
  const [activeStock, setActiveStock] = useState(holdingsData[0].symbol);
  const [timeRange, setTimeRange] = useState('1M');
  
  const stock = holdingsData.find(s => s.symbol === activeStock) || holdingsData[0];
  
  // Generate more detailed data for the active stock
  const generateDetailedData = () => {
    const basePrice = stock.performance[0];
    const volatility = 0.05;
    const points = 30; // 30 days of data
    
    const generatedData: Array<{date: string, price: number}> = [];
    
    for (let i = 0; i < points; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (points - i - 1));
      
      // Create realistic looking price movements
      const changePercent = (Math.random() - 0.5) * volatility;
      const prevPrice = i === 0 ? basePrice : generatedData[i-1].price;
      const price = prevPrice * (1 + changePercent);
      
      generatedData.push({
        date: date.toISOString().split('T')[0],
        price: parseFloat(price.toFixed(2)),
      });
    }
    
    return generatedData;
  };
  
  const detailedData = generateDetailedData();
  
  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-border">
          <p className="font-medium">${payload[0].value.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      );
    }
    return null;
  };
  
  const renderTimeRangeButtons = () => {
    const ranges = ['1D', '1W', '1M', '3M', '1Y', 'All'];
    
    return (
      <div className="flex space-x-1">
        {ranges.map(range => (
          <Button
            key={range}
            variant={timeRange === range ? "default" : "outline"}
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setTimeRange(range)}
          >
            {range}
          </Button>
        ))}
      </div>
    );
  };
  
  return (
    <ChartCard
      title="Stock Performance"
      subtitle={`${stock.name} (${stock.symbol})`}
      action={renderTimeRangeButtons()}
    >
      <div className="h-72 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={detailedData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                });
              }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              domain={['dataMin - 5', 'dataMax + 5']}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={renderCustomTooltip} />
            <ReferenceLine
              y={stock.performance[0]}
              stroke="#94A3B8"
              strokeDasharray="3 3"
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={stock.price > stock.performance[0] ? "#0CAF82" : "#E54D2E"}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-2">
        {holdingsData.map((item) => (
          <Button
            key={item.symbol}
            variant={activeStock === item.symbol ? "default" : "outline"}
            size="sm"
            className={`text-xs justify-start ${
              activeStock === item.symbol 
                ? ''
                : 'hover:bg-muted'
            }`}
            onClick={() => setActiveStock(item.symbol)}
          >
            <div className="flex flex-col items-start">
              <span>{item.symbol}</span>
              <span className={`text-xs ${
                item.change >= 0 ? 'text-finance-green' : 'text-finance-red'
              }`}>
                {item.change >= 0 ? '+' : ''}{item.change}%
              </span>
            </div>
          </Button>
        ))}
      </div>
    </ChartCard>
  );
};

export default StockChart;

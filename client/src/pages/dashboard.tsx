
import React from 'react';
import PortfolioOverview from '@/components/dashboard/PortfolioOverview';
import MarketTrends from '@/components/dashboard/MarketTrends';
import AIAdvisor from '@/components/dashboard/AIAdvisor';
import StockChart from '@/components/dashboard/StockChart';

const Dashboard = () => {
  return (
    <div className="space-y-10">
      <PortfolioOverview />
      <MarketTrends />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockChart />
        <AIAdvisor />
      </div>
    </div>
  );
};

export default Dashboard;

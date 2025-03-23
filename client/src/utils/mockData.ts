
// Mock data for the investor dashboard

// Portfolio data
export const portfolioData = {
  totalValue: 248652.37,
  change: 3245.89,
  changePercent: 1.32,
  allocation: [
    { category: 'Stocks', value: 145287.21, percentage: 58.43, color: '#0EA5E9' },
    { category: 'Bonds', value: 52830.45, percentage: 21.25, color: '#8B5CF6' },
    { category: 'ETFs', value: 32875.63, percentage: 13.22, color: '#0CAF82' },
    { category: 'Cash', value: 17659.08, percentage: 7.10, color: '#64748B' },
  ],
  performance: [
    { date: '2023-01-01', value: 220000 },
    { date: '2023-02-01', value: 225000 },
    { date: '2023-03-01', value: 223000 },
    { date: '2023-04-01', value: 227000 },
    { date: '2023-05-01', value: 232000 },
    { date: '2023-06-01', value: 228000 },
    { date: '2023-07-01', value: 235000 },
    { date: '2023-08-01', value: 240000 },
    { date: '2023-09-01', value: 237000 },
    { date: '2023-10-01', value: 244000 },
    { date: '2023-11-01', value: 242000 },
    { date: '2023-12-01', value: 245000 },
    { date: '2024-01-01', value: 248652.37 },
  ],
};

// Holdings data
export const holdingsData = [
  { 
    symbol: 'AAPL', 
    name: 'Apple Inc.', 
    shares: 150, 
    price: 182.52, 
    value: 27378, 
    change: 2.34, 
    performance: [170, 175, 172, 177, 180, 182.52],
    color: '#0EA5E9'
  },
  { 
    symbol: 'MSFT', 
    name: 'Microsoft Corp.', 
    shares: 85, 
    price: 328.79, 
    value: 27947.15, 
    change: 1.12, 
    performance: [310, 318, 315, 320, 325, 328.79],
    color: '#8B5CF6'
  },
  { 
    symbol: 'GOOGL', 
    name: 'Alphabet Inc.', 
    shares: 45, 
    price: 142.56, 
    value: 6415.20, 
    change: -0.78, 
    performance: [145, 143, 140, 139, 141, 142.56],
    color: '#0CAF82'
  },
  { 
    symbol: 'AMZN', 
    name: 'Amazon.com Inc.', 
    shares: 60, 
    price: 178.35, 
    value: 10701, 
    change: 0.45, 
    performance: [170, 172, 175, 177, 176, 178.35],
    color: '#64748B'
  },
  { 
    symbol: 'TSLA', 
    name: 'Tesla Inc.', 
    shares: 120, 
    price: 250.22, 
    value: 30026.40, 
    change: 3.67, 
    performance: [230, 235, 240, 245, 248, 250.22],
    color: '#E54D2E'
  },
];

// Market data
export const marketIndices = [
  { 
    name: 'S&P 500', 
    value: 4783.45, 
    change: 0.67, 
    data: [4700, 4720, 4735, 4750, 4765, 4783.45] 
  },
  { 
    name: 'NASDAQ', 
    value: 16741.20, 
    change: 1.24, 
    data: [16500, 16550, 16600, 16650, 16700, 16741.20] 
  },
  { 
    name: 'DOW JONES', 
    value: 37802.56, 
    change: 0.38, 
    data: [37600, 37650, 37700, 37750, 37780, 37802.56] 
  },
  { 
    name: 'RUSSELL 2000', 
    value: 2022.38, 
    change: -0.15, 
    data: [2030, 2028, 2025, 2023, 2020, 2022.38] 
  },
];

// AI insights
export const aiInsights = [
  {
    id: 1,
    type: 'portfolio',
    title: 'Portfolio Diversification Needed',
    description: 'Your portfolio is heavily weighted towards technology stocks. Consider diversifying into other sectors to reduce risk.',
    timestamp: '2 hours ago',
    priority: 'high',
  },
  {
    id: 2,
    type: 'market',
    title: 'Market Volatility Expected',
    description: 'Recent economic indicators suggest increased market volatility in the coming weeks. Review your risk exposure.',
    timestamp: '1 day ago',
    priority: 'medium',
  },
  {
    id: 3,
    type: 'tax',
    title: 'Tax-Loss Harvesting Opportunity',
    description: 'Some of your holdings have unrealized losses. Consider tax-loss harvesting to offset capital gains.',
    timestamp: '3 days ago',
    priority: 'medium',
  },
  {
    id: 4,
    type: 'opportunity',
    title: 'Dividend Increase Announced',
    description: 'Microsoft has announced a 10% increase in quarterly dividends. This may benefit your long-term income strategy.',
    timestamp: '5 days ago',
    priority: 'low',
  },
];

// Economic data
export const economicData = [
  { 
    metric: 'Inflation Rate', 
    value: '3.4%', 
    previousValue: '3.7%', 
    change: -0.3,
    forecast: '3.2%'
  },
  { 
    metric: 'Unemployment Rate', 
    value: '3.7%', 
    previousValue: '3.8%', 
    change: -0.1,
    forecast: '3.7%'
  },
  { 
    metric: 'GDP Growth', 
    value: '2.1%', 
    previousValue: '2.3%', 
    change: -0.2,
    forecast: '2.2%'
  },
  { 
    metric: 'Fed Interest Rate', 
    value: '5.5%', 
    previousValue: '5.5%', 
    change: 0,
    forecast: '5.25%'
  },
];

// News data
export const newsData = [
  {
    id: 1,
    title: 'Fed Signals Potential Rate Cuts in Coming Months',
    source: 'Financial Times',
    timestamp: '2 hours ago',
    category: 'Monetary Policy',
    summary: 'Federal Reserve officials indicated that interest rate cuts could begin as early as March if inflation continues to ease.',
    url: '#'
  },
  {
    id: 2,
    title: 'Apple Announces New AI Features for Upcoming Devices',
    source: 'Tech Insider',
    timestamp: '5 hours ago',
    category: 'Technology',
    summary: 'Apple revealed plans to introduce advanced AI capabilities in its next generation of devices, potentially boosting its competitive position.',
    url: '#'
  },
  {
    id: 3,
    title: 'Oil Prices Surge Amid Middle East Tensions',
    source: 'Reuters',
    timestamp: '1 day ago',
    category: 'Commodities',
    summary: 'Crude oil prices jumped 3% following reports of escalating geopolitical tensions in the Middle East, raising concerns about supply disruptions.',
    url: '#'
  },
  {
    id: 4,
    title: 'Housing Market Shows Signs of Recovery',
    source: 'Bloomberg',
    timestamp: '1 day ago',
    category: 'Real Estate',
    summary: 'New home sales increased for the third consecutive month, suggesting a potential recovery in the housing market despite high mortgage rates.',
    url: '#'
  },
];

// User data for personalization
export const userData = {
  name: 'Mrunal Shah',
  email: 'shahmrunal777@gmail.com',
  joinDate: '2023-03-15',
  profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
  riskTolerance: 'Moderate',
  investmentGoals: ['Retirement', 'Capital Growth'],
  taxBracket: '24%',
  preferences: {
    theme: 'light',
    notifications: true,
    frequency: 'daily',
  }
};

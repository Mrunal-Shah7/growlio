import express from 'express';
import kiteRouter from './api/kite';
import { getStockPredictions } from './api/aiModel';
import { calculateSharpeRatio } from './utils/metrics';

const app = express();
app.use(express.json());
app.use('/kite', kiteRouter);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.post('/predict', async (req, res) => {
  const portfolio = req.body.portfolio;
  const predictedStocks = await getStockPredictions(portfolio);
  const returns = predictedStocks.map(() => Math.random() * 0.1 - 0.05); // Mock returns
  const sharpeRatio = calculateSharpeRatio({ returns, riskFreeRate: 0.02 });
  res.json({ predictedStocks, sharpeRatio });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
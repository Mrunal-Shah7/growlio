import axios from 'axios';

async function getStockPredictions(portfolio: any[]): Promise<string[]> {
  const payload = {
    inputs: portfolio.map(stock => ({
      symbol: stock.tradingsymbol,
      quantity: stock.quantity,
      avg_price: stock.average_price,
    })),
  };

  // Using a mock response for now; replace with real API
  const response = await axios.post(
    'https://api-inference.huggingface.co/models/your-model', // Replace with actual model URL
    payload,
    { headers: { Authorization: 'Bearer your_hf_token' } }
  );

  return response.data.predicted_stocks || ['RELIANCE', 'TCS', 'INFY']; // Mock data
}

export { getStockPredictions };
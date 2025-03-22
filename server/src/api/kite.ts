import { KiteConnect } from 'kiteconnect';
import express from 'express';

const router = express.Router();
const kite = new KiteConnect({
  api_key: 'your_api_key', // Replace with your Kite API key from Zerodha
});

router.get('/portfolio', async (req, res) => {
  try {
    const accessToken = 'your_access_token'; // Replace with token from Kite login
    kite.setAccessToken(accessToken);
    const portfolio = await kite.getHoldings();
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;
 // server.js
  const express = require('express');
  const axios = require('axios');
  const cors = require('cors');
  require('dotenv').config();

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Coinbase API configuration
  const COINBASE_API_KEY = process.env.COINBASE_API_KEY;
  const COINBASE_API_SECRET = process.env.COINBASE_API_SECRET;
  const COINBASE_API_URL = 'https://api.coinbase.com/v2';

  // Trade recommendations endpoint
  app.get('/api/trade-recommendations', async (req, res) => {
      try {
          // In a real app, you would call your trade_picker.py here
          // For now, we'll return mock data
          const mockRecommendations = [
              { symbol: 'BTC-USD', name: 'Bitcoin', action: 'BUY', price: 68000, target_price: 72000, composite_score: 85 },
              { symbol: 'ETH-USD', name: 'Ethereum', action: 'HOLD', price: 3500, target_price: 3700, composite_score: 55 },
              { symbol: 'SOL-USD', name: 'Solana', action: 'STRONG BUY', price: 200, target_price: 250, composite_score: 92 }
          ];

          res.json(mockRecommendations);
      } catch (error) {
          console.error('Error fetching recommendations:', error);
          res.status(500).json({ error: 'Failed to fetch recommendations' });
      }
  });

  // Coinbase API proxy endpoint
  app.get('/api/coinbase/:endpoint', async (req, res) => {
      try {
          const { endpoint } = req.params;
          const response = await axios.get(`${COINBASE_API_URL}/${endpoint}`, {
              headers: {
                  'CB-ACCESS-KEY': COINBASE_API_KEY,
                  'CB-ACCESS-SIGN': generateSignature(req.method, `/v2/${endpoint}`),
                  'CB-ACCESS-TIMESTAMP': Math.floor(Date.now() / 1000).toString()
              }
          });
          res.json(response.data);
      } catch (error) {
          console.error('Coinbase API error:', error);
          res.status(500).json({ error: 'Coinbase API request failed' });
      }
  });

  // Helper function to generate Coinbase API signature
  function generateSignature(method, path) {
      // In a real implementation, you would generate a proper HMAC signature
      // This is simplified for demonstration
      return 'mock-signature';
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
  });

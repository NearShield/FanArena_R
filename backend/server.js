const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Simple file-based storage (replace with database in production)
const DATA_FILE = path.join(__dirname, 'data.json');

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return { users: {} };
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get user points
app.get('/api/points/:wallet', (req, res) => {
  const { wallet } = req.params;
  const data = loadData();
  const points = data.users[wallet]?.points || 0;
  res.json({ wallet, points });
});

// Award points (only called after verified trade in production)
app.post('/api/points/award', (req, res) => {
  const { wallet, amount = 1, tradeId } = req.body;
  if (!wallet) return res.status(400).json({ error: 'Wallet required' });

  const data = loadData();
  if (!data.users[wallet]) data.users[wallet] = { points: 0, trades: [] };

  // Prevent duplicate trade awards
  if (tradeId && data.users[wallet].trades.includes(tradeId)) {
    return res.json({ wallet, points: data.users[wallet].points, message: 'Already awarded' });
  }

  data.users[wallet].points += amount;
  if (tradeId) data.users[wallet].trades.push(tradeId);
  saveData(data);

  res.json({ wallet, points: data.users[wallet].points });
});

// Placeholder for Strike trade verification
// In production: use Strike API wallet auth to check fills
app.post('/api/strike/verify-trade', async (req, res) => {
  const { wallet } = req.body;
  // TODO: Call Strike authenticated API to check recent fills for this wallet
  // For now returns false (no free points)
  res.json({
    verified: false,
    message: 'Real verification requires Strike API keys and backend auth. See README.'
  });
});

app.listen(PORT, () => {
  console.log(`FanArena backend running on http://localhost:${PORT}`);
});

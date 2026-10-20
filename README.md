# FanArena — Full Stack

Creator fan-token tournaments platform with Strike integration.

## Structure
- `frontend/` — Single-page UI
- `backend/` — Express API for points & Strike verification

## Setup

### Backend
```bash
cd backend
npm install
npm start
```
Runs on `http://localhost:3001`

### Frontend
Open `frontend/index.html` in a browser (or serve it).

## Points System
- Points are stored server-side per wallet.
- Frontend fetches points from `/api/points/:wallet`.
- Awards only happen via `/api/points/award` after verification.

## Strike Integration (Production)
Real trade verification requires:
1. Strike API wallet keys (Ed25519)
2. Backend calls to Strike authenticated endpoints (`/v2/history/fill`, etc.)
3. Or Builder Codes so trades go through your platform

The current `/api/strike/verify-trade` is a placeholder that returns `verified: false`.

## Next Steps
1. Connect a real database (Postgres/Mongo) instead of `data.json`
2. Add wallet signature verification
3. Implement Strike API auth for real fill checks
4. Deploy backend (Railway, Render, etc.) and update frontend API URL

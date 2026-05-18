# CX Exchange

A full-stack real-time cryptocurrency exchange built from scratch with a matching engine, WebSockets, live orderbook updates, candlestick charts, authentication, and persistent trade storage.

## Features

### Trading Engine
- Real-time order matching
- Limit buy/sell orders
- Market pair support (`SOL_USDC`, `BTC_USDC`)
- Trade execution engine
- Partial fill handling

### Authentication
- JWT-based login
- Secure protected APIs
- User-based balances

### Real-Time Infrastructure
- WebSocket market subscriptions
- Live orderbook updates
- Live trade feed
- Live candlestick chart updates

### Database
- PostgreSQL
- Prisma ORM
- Persistent orders
- Persistent fills
- User balances

### Frontend
- Dark trading dashboard
- Live candlestick chart
- Orderbook
- Recent trades
- Buy/Sell order panel
## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- lightweight-charts

### Backend
- Bun
- Express
- WebSockets
- TypeScript

### Database
- PostgreSQL
- Prisma
### Deployment
- GitHub Codespaces
- GitHub
## System Architecture

```text
Frontend (Next.js)
       ↓
REST APIs + WebSockets
       ↓
Backend Matching Engine
       ↓
Prisma ORM
       ↓
PostgreSQL
```
## Project Structure
```text
cx-v1/
├── frontend/
├── backend/
├── prisma/
└── README.md
```
## Running Locally
### Backend
```bash
cd backend
bun install
bun --watch src/index.ts
```
Runs on:
```text
localhost:3000
localhost:8080
```
### Frontend
```bash
cd frontend
bun install
bun dev
```
Runs on:
```text
localhost:3001
```
## Demo Users
### Buyer
```text
username: buyer
password: 123456
```
### Seller
```text
username: seller
password: 123456
```
## API Examples
### Sign In
```bash
POST /auth/signin
```
### Place Order
```bash
POST /order
```
### Deposit Balance
```bash
POST /balance/deposit

## Future Improvements

- Market orders
- Stop loss orders
- Portfolio tracking
- PnL analytics
- Multi-market support
- TradingView indicators
- Redis orderbook caching
- Kubernetes deployment

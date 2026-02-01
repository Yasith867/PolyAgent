# PolyAgent - AI-Powered DeFi Portfolio Manager

An autonomous AI-powered portfolio management platform built for the Polygon blockchain ecosystem. PolyAgent combines advanced AI analysis with real-time blockchain data to help users optimize their DeFi strategies.

## Features

### Live Wallet Integration
- **MetaMask Connection** - Connect your wallet with one click
- **Real-time Token Balances** - Live blockchain data from Polygon network
- **USD Valuations** - Automatic price conversion via CoinGecko API
- **Network Detection** - Automatic Polygon network switching

### AI-Powered Analysis
- **Intelligent Chat Interface** - Natural language queries about your portfolio
- **Market Insights** - AI-generated market analysis and recommendations
- **Strategy Suggestions** - Personalized DeFi strategy recommendations
- **Risk Assessment** - Portfolio risk analysis and alerts

### Portfolio Dashboard
- **Live Portfolio Value** - Real-time wallet valuation
- **Token Allocation** - Visual breakdown of holdings
- **Performance Tracking** - Historical performance charts
- **Holdings Management** - Detailed token position view

### Supported Tokens
POL, WPOL, MATIC, USDC, USDT, WETH, WBTC, AAVE, LINK, UNI, QUICK, DAI, SPORK, SWOL, IDO

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express 5, Node.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: OpenAI GPT integration for chat and analysis
- **Web3**: ethers.js v6 for Polygon blockchain interaction
- **Charts**: Recharts for data visualization

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- MetaMask browser extension

### Environment Variables
```
DATABASE_URL=your_postgres_connection_string
AI_INTEGRATIONS_OPENAI_API_KEY=your_openai_key
SESSION_SECRET=your_session_secret
```

### Installation
```bash
npm install
npm run db:push
npm run dev
```

The application will be available at `http://localhost:5000`

## Usage

1. **Connect Wallet** - Click "Connect Wallet" and approve the MetaMask connection
2. **Switch to Polygon** - If prompted, switch to Polygon network
3. **View Dashboard** - See your live token balances and portfolio value
4. **Chat with AI** - Ask questions about your portfolio or DeFi strategies
5. **Explore Strategies** - Review AI-recommended yield opportunities

## Architecture

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── contexts/       # React contexts (wallet)
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   └── lib/            # Utilities
├── server/                 # Express backend
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Database operations
│   ├── polygon-service.ts  # Blockchain integration
│   └── seed.ts             # Demo data seeding
└── shared/                 # Shared types
    └── schema.ts           # Database schema
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/wallet/:address/balances` | GET | Fetch token balances for wallet |
| `/api/portfolios` | GET | Get portfolio data |
| `/api/ai-insights` | GET | Fetch AI-generated insights |
| `/api/strategies` | GET | Get recommended strategies |
| `/api/chat` | POST | Send message to AI agent |

## Built For

**Polygon Buildathon Wave 5** - Demonstrating the power of AI-assisted DeFi portfolio management on Polygon network.

## Why Polygon?

Polygon is purpose-built to scale money, trusted by leading enterprises like Stripe, Revolut, Google, and Reddit. Key stats:

| Metric | Value |
|--------|-------|
| Total Transactions | 5.3B+ |
| Unique Addresses | 117M+ |
| Stablecoin Supply | $3B+ |
| Average Transaction Cost | ~$0.001 |
| Block Time | ~2 seconds |
| Finality | ~5 seconds |
| Uptime | 99.99% |

### Polygon Features
- **Instant Settlement** - ~5s finality and 2s blocktimes
- **Low Cost** - Pay $0.001 to settle on-chain
- **Enterprise Ready** - Wallets, onramps, and compliance-ready infrastructure
- **Deep Liquidity** - Billions in stablecoins and every major asset
- **Account Abstraction** - Email logins, social recovery, sponsored gas

### Use Cases on Polygon
- **Payments** - Real-time money movement, no weekend breaks
- **Stablecoins** - $3B+ in liquidity with full reserve coverage
- **RWA Tokenization** - $1.14B+ in tokenized real-world assets
- **DeFi** - Borrow, swap, and access liquidity 24/7

## Polygon Resources

- [Polygon Documentation](https://docs.polygon.technology/) - Official developer docs
- [Polygon PoS Chain](https://docs.polygon.technology/pos/) - EVM chain focused on low cost, high throughput
- [Developer Tools](https://docs.polygon.technology/tools/) - Third-party integrations and security
- [Polygon Portal](https://portal.polygon.technology/) - Bridge and wallet tools
- [Polygon GitHub](https://github.com/0xpolygon) - Open source repositories
- [Polygon Website](https://polygon.technology/) - Learn more about Polygon

## License

MIT

# PolyAgent - AI-Powered DeFi Portfolio Manager

## Overview

PolyAgent is an AI-powered DeFi portfolio management application built for the Polygon blockchain ecosystem. The application provides autonomous AI agents that analyze DeFi markets, optimize yield strategies, and manage user portfolios with intelligent recommendations. It features real-time market analysis, AI-driven trading strategies, and portfolio performance tracking.

The project is built as a full-stack TypeScript application with a React frontend and Express backend, using PostgreSQL for data persistence and OpenAI for AI capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom Polygon-themed design tokens
- **Build Tool**: Vite with hot module replacement

The frontend follows a page-based structure with these main views:
- Dashboard: Portfolio overview with charts and AI insights
- Agent: Interactive AI chat interface for DeFi recommendations
- Market: Real-time market data and analysis
- Strategies: AI-recommended DeFi strategies
- Holdings: Token portfolio management
- Performance: Historical performance tracking

### Backend Architecture
- **Framework**: Express 5 on Node.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful JSON APIs with streaming support for AI responses
- **Build**: esbuild for production bundling with Vite for development

Key backend patterns:
- Storage layer abstraction (`server/storage.ts`) for database operations
- Route registration pattern in `server/routes.ts`
- Database seeding for demo data (`server/seed.ts`)
- Static file serving for production builds

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Migrations**: Drizzle Kit with `db:push` command

Core data models:
- `portfolios`: User DeFi portfolios with wallet addresses
- `tokenHoldings`: Individual token positions within portfolios
- `aiInsights`: AI-generated market insights and recommendations
- `strategies`: DeFi strategy configurations
- `aiChats`: Conversation history with AI agent
- `marketData`: Cached market data for tokens
- `conversations` / `messages`: General chat storage for AI integrations

### AI Integration
- **Provider**: OpenAI API (via Replit AI Integrations)
- **Streaming**: Server-Sent Events (SSE) for real-time AI responses
- **Capabilities**: Market analysis, risk assessment, yield optimization, strategy recommendations

The AI agent supports:
- Portfolio analysis and recommendations
- Real-time market insights
- Strategy suggestions based on risk profile
- Voice chat (audio processing utilities included)

### Replit Integrations
Located in `server/replit_integrations/` and `client/replit_integrations/`:
- **Chat**: Conversation storage and streaming chat routes
- **Audio**: Voice recording, playback, and speech-to-text/text-to-speech
- **Image**: AI image generation capabilities
- **Batch**: Rate-limited batch processing utilities

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management
- **connect-pg-simple**: Session storage for Express

### AI Services
- **OpenAI API**: Used for chat completions, audio processing, and image generation
- Environment variables: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`

### Key NPM Packages
- **Frontend**: React, TanStack Query, Recharts (charting), date-fns, wouter
- **Backend**: Express, pg (PostgreSQL client), OpenAI SDK
- **Shared**: Zod (validation), drizzle-zod (schema validation)

### Development Tools
- **Vite**: Development server and build tool
- **TypeScript**: Full type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Pre-built accessible components
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { aiChatRequestSchema, aiAnalyzeRequestSchema } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Portfolio routes
  app.get("/api/portfolios/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const portfolio = await storage.getPortfolio(id);
      if (!portfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }
      res.json(portfolio);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ error: "Failed to fetch portfolio" });
    }
  });

  app.get("/api/portfolios", async (req, res) => {
    try {
      const portfolios = await storage.getAllPortfolios();
      res.json(portfolios);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      res.status(500).json({ error: "Failed to fetch portfolios" });
    }
  });

  // Token Holdings routes
  app.get("/api/portfolios/:id/holdings", async (req, res) => {
    try {
      const portfolioId = parseInt(req.params.id);
      const holdings = await storage.getTokenHoldingsByPortfolio(portfolioId);
      res.json(holdings);
    } catch (error) {
      console.error("Error fetching holdings:", error);
      res.status(500).json({ error: "Failed to fetch holdings" });
    }
  });

  // AI Insights routes
  app.get("/api/portfolios/:id/insights", async (req, res) => {
    try {
      const portfolioId = parseInt(req.params.id);
      const insights = await storage.getInsightsByPortfolio(portfolioId);
      res.json(insights);
    } catch (error) {
      console.error("Error fetching insights:", error);
      res.status(500).json({ error: "Failed to fetch insights" });
    }
  });

  // Strategies routes
  app.get("/api/portfolios/:id/strategies", async (req, res) => {
    try {
      const portfolioId = parseInt(req.params.id);
      const strategyList = await storage.getStrategiesByPortfolio(portfolioId);
      res.json(strategyList);
    } catch (error) {
      console.error("Error fetching strategies:", error);
      res.status(500).json({ error: "Failed to fetch strategies" });
    }
  });

  app.get("/api/strategies", async (req, res) => {
    try {
      const strategyList = await storage.getAllStrategies();
      res.json(strategyList);
    } catch (error) {
      console.error("Error fetching strategies:", error);
      res.status(500).json({ error: "Failed to fetch strategies" });
    }
  });

  // Market Data routes
  app.get("/api/market", async (req, res) => {
    try {
      const data = await storage.getAllMarketData();
      res.json(data);
    } catch (error) {
      console.error("Error fetching market data:", error);
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  // AI Chat routes
  app.get("/api/ai-chats/:portfolioId", async (req, res) => {
    try {
      const portfolioId = parseInt(req.params.portfolioId);
      const chats = await storage.getChatsByPortfolio(portfolioId);
      res.json(chats);
    } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).json({ error: "Failed to fetch chats" });
    }
  });

  // AI Agent Chat - Streaming endpoint
  app.post("/api/ai-agent/chat", async (req, res) => {
    try {
      const validation = aiChatRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors[0]?.message || "Invalid request" });
      }
      const { portfolioId, message } = validation.data;

      // Save user message
      await storage.createChat({
        portfolioId: portfolioId || 1,
        role: "user",
        content: message,
      });

      // Get portfolio context
      const portfolio = await storage.getPortfolio(portfolioId || 1);
      const holdings = await storage.getTokenHoldingsByPortfolio(portfolioId || 1);
      const marketData = await storage.getAllMarketData();

      // Build context for AI
      const portfolioContext = portfolio
        ? `Portfolio "${portfolio.name}" with total value $${portfolio.totalValueUsd}, daily change ${portfolio.dailyChange}%.`
        : "No portfolio data available.";

      const holdingsContext = holdings.length > 0
        ? `Holdings: ${holdings.map((h) => `${h.symbol}: ${h.amount} ($${h.valueUsd})`).join(", ")}.`
        : "No token holdings.";

      const marketContext = marketData.length > 0
        ? `Market data: ${marketData.slice(0, 5).map((m) => `${m.symbol}: $${m.priceUsd} (${m.change24h}% 24h)`).join(", ")}.`
        : "";

      // Get chat history
      const chatHistory = await storage.getChatsByPortfolio(portfolioId || 1);
      const messages = chatHistory.slice(-10).map((chat) => ({
        role: chat.role as "user" | "assistant",
        content: chat.content,
      }));

      // Set up SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const systemPrompt = `You are PolyAgent, an advanced AI-powered DeFi portfolio manager specializing in the Polygon blockchain ecosystem. You help users understand their portfolios, analyze market conditions, recommend strategies, and optimize yield.

Current context:
${portfolioContext}
${holdingsContext}
${marketContext}

You should:
- Provide actionable DeFi insights and recommendations
- Analyze risk levels and suggest diversification
- Recommend yield farming, staking, and liquidity provision strategies on Polygon
- Explain complex DeFi concepts in simple terms
- Reference specific protocols like Uniswap V3, Aave V3, QuickSwap, Curve, and Lido on Polygon
- Consider gas costs and APY when making recommendations
- Be concise but thorough in your responses

When discussing strategies, include:
- Expected APY ranges
- Risk level (low/medium/high)
- Protocol name
- Brief explanation of the strategy`;

      const stream = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
        max_completion_tokens: 2048,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      // Save assistant response
      await storage.createChat({
        portfolioId: portfolioId || 1,
        role: "assistant",
        content: fullResponse,
      });

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Error in AI chat:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Failed to process message" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to process message" });
      }
    }
  });

  // Generate AI Insight
  app.post("/api/ai-agent/analyze", async (req, res) => {
    try {
      const validation = aiAnalyzeRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors[0]?.message || "Invalid request" });
      }
      const { portfolioId, type } = validation.data;

      const portfolio = await storage.getPortfolio(portfolioId || 1);
      const holdings = await storage.getTokenHoldingsByPortfolio(portfolioId || 1);

      const prompt = type === "risk"
        ? `Analyze the risk level of a portfolio with these holdings: ${holdings.map((h) => `${h.symbol}: $${h.valueUsd}`).join(", ")}. Provide a brief risk assessment.`
        : `Identify yield opportunities for a portfolio on Polygon with value $${portfolio?.totalValueUsd}. Suggest 2-3 specific DeFi strategies.`;

      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "system",
            content: "You are a DeFi analyst. Provide concise, actionable insights.",
          },
          { role: "user", content: prompt },
        ],
        max_completion_tokens: 512,
      });

      const content = response.choices[0]?.message?.content || "";

      const insight = await storage.createInsight({
        portfolioId: portfolioId || 1,
        type: type || "market_analysis",
        title: type === "risk" ? "Risk Assessment" : "Yield Opportunities",
        content,
        severity: type === "risk" ? "warning" : "opportunity",
      });

      res.json(insight);
    } catch (error) {
      console.error("Error generating insight:", error);
      res.status(500).json({ error: "Failed to generate insight" });
    }
  });

  return httpServer;
}

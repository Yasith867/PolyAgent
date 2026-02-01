import {
  type User,
  type InsertUser,
  type Portfolio,
  type InsertPortfolio,
  type TokenHolding,
  type InsertTokenHolding,
  type AiInsight,
  type InsertAiInsight,
  type Strategy,
  type InsertStrategy,
  type AiChat,
  type InsertAiChat,
  type MarketData,
  type InsertMarketData,
  users,
  portfolios,
  tokenHoldings,
  aiInsights,
  strategies,
  aiChats,
  marketData,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Portfolios
  getPortfolio(id: number): Promise<Portfolio | undefined>;
  getAllPortfolios(): Promise<Portfolio[]>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: number, updates: Partial<InsertPortfolio>): Promise<Portfolio | undefined>;

  // Token Holdings
  getTokenHoldingsByPortfolio(portfolioId: number): Promise<TokenHolding[]>;
  createTokenHolding(holding: InsertTokenHolding): Promise<TokenHolding>;
  updateTokenHolding(id: number, updates: Partial<InsertTokenHolding>): Promise<TokenHolding | undefined>;
  deleteTokenHolding(id: number): Promise<void>;

  // AI Insights
  getInsightsByPortfolio(portfolioId: number): Promise<AiInsight[]>;
  getAllInsights(): Promise<AiInsight[]>;
  createInsight(insight: InsertAiInsight): Promise<AiInsight>;
  markInsightAsRead(id: number): Promise<void>;

  // Strategies
  getStrategiesByPortfolio(portfolioId: number): Promise<Strategy[]>;
  getAllStrategies(): Promise<Strategy[]>;
  createStrategy(strategy: InsertStrategy): Promise<Strategy>;
  updateStrategy(id: number, updates: Partial<InsertStrategy>): Promise<Strategy | undefined>;

  // AI Chats
  getChatsByPortfolio(portfolioId: number): Promise<AiChat[]>;
  createChat(chat: InsertAiChat): Promise<AiChat>;

  // Market Data
  getAllMarketData(): Promise<MarketData[]>;
  getMarketDataBySymbol(symbol: string): Promise<MarketData | undefined>;
  upsertMarketData(data: InsertMarketData): Promise<MarketData>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Portfolios
  async getPortfolio(id: number): Promise<Portfolio | undefined> {
    const [portfolio] = await db.select().from(portfolios).where(eq(portfolios.id, id));
    return portfolio || undefined;
  }

  async getAllPortfolios(): Promise<Portfolio[]> {
    return db.select().from(portfolios).orderBy(desc(portfolios.createdAt));
  }

  async createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio> {
    const [created] = await db.insert(portfolios).values(portfolio).returning();
    return created;
  }

  async updatePortfolio(id: number, updates: Partial<InsertPortfolio>): Promise<Portfolio | undefined> {
    const [updated] = await db.update(portfolios).set(updates).where(eq(portfolios.id, id)).returning();
    return updated || undefined;
  }

  // Token Holdings
  async getTokenHoldingsByPortfolio(portfolioId: number): Promise<TokenHolding[]> {
    return db.select().from(tokenHoldings).where(eq(tokenHoldings.portfolioId, portfolioId));
  }

  async createTokenHolding(holding: InsertTokenHolding): Promise<TokenHolding> {
    const [created] = await db.insert(tokenHoldings).values(holding).returning();
    return created;
  }

  async updateTokenHolding(id: number, updates: Partial<InsertTokenHolding>): Promise<TokenHolding | undefined> {
    const [updated] = await db.update(tokenHoldings).set(updates).where(eq(tokenHoldings.id, id)).returning();
    return updated || undefined;
  }

  async deleteTokenHolding(id: number): Promise<void> {
    await db.delete(tokenHoldings).where(eq(tokenHoldings.id, id));
  }

  // AI Insights
  async getInsightsByPortfolio(portfolioId: number): Promise<AiInsight[]> {
    return db.select().from(aiInsights).where(eq(aiInsights.portfolioId, portfolioId)).orderBy(desc(aiInsights.createdAt));
  }

  async getAllInsights(): Promise<AiInsight[]> {
    return db.select().from(aiInsights).orderBy(desc(aiInsights.createdAt));
  }

  async createInsight(insight: InsertAiInsight): Promise<AiInsight> {
    const [created] = await db.insert(aiInsights).values(insight).returning();
    return created;
  }

  async markInsightAsRead(id: number): Promise<void> {
    await db.update(aiInsights).set({ isRead: true }).where(eq(aiInsights.id, id));
  }

  // Strategies
  async getStrategiesByPortfolio(portfolioId: number): Promise<Strategy[]> {
    return db.select().from(strategies).where(eq(strategies.portfolioId, portfolioId)).orderBy(desc(strategies.createdAt));
  }

  async getAllStrategies(): Promise<Strategy[]> {
    return db.select().from(strategies).orderBy(desc(strategies.createdAt));
  }

  async createStrategy(strategy: InsertStrategy): Promise<Strategy> {
    const [created] = await db.insert(strategies).values(strategy).returning();
    return created;
  }

  async updateStrategy(id: number, updates: Partial<InsertStrategy>): Promise<Strategy | undefined> {
    const [updated] = await db.update(strategies).set(updates).where(eq(strategies.id, id)).returning();
    return updated || undefined;
  }

  // AI Chats
  async getChatsByPortfolio(portfolioId: number): Promise<AiChat[]> {
    return db.select().from(aiChats).where(eq(aiChats.portfolioId, portfolioId)).orderBy(aiChats.createdAt);
  }

  async createChat(chat: InsertAiChat): Promise<AiChat> {
    const [created] = await db.insert(aiChats).values(chat).returning();
    return created;
  }

  // Market Data
  async getAllMarketData(): Promise<MarketData[]> {
    return db.select().from(marketData);
  }

  async getMarketDataBySymbol(symbol: string): Promise<MarketData | undefined> {
    const [data] = await db.select().from(marketData).where(eq(marketData.symbol, symbol));
    return data || undefined;
  }

  async upsertMarketData(data: InsertMarketData): Promise<MarketData> {
    const existing = await this.getMarketDataBySymbol(data.symbol);
    if (existing) {
      const [updated] = await db
        .update(marketData)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(marketData.symbol, data.symbol))
        .returning();
      return updated;
    }
    const [created] = await db.insert(marketData).values(data).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();

import express from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";
import { seedDatabase } from "../server/seed";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Initialize routes and seed database
let initialized = false;
let initError: Error | null = null;

async function initialize() {
  if (initialized) return true;
  if (initError) throw initError;

  try {
    console.log("[Vercel Function] Initializing...");
    console.log("[Vercel Function] Environment check:", {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasCloudflareAccountId: !!process.env.CLOUDFLARE_ACCOUNT_ID,
      hasCloudflareApiToken: !!process.env.CLOUDFLARE_API_TOKEN,
      nodeEnv: process.env.NODE_ENV
    });

    await registerRoutes(httpServer, app);
    console.log("[Vercel Function] Routes registered");

    await seedDatabase();
    console.log("[Vercel Function] Database seeded");

    initialized = true;
    console.log("[Vercel Function] Initialization complete");
    return true;
  } catch (error) {
    console.error("[Vercel Function] Initialization failed:", error);
    initError = error as Error;
    throw error;
  }
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    initialized,
    timestamp: new Date().toISOString(),
    env: {
      hasDatabase: !!process.env.DATABASE_URL,
      hasCloudflare: !!(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN),
      nodeEnv: process.env.NODE_ENV
    }
  });
});

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  try {
    await initialize();
    return app(req, res);
  } catch (error) {
    console.error("[Vercel Function] Handler error:", error);
    return res.status(500).json({
      error: "Server initialization failed",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    });
  }
}

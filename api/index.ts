import express from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";

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

// Initialize routes
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

    // Database seeding is optional - don't fail if it doesn't work
    try {
      const { seedDatabase } = await import("../server/seed");
      await seedDatabase();
      console.log("[Vercel Function] Database seeded");
    } catch (seedError) {
      console.warn("[Vercel Function] Database seeding skipped:", seedError);
      // Continue anyway - seeding is not critical
    }

    initialized = true;
    console.log("[Vercel Function] Initialization complete");
    return true;
  } catch (error) {
    console.error("[Vercel Function] Initialization failed:", error);
    initError = error as Error;
    throw error;
  }
}

// Health check endpoint - before initialization
app.get("/api/health", async (req, res) => {
  try {
    const status = {
      status: initialized ? "ok" : "initializing",
      initialized,
      timestamp: new Date().toISOString(),
      env: {
        hasDatabase: !!process.env.DATABASE_URL,
        hasCloudflare: !!(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN),
        nodeEnv: process.env.NODE_ENV
      },
      error: initError ? initError.message : null
    };

    res.status(initialized ? 200 : 503).json(status);
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  try {
    // Try to initialize if not already done
    if (!initialized && !initError) {
      try {
        await initialize();
      } catch (error) {
        console.error("[Vercel Function] Handler initialization error:", error);
        return res.status(500).json({
          error: "Server initialization failed",
          message: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
          hint: "Check environment variables and database connection"
        });
      }
    }

    return app(req, res);
  } catch (error) {
    console.error("[Vercel Function] Handler error:", error);
    return res.status(500).json({
      error: "Server error",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    });
  }
}

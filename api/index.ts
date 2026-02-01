import { registerRoutes } from "../server/routes";
import { createServer } from "http";
import express from "express";

// Create Express app
const app = express();
const server = createServer(app);

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple health check that always works
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Initialize routes once
let routesInitialized = false;

async function ensureRoutes() {
  if (!routesInitialized) {
    try {
      await registerRoutes(server, app);
      routesInitialized = true;
      console.log("[API] Routes initialized successfully");
    } catch (error) {
      console.error("[API] Failed to initialize routes:", error);
      throw error;
    }
  }
}

// Main handler
export default async function handler(req: any, res: any) {
  try {
    // Initialize routes if needed
    await ensureRoutes();

    // Handle the request
    return app(req, res);
  } catch (error) {
    console.error("[API] Request failed:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : String(error)
    });
  }
}

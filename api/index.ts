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

async function initialize() {
  if (!initialized) {
    await registerRoutes(httpServer, app);
    await seedDatabase();
    initialized = true;
  }
}

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  await initialize();
  return app(req, res);
}

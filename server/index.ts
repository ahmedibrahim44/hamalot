import express from "express";
import { createServer } from "http";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";
import { accessRequestSchema } from "./accessValidation";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let pool: mysql.Pool | null = null;
const attempts = new Map<string, { count: number; resetAt: number }>();

function getPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) pool = mysql.createPool(process.env.DATABASE_URL);
  return pool;
}

function canSubmit(address: string) {
  const now = Date.now();
  const entry = attempts.get(address);
  if (!entry || entry.resetAt < now) {
    attempts.set(address, { count: 1, resetAt: now + 15 * 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count += 1;
  return true;
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.set("trust proxy", 1);
  app.use(express.json({ limit: "32kb" }));

  app.post("/api/access-requests", async (req, res) => {
    const address = req.ip || "unknown";
    if (!canSubmit(address)) return res.status(429).json({ error: "Too many requests. Please try again later." });
    const parsed = accessRequestSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Please check the form fields and try again." });
    if (parsed.data.website) return res.status(204).end();
    const db = getPool();
    if (!db) return res.status(503).json({ error: "The request service is temporarily unavailable." });
    try {
      await db.execute(
        "INSERT INTO access_requests (name, business, email, message, locale) VALUES (?, ?, ?, ?, ?)",
        [parsed.data.name, parsed.data.business, parsed.data.email, parsed.data.message, parsed.data.locale],
      );
      return res.status(201).json({ success: true });
    } catch (error) {
      console.error("[access-requests] insert failed", error);
      return res.status(500).json({ error: "Unable to save the request at this time." });
    }
  });

  if (process.env.NODE_ENV === "production") {
    const staticPath = path.resolve(__dirname, "public");
    app.use(express.static(staticPath));
    app.get("*", (_req, res) => res.sendFile(path.join(staticPath, "index.html")));
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({ server: { middlewareMode: true, hmr: { server } }, appType: "spa" });
    app.use(vite.middlewares);
  }

  const port = Number(process.env.PORT || 3000);
  server.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});

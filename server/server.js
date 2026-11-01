// API minimale de sauvegarde pour Clairière : un seul document, protégé par un code.
import express from "express";
import { MongoClient } from "mongodb";
import crypto from "node:crypto";

const { MONGODB_URI, APP_CODE, ALLOWED_ORIGIN = "*", PORT = 3000 } = process.env;
if (!MONGODB_URI || !APP_CODE) {
  console.error("Variables MONGODB_URI et APP_CODE obligatoires.");
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
await client.connect();
const col = client.db("clairiere").collection("saves");

const sha = (s) => crypto.createHash("sha256").update(String(s)).digest();
const okCode = (c) => typeof c === "string" && crypto.timingSafeEqual(sha(c), sha(APP_CODE));

const app = express();
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.set("Access-Control-Allow-Headers", "content-type,x-app-code");
  res.set("Access-Control-Allow-Methods", "GET,PUT,OPTIONS");
  res.set("Access-Control-Max-Age", "86400");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

// freine les essais de code
const fails = new Map();
const auth = (req, res, next) => {
  const ip = req.ip, f = fails.get(ip) || { n: 0, t: Date.now() };
  if (Date.now() - f.t > 15 * 60e3) { f.n = 0; f.t = Date.now(); }
  if (f.n >= 10) return res.status(429).json({ error: "trop d'essais" });
  if (!okCode(req.get("x-app-code"))) { f.n++; fails.set(ip, f); return res.status(401).json({ error: "code refusé" }); }
  next();
};

app.get("/api/save", auth, async (_req, res) => {
  const d = await col.findOne({ _id: "main" });
  res.json(d ? { upd: d.upd, doc: d.doc } : { upd: 0, doc: null });
});

app.put("/api/save", auth, async (req, res) => {
  const doc = req.body && req.body.doc;
  if (!doc || typeof doc !== "object" || !Array.isArray(doc.grid) || typeof doc.upd !== "number")
    return res.status(400).json({ error: "document invalide" });
  const cur = await col.findOne({ _id: "main" }, { projection: { upd: 1 } });
  if (cur && cur.upd > doc.upd) return res.status(409).json({ error: "serveur plus récent", upd: cur.upd });
  await col.updateOne({ _id: "main" }, { $set: { doc, upd: doc.upd, at: new Date() } }, { upsert: true });
  res.json({ ok: true, upd: doc.upd });
});

app.use((err, _req, res, _next) => { console.error(err.message); res.status(500).json({ error: "erreur serveur" }); });
app.listen(PORT, () => console.log("API prête sur le port " + PORT));

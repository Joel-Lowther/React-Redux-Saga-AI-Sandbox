import express from "express";
const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok", provider: "mock" }));

const provider = {
  async reply(prompt) {
    return `I received “${prompt}”. This response came through Redux Saga and the Node adapter. Replace this provider with your AI or Deepgram integration when you are ready.`;
  },
};

app.post("/api/chat", async (req, res) => {
  const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
  if (!prompt) return res.status(400).json({ error: "A prompt is required." });
  try { return res.json({ reply: await provider.reply(prompt) }); }
  catch { return res.status(502).json({ error: "The provider is unavailable." }); }
});

app.post("/api/chat/summary", async (req, res) => {
  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const validMessages = messages.filter(
    (message) => message && (message.role === "user" || message.role === "assistant") && typeof message.content === "string"
  );
  if (!validMessages.length) return res.status(400).json({ error: "At least one message is required." });
  const topics = validMessages.map((message) => message.content.trim()).filter(Boolean);
  return res.json({ summary: `This thread contains ${validMessages.length} messages about: ${topics.join(" | ")}.` });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Signal Desk API listening on http://localhost:${port}`));
}

export { app };

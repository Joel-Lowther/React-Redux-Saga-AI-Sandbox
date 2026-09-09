const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());

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
app.listen(port, () => console.log(`Signal Desk API listening on http://localhost:${port}`));

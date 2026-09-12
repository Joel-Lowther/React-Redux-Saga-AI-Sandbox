const DEFAULT_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-4o-mini";

const fallbackReply = (prompt) =>
  `I received “${prompt}”. This response came through Redux Saga and the Node adapter. Configure an AI provider when you are ready.`;

const fallbackSummary = (messages) => {
  const topics = messages.map((message) => message.content.trim()).filter(Boolean);
  return `This thread contains ${messages.length} messages about: ${topics.join(" | ")}.`;
};

export function createProvider(config = process.env, fetchImpl = fetch) {
  const apiKey = config.AI_API_KEY?.trim();
  const endpoint = config.AI_API_ENDPOINT?.trim() || DEFAULT_ENDPOINT;
  const model = config.AI_MODEL?.trim() || DEFAULT_MODEL;
  const configured = Boolean(apiKey);

  async function complete(instruction, input) {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: "system", content: instruction },
          { role: "user", content: input },
        ],
      }),
    });

    if (!response.ok) throw new Error(`AI provider returned ${response.status}.`);
    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("AI provider returned an empty response.");
    return content;
  }

  return {
    name: configured ? "openai-compatible" : "mock",
    async reply(prompt) {
      if (!configured) return fallbackReply(prompt);
      return complete("Answer the user's question clearly and briefly.", prompt);
    },
    async summarize(messages) {
      if (!configured) return fallbackSummary(messages);
      const transcript = messages.map((message) => `${message.role}: ${message.content}`).join("\n");
      return complete("Summarize the conversation in two concise sentences.", transcript);
    },
  };
}

export const provider = createProvider();

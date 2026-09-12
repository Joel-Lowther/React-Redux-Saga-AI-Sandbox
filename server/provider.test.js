import { describe, expect, it, vi } from "vitest";
import { createProvider } from "./provider.js";

describe("provider adapter", () => {
  it("uses the deterministic fallback without credentials", async () => {
    const provider = createProvider({});

    await expect(provider.reply("Hello")).resolves.toContain("I received");
    await expect(provider.summarize([{ role: "user", content: "Hello" }])).resolves.toContain("1 messages");
    expect(provider.name).toBe("mock");
  });

  it("calls an OpenAI-compatible endpoint when configured", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: "A concise answer." } }] }), { status: 200 })
    );
    const provider = createProvider(
      { AI_API_KEY: "test-key", AI_API_ENDPOINT: "https://example.test/chat", AI_MODEL: "test-model" },
      fetchMock
    );

    await expect(provider.reply("Hello")).resolves.toBe("A concise answer.");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.test/chat",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer test-key" }),
      })
    );
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ model: "test-model" });
    expect(provider.name).toBe("openai-compatible");
  });
});

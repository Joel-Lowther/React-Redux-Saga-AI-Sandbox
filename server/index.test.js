import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "./index.js";

describe("chat API", () => {
  it("reports service health", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok", provider: "mock" });
  });

  it("rejects an empty prompt", async () => {
    const response = await request(app)
      .post("/api/chat")
      .send({ prompt: "   " });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "A prompt is required." });
  });

  it("returns the provider reply", async () => {
    const response = await request(app)
      .post("/api/chat")
      .send({ prompt: "Hello" });

    expect(response.status).toBe(200);
    expect(response.body.reply).toContain("Hello");
  });

  it("summarizes a conversation", async () => {
    const response = await request(app)
      .post("/api/chat/summary")
      .send({ messages: [{ role: "user", content: "Hello" }] });

    expect(response.status).toBe(200);
    expect(response.body.summary).toContain("1 messages");
    expect(response.body.summary).toContain("Hello");
  });

  it("rejects an empty conversation summary request", async () => {
    const response = await request(app).post("/api/chat/summary").send({ messages: [] });

    expect(response.status).toBe(400);
  });
});

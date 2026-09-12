import { call, put } from "redux-saga/effects";
import { describe, expect, it, vi } from "vitest";
import { chatActions } from "./chatSlice";
import { requestReply, sendMessage } from "./sagas";

describe("chat Saga", () => {
  it("requests a reply and dispatches the result", () => {
    const iterator = sendMessage(chatActions.messageSent("Hello"));

    expect(iterator.next().value).toEqual(call(requestReply, "Hello"));
    expect(iterator.next({ reply: "Hi there" }).value).toEqual(
      put(chatActions.replyReceived("Hi there"))
    );
  });

  it("dispatches a user-facing error when the request fails", () => {
    const iterator = sendMessage(chatActions.messageSent("Hello"));

    iterator.next();
    expect(iterator.throw(new Error("Network down")).value).toEqual(
      put(chatActions.requestFailed("Network down"))
    );
  });

  it("translates a successful API response", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ reply: "Hi there" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(requestReply("Hello")).resolves.toEqual({ reply: "Hi there" });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/chat",
      expect.objectContaining({ method: "POST" })
    );

    vi.unstubAllGlobals();
  });
});

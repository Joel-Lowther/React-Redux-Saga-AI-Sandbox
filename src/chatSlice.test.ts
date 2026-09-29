import { describe, expect, it } from "vitest";
import reducer, { chatActions } from "./chatSlice";

describe("chat reducer", () => {
  it("records a sent message and enters loading state", () => {
    const state = reducer(undefined, chatActions.messageSent("Hello"));

    expect(state.status).toBe("loading");
    expect(state.error).toBeNull();
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0]).toMatchObject({ role: "user", content: "Hello" });
  });

  it("records a reply and marks the request succeeded", () => {
    const state = reducer(
      reducer(undefined, chatActions.messageSent("Hello")),
      chatActions.replyReceived("Hi there")
    );

    expect(state.status).toBe("succeeded");
    expect(state.messages[1]).toMatchObject({ role: "assistant", content: "Hi there" });
  });

  it("stores request failures for the UI", () => {
    const state = reducer(undefined, chatActions.requestFailed("API unavailable"));

    expect(state).toMatchObject({ status: "failed", error: "API unavailable" });
  });

  it("stores a generated conversation summary", () => {
    const state = reducer(
      reducer(undefined, chatActions.summaryRequested([{ id: "1", role: "user", content: "Hello" }])),
      chatActions.summaryReceived("A greeting thread")
    );

    expect(state).toMatchObject({ summary: "A greeting thread", summaryStatus: "succeeded" });
  });

  it("clears the active conversation and summary state", () => {
    const state = reducer(
      reducer(
        reducer(
          reducer(undefined, chatActions.messageSent("Hello")),
          chatActions.replyReceived("Hi there")
        ),
        chatActions.summaryRequested([{ id: "1", role: "user", content: "Hello" }])
      ),
      chatActions.clearConversation()
    );

    expect(state).toMatchObject({
      messages: [],
      status: "idle",
      error: null,
      summary: null,
      summaryStatus: "idle",
      summaryError: null,
    });
  });
});

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ChatStatus = "idle" | "loading" | "succeeded" | "failed";
export type Message = { id: string; role: "user" | "assistant"; content: string };
export type SummaryStatus = "idle" | "loading" | "succeeded" | "failed";

type ChatState = { messages: Message[]; status: ChatStatus; error: string | null; summary: string | null; summaryStatus: SummaryStatus; summaryError: string | null };
const initialState: ChatState = { messages: [], status: "idle", error: null, summary: null, summaryStatus: "idle", summaryError: null };
const createMessageId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    messageSent: (state, action: PayloadAction<string>) => {
      state.messages.push({ id: createMessageId(), role: "user", content: action.payload });
      state.status = "loading";
      state.error = null;
      state.summary = null;
      state.summaryStatus = "idle";
      state.summaryError = null;
    },
    replyReceived: (state, action: PayloadAction<string>) => {
      state.messages.push({ id: createMessageId(), role: "assistant", content: action.payload });
      state.status = "succeeded";
    },
    requestFailed: (state, action: PayloadAction<string>) => { state.status = "failed"; state.error = action.payload; },
    summaryRequested: (state, _action: PayloadAction<Message[]>) => { state.summaryStatus = "loading"; state.summaryError = null; },
    summaryReceived: (state, action: PayloadAction<string>) => { state.summary = action.payload; state.summaryStatus = "succeeded"; },
    summaryFailed: (state, action: PayloadAction<string>) => { state.summaryStatus = "failed"; state.summaryError = action.payload; },
  },
});

export const chatActions = chatSlice.actions;
export default chatSlice.reducer;

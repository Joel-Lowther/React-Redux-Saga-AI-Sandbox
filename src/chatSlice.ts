import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ChatStatus = "idle" | "loading" | "succeeded" | "failed";
export type Message = { id: string; role: "user" | "assistant"; content: string };

type ChatState = { messages: Message[]; status: ChatStatus; error: string | null };
const initialState: ChatState = { messages: [], status: "idle", error: null };
const createMessageId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    messageSent: (state, action: PayloadAction<string>) => {
      state.messages.push({ id: createMessageId(), role: "user", content: action.payload });
      state.status = "loading";
      state.error = null;
    },
    replyReceived: (state, action: PayloadAction<string>) => {
      state.messages.push({ id: createMessageId(), role: "assistant", content: action.payload });
      state.status = "succeeded";
    },
    requestFailed: (state, action: PayloadAction<string>) => { state.status = "failed"; state.error = action.payload; },
  },
});

export const chatActions = chatSlice.actions;
export default chatSlice.reducer;

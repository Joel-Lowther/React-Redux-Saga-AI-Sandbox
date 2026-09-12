import { call, put, takeLatest } from "redux-saga/effects";
import { chatActions, Message } from "./chatSlice";

type ChatResponse = { reply: string };
type SummaryResponse = { summary: string };
export const requestReply = async (prompt: string): Promise<ChatResponse> => {
  const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
  if (!response.ok) throw new Error("The API could not answer right now.");
  return response.json();
};

export const requestSummary = async (messages: Message[]): Promise<SummaryResponse> => {
  const response = await fetch("/api/chat/summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!response.ok) throw new Error("The summary could not be created right now.");
  return response.json();
};

export function* sendMessage(action: ReturnType<typeof chatActions.messageSent>) {
  try { const result: ChatResponse = yield call(requestReply, action.payload); yield put(chatActions.replyReceived(result.reply)); }
  catch (error) { yield put(chatActions.requestFailed(error instanceof Error ? error.message : "Something went wrong.")); }
}

export function* summarizeConversation(action: ReturnType<typeof chatActions.summaryRequested>) {
  try {
    const result: SummaryResponse = yield call(requestSummary, action.payload);
    yield put(chatActions.summaryReceived(result.summary));
  } catch (error) {
    yield put(chatActions.summaryFailed(error instanceof Error ? error.message : "Something went wrong."));
  }
}

export function* rootSaga() {
  yield takeLatest(chatActions.messageSent.type, sendMessage);
  yield takeLatest(chatActions.summaryRequested.type, summarizeConversation);
}

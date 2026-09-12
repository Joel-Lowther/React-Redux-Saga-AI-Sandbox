import { call, put, takeLatest } from "redux-saga/effects";
import { chatActions } from "./chatSlice";

type ChatResponse = { reply: string };
export const requestReply = async (prompt: string): Promise<ChatResponse> => {
  const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
  if (!response.ok) throw new Error("The API could not answer right now.");
  return response.json();
};

export function* sendMessage(action: ReturnType<typeof chatActions.messageSent>) {
  try { const result: ChatResponse = yield call(requestReply, action.payload); yield put(chatActions.replyReceived(result.reply)); }
  catch (error) { yield put(chatActions.requestFailed(error instanceof Error ? error.message : "Something went wrong.")); }
}
export function* rootSaga() { yield takeLatest(chatActions.messageSent.type, sendMessage); }

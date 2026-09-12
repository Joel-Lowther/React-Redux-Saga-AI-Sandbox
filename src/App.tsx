import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { chatActions } from "./chatSlice";
import "./styles.css";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, status, error } = useSelector((state: RootState) => state.chat);
  const [prompt, setPrompt] = useState("");

  const submitPrompt = (event: FormEvent) => {
    event.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || status === "loading") return;
    dispatch(chatActions.messageSent(trimmedPrompt));
    setPrompt("");
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark">S</div>
        <div>
          <p className="eyebrow">AI orchestration lab</p>
          <h1>Signal Desk</h1>
        </div>
        <div className="stack-status"><span /> API connected</div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow accent">Conversation workspace / 01</p>
          <h2>Turn a question into a signal.</h2>
          <p className="hero-copy">A small, observable chat workflow built to show the full request lifecycle from React to Redux Saga to Node.</p>
        </div>
        <div className="architecture" aria-label="Request architecture">
          <span>React</span><b>→</b><span>Redux</span><b>→</b><span>Saga</span><b>→</b><span>Node</span>
        </div>
      </section>

      <section className="workspace">
        <div className="conversation-panel">
          <div className="panel-heading"><div><p className="eyebrow">Live thread</p><h3>Ask the desk</h3></div><span className={`status-pill ${status}`}>{status}</span></div>
          <div className="messages" aria-live="polite">
            {messages.map((message) => <article className={`message ${message.role}`} key={message.id}><span className="message-role">{message.role === "user" ? "You" : "Signal Desk"}</span><p>{message.content}</p></article>)}
            {status === "loading" && <article className="message assistant loading-message"><span className="message-role">Signal Desk</span><p>Connecting the dots<span className="loading-dots">...</span></p></article>}
          </div>
          {error && <p className="error-message">{error}</p>}
          <form className="composer" onSubmit={submitPrompt}>
            <input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask about the architecture..." aria-label="Message" />
            <button type="submit" disabled={!prompt.trim() || status === "loading"}>Send <span>↗</span></button>
          </form>
        </div>

        <aside className="inspector">
          <p className="eyebrow">System readout</p>
          <h3>What is happening</h3>
          <div className="readout-row"><span>State manager</span><strong>Redux Toolkit</strong></div>
          <div className="readout-row"><span>Side effects</span><strong>Redux Saga</strong></div>
          <div className="readout-row"><span>API layer</span><strong>Node + Express</strong></div>
          <div className="readout-row"><span>Provider</span><strong className="provider">Mock adapter <i>ready for AI</i></strong></div>
          <div className="next-feature"><span className="spark">✦</span><div><p className="eyebrow">Next signal</p><p>Swap the mock adapter for streaming AI or Deepgram transcription.</p></div></div>
        </aside>
      </section>
    </main>
  );
}

# Signal Desk

Signal Desk is a small showcase of a React request lifecycle: React dispatches an action, Redux stores the conversation, Redux Saga coordinates the side effect, and a Node/Express API calls a provider adapter.

## Run it locally

Install Node.js, then run:

```bash
npm install
npm run dev
```

The React app runs on `http://localhost:3000` and the API runs on `http://localhost:4000`.

## Run it in CodeSandbox

You do not need Node.js installed on your machine. Create a CodeSandbox from this project by importing its GitHub repository, uploading the project folder, or opening it in the CodeSandbox editor. The checked-in `.codesandbox/tasks.json` automatically runs `npm install` and then `npm run dev`, which starts both the React preview and the Express API in CodeSandbox's hosted environment.

Open the generated port `3000` preview. The API stays on port `4000` inside the same sandbox, and the React proxy forwards `/api/chat` to it.

## Architecture

- `src/chatSlice.ts` owns conversation state and status transitions.
- `src/sagas.ts` owns the API side effect and failure handling.
- `server/index.js` exposes `POST /api/chat` and contains the provider adapter.

The current adapter is deterministic so the workflow works without credentials. The next integration can replace `provider.reply` with an AI SDK call or a Deepgram transcription workflow without changing the UI or Redux contract.
Created with CodeSandbox

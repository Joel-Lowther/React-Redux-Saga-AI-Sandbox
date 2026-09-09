# Signal Desk

Signal Desk is a small showcase of a modern React request lifecycle: React dispatches an action, Redux stores the conversation, Redux Saga coordinates the side effect, and a Node/Express API calls a provider adapter.

The client uses React, TypeScript, and Vite. The server is Express, and the full workflow is designed to run in GitHub Codespaces without local Node.js installation.

## Run it locally

With Node.js 22 or newer installed, run:

```bash
npm install
npm run dev
```

The React app runs on `http://localhost:3000` and the API runs on `http://localhost:4000`.

## Run it in GitHub Codespaces

You do not need Node.js installed on your machine. Open the GitHub repository, select **Code**, choose **Codespaces**, and create a codespace. The checked-in `.devcontainer/devcontainer.json` installs dependencies, forwards ports `3000` and `4000`, and starts the app automatically.

Open the forwarded port `3000` preview. The API runs on port `4000` inside the codespace, and Vite proxies `/api/chat` to it. You can verify the API from the Ports panel by opening `/api/health` on port `4000`.

## Architecture

- `src/chatSlice.ts` owns conversation state and status transitions.
- `src/sagas.ts` owns the API side effect and failure handling.
- `server/index.js` exposes `POST /api/chat` and contains the provider adapter.

The current adapter is deterministic so the workflow works without credentials. The next integration can replace `provider.reply` with an AI SDK call or a Deepgram transcription workflow without changing the UI or Redux contract.

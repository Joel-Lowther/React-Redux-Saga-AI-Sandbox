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

## Provider status


The current adapter is deterministic so the workflow works without credentials. The next integration can replace `provider.reply` with an AI SDK call or a Deepgram transcription workflow without changing the UI or Redux contract.
## Stack

- React 19 and TypeScript for the client UI
- Redux Toolkit for conversation state
- Redux Saga for asynchronous request orchestration
- Node.js and Express for the API
- Vite for development and production builds
- Vitest and Supertest for automated tests
- GitHub Codespaces dev container for a repeatable environment

## Useful commands

```bash
npm test       # Run the test suite once
npm run build  # Type-check and create a production build
npm run server # Run only the Express API
npm start      # Run only the Vite client
```

## Architecture

```mermaid
flowchart LR
	UI[React UI] -->|messageSent| Store[Redux Toolkit store]
	Store --> Saga[Redux Saga]
	Saga -->|POST /api/chat| API[Express API]
	API --> Provider[Provider adapter]
	Provider -->|reply| API
	API --> Saga
	Saga -->|replyReceived or requestFailed| Store
	Store --> UI
```

The main ownership boundaries are:

- `src/App.tsx` renders the conversation and dispatches user actions.
- `src/chatSlice.ts` owns messages, status, and error state.
- `src/sagas.ts` owns the API side effect and failure handling.
- `server/index.js` validates requests and calls the provider adapter.
- `vite.config.ts` proxies `/api` calls to the Express server during development.

## Request lifecycle

1. The user submits a prompt in React.
2. React dispatches `messageSent`.
3. Redux stores the user message and sets `loading`.
4. Redux Saga calls `POST /api/chat`.
5. Express validates the prompt and asks the provider adapter for a reply.
6. Saga dispatches `replyReceived` or `requestFailed`.
7. React renders the updated conversation state.

## Testing

The test suite covers the state and integration boundaries that matter most:

- Reducer transitions for sent messages, successful replies, and failures
- Saga effects for successful and failed requests
- API health, validation, and provider responses

Run the suite with:

```bash
npm test
```

## Git workflow

For an SVN comparison:

- **Update**: pull or synchronize incoming changes in VS Code Source Control.
- **Commit**: stage selected files, enter a message, and commit locally.
- **Push**: use **Sync Changes** to send local commits to GitHub.

This project uses small commits so the portfolio history shows the build,
testing, documentation, and future AI feature work separately.

## Planned AI feature

The next feature branch will add conversation summarization through the provider
adapter. It will keep the existing chat flow intact while demonstrating a
realistic AI integration, error handling, and a focused pull request.

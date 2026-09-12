# Copilot Instructions

## Formatting preferences

- Keep CSS readable and expanded rather than compressed onto one line.
- Put each CSS property on its own line.
- Leave a blank line between CSS selector blocks, including media-query blocks.
- Format nested or grouped rules so each logical rule is easy to scan.
- Preserve existing formatting in files that are not part of the requested change.
- Do not reformat an entire file just to make a small change unless explicitly requested.
- Prefer consistent indentation and spacing over minimizing line count.

## Editing preferences

- Make the smallest focused change that satisfies the request.
- Before editing, inspect the relevant file and nearby implementation.
- After editing, run the narrowest useful validation, such as a test, build, or lint command.
- Do not overwrite unrelated user changes.
- Keep comments short and add them only when they clarify non-obvious behavior.
- Do not commit or push changes unless explicitly requested.

## Project conventions

- Keep the React, Redux Toolkit, Redux Saga, Express, and Vite structure already established in the project.
- Keep deterministic local fallbacks available when external AI credentials are not configured.
- Add or update focused tests when changing reducer, Saga, provider, or API behavior.
- Keep secrets in local `.env` files and never commit them; update `.env.example` when configuration changes.

# Gemini CLI Project Instructions

- You should commit and push your changes before ending a task.
- This is a Turborepo monorepo project using `pnpm`.
- You must use Conventional Commits syntax for commit messages. Use only lowercase letters unless mentioning a brand (e.g., PandaCSS, Next.js).
- **Critical:** Whenever you (the AI) make changes that require visual or functional verification, you must provide the relevant local links (e.g., http://localhost:3000 for the viewer, http://localhost:4321 for docs) and explicitly ask the user to judge the results. 
- **Verification:** Always build the application (`pnpm run build`) to verify changes and ensure no compile errors. For E2E testing, prefer running against the production build to ensure reliability. Use `pnpm run dev` only for quick manual verification during development if e2e tests are initiated. Use `docker compose up --build -d` ONLY when the user needs to provide final feedback on the UI or functionality at the end of a task or phase. Do not use watch modes.

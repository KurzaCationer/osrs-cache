# Gemini CLI Project Instructions

- You should commit and push your changes before ending a task.
- This is a Turborepo monorepo project.
- You must use `pnpm` for package management.
- You must use Conventional Commits syntax for commit messages. Use only lowercase letters unless mentioning a brand (e.g., PandaCSS, Next.js).
- **Critical:** Whenever you (the AI) make changes that require visual or functional verification, you must provide the relevant local links (e.g., http://localhost:3000 for the viewer, http://localhost:4321 for docs) and explicitly ask the user to judge the results. 
- **Verification:** Use `pnpm run dev` for manual verification during development. Use `docker compose up --build -d` ONLY when the user needs to provide final feedback on the UI or functionality at the end of a task or phase. Do not use watch modes.

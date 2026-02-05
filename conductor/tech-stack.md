# Tech Stack

## Monorepo Management
- **Turbo:** Build system for orchestrating tasks across the monorepo.
- **pnpm Workspaces:** Package management and workspace orchestration.

## Programming Languages
- **TypeScript:** Primary language for all packages and applications.

## Frontend Frameworks & Libraries
- **React (v19):** UI library for both the Viewer and Docs.
- **TanStack Start:** Framework for building the Viewer application.
- **TanStack Router:** Type-safe routing for the Viewer.
- **TanStack Query:** Data fetching and state management.
- **TanStack Table:** Headless UI for building powerful tables (useful for asset lists).
- **TanStack Virtual:** Logic for displaying large lists with high performance.
- **Astro:** Framework for building the documentation site.

## Styling & Design
- **PandaCSS:** Build-time CSS-in-JS for type-safe styling.
- **Lucide React:** Icon library.

## Data Processing
- **fflate:** High-performance GZIP decompression.
- **seek-bzip:** Synchronous BZIP2 decompression for binary OSRS cache blocks.

## Development & Build Tooling
- **Vite:** Build tool and dev server.
- **tsup:** TypeScript bundler for packages (`osrs-cache-loader`).
- **Vitest:** Testing framework.
- **cache2:** Used as a source of truth for verifying asset counts in integration tests.
- **ESLint:** Pluggable linting utility for JavaScript and TypeScript.
- **Prettier:** Opinionated code formatter.

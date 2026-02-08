# Implementation Plan: OpenRS2 Cache Loading MVP

## Phase 1: Loader Enhancement (`@kurza/osrs-cache-loader`)

- [x] Task: Activate `archivist-retriever` to retrieve OpenRS2 API reference from `reference-material/docs/openrs2-api/`.
- [x] Task: Define TypeScript interfaces for OpenRS2 API responses and asset counts.
- [x] Task: Implement `OpenRS2Client` for fetching data from the Archive API.
  - [ ] Write failing tests for fetching a list of caches.
  - [ ] Implement fetching logic.
- [x] Task: Implement asset counting logic in the loader.
  - [ ] Write failing tests for counting Items, NPCs, Objects, Maps, and Audio.
  - [ ] Implement logic (stubbing actual binary parsing if necessary, or using API metadata).
- [x] Task: Finalize `loadCache` function to return the aggregated summary and verify with tests.

## Phase 2: Viewer Cleanup & Preparation (`osrs-cache-viewer`)

- [x] Task: Activate `archivist-retriever` to retrieve PandaCSS and TanStack documentation from `reference-material/docs/`.
- [x] Task: Remove all demo routes and components (`apps/osrs-cache-viewer/src/routes/demo/`, etc.).
- [x] Task: Clean up `apps/osrs-cache-viewer/src/routes/__root.tsx` and main navigation.
- [x] Task: Verify that the application still builds successfully (`pnpm run build`).

## Phase 3: Viewer Implementation (`osrs-cache-viewer`)

- [x] Task: Create a TanStack Start server function to call `@kurza/osrs-cache-loader`.
- [x] Task: Design and implement the new Index page (`apps/osrs-cache-viewer/src/routes/index.tsx`) using PandaCSS.
  - [x] Display asset counts in a grid or card layout.
  - [x] Implement a loading state and error handling.
- [x] Task: Verify the index page functionality via integration tests if feasible, or strictly via build/type checks.

## Phase 4: Documentation & Knowledge Management

- [x] Task: Create `apps/osrs-cache-docs/src/pages/getting-started.md` and document loader usage and Viewer MVP status.
- [x] Task: Activate `archivist-librarian` to organize and standardize the new documentation.
- [x] Task: Verify documentation build (`pnpm run build` in docs app).

## Phase 5: Final Quality Gates & Completion

- [x] Task: Run full monorepo build and lint check (`pnpm run build && pnpm run lint`).
- [x] Task: Verify all tests pass across all packages (`pnpm test`).
- [x] Task: Perform final visual verification of the Viewer UI using `docker compose up`.
- [x] Task: Activate `archivist-cleaner` for a final audit of the documentation library.
- [x] Task: Conductor - User Manual Verification 'Phase 5: Final Quality Gates & Completion' (Protocol in workflow.md)

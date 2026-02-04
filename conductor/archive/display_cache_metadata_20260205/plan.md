# Implementation Plan: Display Cache Metadata on Index Page

## Phase 1: Loader Enhancements (TDD) [checkpoint: 83afbb3]
- [x] Task: Define `CacheMetadata` type in `@kurza/osrs-cache-loader`
    - [x] Add `CacheMetadata` interface to `packages/osrs-cache-loader/src/types.ts` including build version, cache ID, timestamp, source, and counts.
- [x] Task: Implement `getMetadata` in `@kurza/osrs-cache-loader`
    - [x] Write failing tests in `packages/osrs-cache-loader/src/index.test.ts` for a new `getMetadata` function.
    - [x] Implement `getMetadata` in `packages/osrs-cache-loader/src/index.ts`. Ensure it aggregates data from the OpenRS2 client and existing counts logic.
    - [x] Verify tests pass and coverage is >80% for new code.

## Phase 2: Viewer Integration [checkpoint: 0172f50]
- [x] Task: Update Viewer Data Fetching
    - [x] Update TanStack Query hooks in `apps/osrs-cache-viewer/src/routes/index.tsx` (or relevant integration file) to use the new `getMetadata` function.
    - [x] Ensure types are correctly shared/mapped between the loader and viewer.
- [x] Task: UI Implementation
    - [x] Modify the index page component in `apps/osrs-cache-viewer/src/routes/index.tsx` to display the new metadata fields (Build, ID, Timestamp, Source).
    - [x] Use PandaCSS for styling the new metadata section to match existing project conventions.

## Phase 3: Final Verification & Cleanup
- [x] Task: End-to-End Verification
    - [x] Build the project using `pnpm run build`.
    - [x] Verify the UI displays correct metadata when running the viewer.
- [ ] Task: Conductor - Squash and Archive Track (Protocol in workflow.md)
- [ ] Task: Conductor - Final User Manual Verification (Protocol in workflow.md)

# Implementation Plan - Fix and Expand Cache Data Loaders

This plan covers researching implementation details from `cache2`, fixing the zero-count bug, and expanding the frontend to display all available asset categories dynamically.

## Phase 0: Research & Discovery [checkpoint: 5a58922]

Goal: Understand the precise archive and file structure by investigating the `cache2` implementation.

- [x] Task: Clone the `cache2` repository into a temporary directory.
- [x] Task: Research how `cache2` determines file counts for different indices (especially Index 2 and Index 5).
- [x] Task: Document the mapping of Index/Archive to Asset Categories for use in the loader.
- [x] Task: Conductor - User Manual Verification 'Phase 0: Research & Discovery' (Protocol in workflow.md)

## Phase 1: Loader Core Implementation [checkpoint: c10303a]

Goal: Implement the OSRS cache protocol and data access from scratch in `@kurza/osrs-cache-loader` based on `cache2` research.

- [x] Task: Update `AssetCounts` type in `packages/osrs-cache-loader/src/types.ts` to include all categories.
- [x] Task: Write failing tests in `packages/osrs-cache-loader/src/index.test.ts` for all expected asset categories.
- [x] Task: Implement `getArchiveMetadata` in `OpenRS2Client` to fetch archive info (needed for file counts).
- [x] Task: Implement Reference Table (Index 255) parser and Archive/File data structures.
- [x] Task: Implement GZIP decompression logic.
- [x] Task: Implement BZ2 decompression logic (if needed for Index 2).
- [x] Task: Refactor `loadCache` to return a `Cache` object providing access to assets and accurate counts.
- [x] Task: Verify all loader tests pass with mocked Reference Table data.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Loader Core Implementation' (Protocol in workflow.md)

## Phase 2: Frontend Dynamic Rendering [checkpoint: 2b534e4]

Goal: Update the viewer to show all categories returned by the loader.

- [x] Task: Create a mapping utility for Icons and Colors for all asset categories.
- [x] Task: Update `apps/osrs-cache-viewer/src/routes/index.tsx` to iterate over the `data` object and render `CountCard` dynamically.
- [x] Task: Ensure the grid layout handles an increased number of cards (10+ categories) gracefully on mobile and desktop.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Frontend Dynamic Rendering' (Protocol in workflow.md)

## Phase 3: Final Verification & Cleanup [checkpoint: 8767358]

Goal: End-to-end check, squashing, and archival.

- [x] Task: Run `pnpm run build` to ensure no type errors or build failures across the monorepo.
- [x] Task: Perform final visual check using `docker compose up --build -d`.
- [x] Task: Squash all track commits into a single feature commit and archive the track (Protocol in workflow.md).
- [x] Task: Conductor - User Manual Verification 'Phase 3: Final Verification & Cleanup' (Protocol in workflow.md)

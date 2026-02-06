# Implementation Plan: Frontend Performance & Asset View Refactor

This plan outlines the steps to implement server-side persistent caching, migrate to TanStack Start loaders, and refactor the asset browser to a JSON-focused table.

## Phase 1: Server-Side Cache Persistence
Implement the OS-standard persistent storage for the `@kurza/osrs-cache-loader` or the viewer's server-side logic.

- [x] Task: Research and implement OS-specific data directory resolution (e.g., using `env-paths` or similar logic).
- [x] Task: Update the cache loading logic to check the persistent directory before downloading.
- [x] Task: Implement a mechanism to "install" downloaded caches into the persistent directory.
- [x] Task: Write tests verifying that caches are retrieved from disk after the first download.

## Phase 2: TanStack Start Loader Migration
Refactor the `osrs-cache-viewer` to use server-side loaders for data fetching.

- [x] Task: Define TanStack Start loaders for the main cache info and asset list routes.
- [x] Task: Replace `useQuery` calls in routes with `useLoaderData`.
- [x] Task: Implement server-side pagination/streaming logic for asset lists in the loaders.
- [x] Task: Update the UI components to handle the pre-fetched loader data.
- [x] Task: Verify that navigation feels faster and that data is pre-rendered.

## Phase 3: JSON-Focused Asset View
Refactor the asset tables to display raw data in a flexible JSON format.

- [x] Task: Create a reusable `JsonAssetTable` component using `TanStack Table`.
- [x] Task: Implement a syntax-highlighted or interactive JSON view for the "Data" column.
- [x] Task: Update asset routes (Items, NPCs, Objects, etc.) to use the new `JsonAssetTable`.
- [x] Task: Implement expandable rows for detailed property inspection.
- [x] Task: Write tests for the `JsonAssetTable` component and its data formatting.

## Phase 4: Verification and Finalization
Ensure all features work together and meet the performance goals.

- [x] Task: Verify that large asset lists load efficiently using the new pagination/streaming.
- [x] Task: Perform a full build and run E2E tests to ensure no regressions.
- [x] Task: Conductor - User Manual Verification 'Frontend Performance & Asset View Refactor' (Protocol in workflow.md)

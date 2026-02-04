# Implementation Plan: Cache Type Alignment and Completion

This plan outlines the steps to align our cache type naming with `cache2` and ensure all types are represented with "End-to-End" support for asset counts.

## Phase 1: Research and Gap Analysis
Identify the full list of cache types from `cache2` and compare them with our current implementation.

- [x] Task: Research `cache2` source code to extract the complete list of supported types and their Index/Archive locations.
- [x] Task: Document the mapping and identify all missing types (e.g., DBTable, Textures, SpotAnims, etc.).

## Phase 2: Loader Naming Alignment
Update high-level structure naming in `@kurza/osrs-cache-loader` to match `cache2`.

- [x] Task: Update `AssetCounts` interface in `types.ts` to use consistent naming (e.g., `dbRow` instead of `dbRows` if that matches `cache2` more closely).
- [x] Task: Align high-level struct names (Struct, DBRow, DBTable, etc.) in the `Cache` class.

## Phase 3: Implement Missing Types in Loader
Add support for all missing types to `@kurza/osrs-cache-loader`.

- [x] Task: Update `Cache.load` to fetch all necessary indices for the newly identified types.
- [x] Task: Implement `getAssetCounts` logic for all missing types (identifying if they are archive-based or file-based within Index 2).
- [x] Task: Update `cache2-comparison.test.ts` to include comparison for all new types.
- [x] Task: Run tests and verify asset counts match `cache2` exactly.

## Phase 4: Viewer Integration
Ensure all new types are displayed in the `osrs-cache-viewer`.

- [x] Task: Update the `AssetMappings` component and any relevant types in the viewer to handle the expanded `AssetCounts`.
- [x] Task: Verify that the "Cache Metadata" section in the UI displays the correct counts for all types.

## Phase 5: Documentation and Final Polish [checkpoint: fda9e7e]
Update the documentation to reflect the full set of supported cache types.

- [x] Task: Update `osrs-cache-docs` API reference and research pages with the new types.
- [x] Task: Perform a final build and verification across the monorepo.
- [x] Task: Conductor - User Manual Verification 'Phase 5: Documentation and Final Polish' (Protocol in workflow.md)

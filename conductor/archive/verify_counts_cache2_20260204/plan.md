# Implementation Plan - Integration Test for Cache Asset Counts (cache2 Comparison)

This plan covers adding `cache2` as a dependency, implementing the comparison logic, and ensuring the test is a permanent part of the suite.

## Phase 1: Environment & Dependencies [checkpoint: ]

Goal: Prepare the loader package for integration with `cache2`.

- [x] Task: Install `cache2` and any required peer dependencies as dev-dependencies in `packages/osrs-cache-loader`.
- [x] Task: Research the `cache2` API to identify the correct methods for loading a remote/buffer-based cache and extracting asset counts.

## Phase 2: Integration Test Implementation [checkpoint: ]

Goal: Create the automated test comparing our loader results with `cache2`.

- [x] Task: Create `packages/osrs-cache-loader/src/cache2-comparison.test.ts`.
- [x] Task: Implement the "Red" phase: Write a test that attempts to compare counts (it will likely fail or be incomplete until the comparison logic is mapped).
- [x] Task: Map our `AssetCounts` categories to the corresponding `cache2` index/archive logic.
- [x] Task: Implement the "Green" phase: Write the logic to fetch the latest OpenRS2 cache, load it into both libraries, and assert equality.
- [x] Task: Verify that the test passes against the live OpenRS2 API.

## Phase 3: Final Verification & Cleanup [checkpoint: ]

Goal: End-to-end check, squashing, and archival.

- [x] Task: Run `pnpm run build` to ensure no dependency or type conflicts were introduced.
- [x] Task: Run the full test suite for `@kurza/osrs-cache-loader` to ensure no regressions.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Final Verification & Cleanup' (Protocol in workflow.md)
- [x] Task: Track Completion: Update registry, consolidate files, squash, and archive (Protocol in workflow.md).

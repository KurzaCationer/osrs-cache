# Implementation Plan: Integrate Asset Decoders and Update Gap Analysis

This plan outlines the steps to integrate existing asset decoders into the core API, update the documentation, and ensure the viewer UI reflects the decoded data.

## Phase 1: Core API Integration (Loader Package) [checkpoint: 5aa9438]
Goal: Update the `Cache` class to utilize specialized loaders for Enum, Struct, Param, Underlay, and Animation.

- [x] Task: Write unit tests in `packages/osrs-cache-loader` for `getAssets()` to verify decoded output for Enums, Structs, Params, Underlays, and Animations.
- [x] Task: Implement loader integration in `packages/osrs-cache-loader/src/index.ts` by mapping Archive IDs to their respective loader classes.
- [x] Task: Verify tests pass and ensure no regressions in existing Item/NPC/Object decoding.

## Phase 2: Documentation & Gap Analysis Update [checkpoint: 6e44b76]
Goal: Reflect the current state of decoding and research in the documentation.

- [x] Task: Update `reference-material/docs/cache-gap-analysis.md` to change status of Enum, Struct, Param, Underlay, and Animation from "Encoded" to "Decoded".
- [x] Task: Add explicit note in the "Identified Gaps" section of `cache-gap-analysis.md` regarding the pending status of Varbit research.

## Phase 3: UI Alignment & Final Verification [checkpoint: f5cf277]
Goal: Ensure the OSRS Cache Viewer correctly displays the new data and perform final checks.

- [x] Task: Manually verify that `osrs-cache-viewer` (Asset Browser) displays decoded fields for the new types.
- [x] Task: Update UI components in `apps/osrs-cache-viewer` if necessary to better handle the JSON structure of newly decoded assets.
- [x] Task: Run full project verification (`pnpm run check`) to ensure build and linting stability.
- [x] Task: Conductor - User Manual Verification 'Phase 3: UI Alignment & Final Verification' (Protocol in workflow.md)

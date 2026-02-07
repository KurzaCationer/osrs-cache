# Implementation Plan - Full Asset Decoding (Gap Fill)

This plan outlines the steps to integrate full decoding for Sprites, Database Tables/Rows, Health Bars, Hit Splats, and World Entities into the OSRS Cache toolkit.

## Phase 1: Library Integration - Basic Asset Types [checkpoint: b19dbd9]
Goal: Integrate decoders for Sprites, Health Bars, and Hit Splats into the `Cache` class.

- [x] Task: Write unit tests for Sprite, HealthBar, and Hitsplat decoding in `@kurza/osrs-cache-loader`.
- [x] Task: Update `Cache.getAssets` to support `sprite`, `healthBar`, and `hitsplat` types using the decoders in `src/cache/loaders/`.
- [x] Task: Ensure Sprite decoding returns raw palette and pixel data for frontend efficiency.
- [x] Task: Verify decoding results against `cache2` expectations.

## Phase 2: Library Integration - Database System [checkpoint: 1495f83]
Goal: Implement robust decoding for Database Tables and Rows, including index support.

- [x] Task: Write unit tests for `DBTable` and `DBRow` decoding.
- [x] Task: Implement/Update `DBTable`, `DBRow`, and `DBTableIndex` loaders to match `cache2` logic.
- [x] Task: Update `Cache.getAssets` to support `dbTable` and `dbRow` types.
- [x] Task: Add a helper method in `Cache` to retrieve `DBRows` by their `DBTableID`.

## Phase 3: Library Integration - World Entities & Parity [checkpoint: 994024a]
Goal: Complete library-level decoding and verify parity for all new types.

- [x] Task: Write unit tests for `WorldEntity` decoding.
- [x] Task: Update `Cache.getAssets` to support the `worldEntity` type.
- [x] Task: Run comprehensive integration tests to verify asset counts and data parity with `cache2`.

## Phase 4: Viewer - Sprite Rendering & UI [checkpoint: 43181d4]
Goal: Visualize Sprites and common properties in the Viewer.

- [x] Task: Create a `SpriteCanvas` component in `osrs-cache-viewer` to render raw pixel data.
- [x] Task: Add a "Download PNG" feature to the `SpriteCanvas` component.
- [x] Task: Update the Asset Browser to use `SpriteCanvas` when viewing `sprite` assets.
- [x] Task: Ensure Health Bars, Hit Splats, and World Entities use the `JsonView` for property inspection.

## Phase 5: Viewer - Database Browser Navigation [checkpoint: ad330c4]
Goal: Implement the "Table-First" navigation flow for Database assets.

- [x] Task: Implement a `DBTable` selection view in the Viewer.
- [x] Task: Create a filtered `DBRow` list view that updates based on the selected `DBTable`.
- [x] Task: Ensure high performance for `DBRow` display using virtualization.
- [x] Task: Final verification of all asset types in the browser.
- [x] Task: Conductor - User Manual Verification 'Phase 5: Viewer - Database Browser Navigation' (Protocol in workflow.md)

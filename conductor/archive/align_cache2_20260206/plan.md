# Implementation Plan: Align osrs-cache-loader with cache2

## Phase 1: Preparation & Environment Setup [checkpoint: 7a75302]

- [x] Task: Clone `cache2` repository to a temporary directory and record the path in `metadata.json`
- [x] Task: Remove existing high-noise test files in `packages/osrs-cache-loader/src` to clear the environment

## Phase 2: Core Architecture Refactor [checkpoint: 913f97a]

- [x] Task: Refactor the base `Cache` and `Index` management logic to align with `cache2`'s modular structure
- [x] Task: Implement a "Silent" Alignment Test Utility that compares local output with `cache2` and logs only unique errors/summaries

## Phase 3: Asset Type Implementation (TDD) [checkpoint: a0dd841]

- [x] Task: Implement and align Core Asset Loaders (Items, NPCs, Objects)
  - [ ] Write alignment tests for Items, NPCs, and Objects
  - [ ] Refactor/Implement loaders and models to pass tests
- [x] Task: Implement and align Data Asset Loaders (DBTables, World Entities, Enum, Struct, ClientVariable)
  - [ ] Write alignment tests for DBTables, World Entities, etc.
  - [ ] Implement loaders and models to pass tests
- [x] Task: Implement and align Resource Loaders (Maps, Audio, Models, Textures)
  - [ ] Write alignment tests for Maps, Audio, and Models
  - [ ] Implement loaders and models to pass tests

## Phase 4: Final Integration & Verification [checkpoint: f6e17ea]

- [x] Task: Verify overall package build and resolve any cross-package type issues in the Viewer
- [x] Task: Conductor - User Manual Verification 'Final Integration & Verification' (Protocol in workflow.md)

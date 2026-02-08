# Specification: Align osrs-cache-loader with cache2

## Overview

This track aims to refactor the `@kurza/osrs-cache-loader` package to achieve full feature and data parity with the `cache2` library. The current implementation is considered "messy" and needs to be redesigned to align with `cache2`'s modular parsing logic and data models. A key focus is on creating a robust, clean testing suite that verifies alignment without producing excessive log noise.

## Functional Requirements

- **Refactor Parser Logic:** Implement modular loaders that mirror `cache2`'s approach to handling various index types and asset formats.
- **Model Alignment:** Update TypeScript interfaces and classes to match the schema and property naming of `cache2`.
- **Full Asset Support:** Support all asset types provided by `cache2`, including Items, NPCs, Objects, Maps, DBTables, World Entities, etc.
- **Standalone Implementation:** The final library must not have any runtime dependency on `cache2`.
- **OpenRS2 Integration:** Ensure the refactored loaders correctly utilize the OpenRS2 API and local file fallback as defined in the product vision.

## Non-Functional Requirements

- **Clean Test Output:** Implement a testing strategy that logs only unique errors to prevent context bloat when processing large cache datasets.
- **Maintainability:** Refactor the codebase to be more modular and idiomatic TypeScript.
- **Performance:** Ensure that the alignment doesn't regression the performance of asset retrieval.

## Acceptance Criteria

- [ ] `osrs-cache-loader` can load every asset type supported by `cache2`.
- [ ] Asset counts and raw data properties match `cache2` exactly for a given cache version.
- [ ] Existing "noisy" tests are removed and replaced with a clean, summary-based validation suite.
- [ ] The library builds and runs without `cache2` as a dependency.
- [ ] Integration tests verify alignment by comparing output against a temporary clone of `cache2`.
- [ ] **Final Verification:** The system builds and runs successfully via `docker compose up --build -d`, and the results meet user expectations.

## Out of Scope

- Committing the `cache2` source code to the repository.
- Implementing UI changes in the `osrs-cache-viewer` (unless required by model changes).

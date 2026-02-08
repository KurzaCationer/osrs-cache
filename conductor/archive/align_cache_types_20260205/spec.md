# Specification: Cache Type Alignment and Completion

## Overview

The goal of this track is to achieve parity with `cache2` in terms of supported cache data types. We will ensure that every type represented in `cache2` (including Structs, DBRows, etc.) is represented in our repository with a consistent naming convention and "End-to-End" (E2E) support matching our current implementation standard (specifically the asset count and metadata display).

## Functional Requirements

- **Loader Alignment:** Update naming for high-level structures (e.g., `Struct`, `DBRow`, `DBTable`) in `@kurza/osrs-cache-loader` to match `cache2`.
- **Type Completion:** Identify all cache types present in `cache2` that are missing from our repository.
- **E2E Implementation (Current Spec):** For every missing type, implement:
  - Type definitions and interfaces.
  - Binary reader/parser logic (matching the level of detail of existing loaders).
  - Integration into the main `Cache` or `Reader` entry points to support asset counting.
- **Viewer Integration:** Ensure all newly added types are visible in the `osrs-cache-viewer` metadata/count summaries, matching the behavior of existing types like Items or NPCs.

## Non-Functional Requirements

- **Architectural Consistency:** New types must follow the exact same patterns (file structure, test style, export patterns) as existing types.
- **Verification:** Asset counts for all types (new and existing) must be verified against `cache2` output for a specific cache ID.

## Acceptance Criteria

- [ ] All cache types present in `cache2` have a corresponding loader implementation in our repo.
- [ ] High-level naming (Structs, DBRows, etc.) aligns with `cache2`.
- [ ] Asset counts for all implemented types match `cache2` exactly.
- [ ] The `osrs-cache-viewer` correctly displays the metadata and counts for all types.
- [ ] Unit tests exist for every new type loader.

## Out of Scope

- Implementing advanced features for new types (e.g., full 3D rendering for models if not already standard for all types).
- Changing internal field naming within definitions (only high-level structure names are being aligned).

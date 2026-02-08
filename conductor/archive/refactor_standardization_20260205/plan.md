# Plan: Comprehensive Codebase Refactor and Standardization

This plan outlines the systematic refactoring of the OSRS Cache monorepo to improve structure, eliminate duplication, and enforce documentation standards.

## Phase 1: Shared Utilities & Core Types [checkpoint: c8a729f]

Focus: Consolidation of foundational logic and types to provide a base for application-level refactoring.

- [x] Task: Refactor and Centralize Binary Parsing Utilities
  - [x] Write tests for shared binary utilities (buffer reading, smarts, etc.)
  - [x] Implement/Move shared binary utilities to a central location in `@kurza/osrs-cache-loader`
- [x] Task: Unify OpenRS2 API Client Logic
  - [x] Write tests for the unified API client (fetch wrappers, error handling)
  - [x] Implement the unified client and update existing references
- [x] Task: Centralize Shared Data Models and Types
  - [x] Identify and move redundant type definitions to a shared `types.ts` or similar central file
- [x] Task: Enhance `internal/ui-preset` for Global Usage
  - [x] Audit existing static styles in apps
  - [x] Add missing tokens and presets to `internal/ui-preset` to cover all application needs

## Phase 2: Loader Package Refactoring [checkpoint: 774804a]

Focus: Improving the core library's API consistency, readability, and documentation.

- [x] Task: Implement Standardized Loader API Patterns
  - [x] Write tests for the refactored Loader API (e.g., Factory-based readers)
  - [x] Refactor the Loader API structure for consistency across different asset types
- [x] Task: Comprehensive TSDoc and Readability Refactor
  - [x] Add TSDoc to all exported classes, interfaces, and functions in `@kurza/osrs-cache-loader`
  - [x] Refactor complex/bitwise logic blocks to be self-documenting and expressive

## Phase 3: UI & Application Standardization [checkpoint: db29ce3]

Focus: Unifying the Viewer and Docs applications through shared components and centralized styling.

- [x] Task: Extract Shared UI Components
  - [x] Identify common components (Loaders, Buttons, Layouts) used in both apps
  - [x] Move these to a shared internal package or common directory with corresponding tests
- [x] Task: Migrate `osrs-cache-viewer` Styling to UI Preset
  - [x] Replace all hardcoded/static CSS in the Viewer with `internal/ui-preset` tokens
- [x] Task: Migrate `osrs-cache-docs` Styling to UI Preset
  - [x] Replace all hardcoded/static CSS in the Docs with `internal/ui-preset` tokens
- [x] Task: Complete Documentation Pass for Applications
  - [x] Apply TSDoc/JSDoc to all exported symbols within the Viewer and Docs apps

## Phase 4: Verification & Final Polish

Focus: Ensuring system-wide stability and adherence to the new standards.

- [x] Task: Run Comprehensive Verification Suite
  - [x] Execute full `pnpm run check` (build, lint, test) across the entire monorepo
- [x] Task: Conductor - User Manual Verification 'Final Polish' (Protocol in workflow.md)

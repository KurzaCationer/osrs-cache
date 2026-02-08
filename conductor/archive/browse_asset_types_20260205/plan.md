# Implementation Plan: Asset Type Browsing (`browse_asset_types`)

## Phase 1: Foundation & Routing [checkpoint: 0cad8a0]

Setup the dynamic routing structure and basic page layout for the browsing experience.

- [x] Task: Define dynamic route for `/browse/$type` in `osrs-cache-viewer`
- [x] Task: Create a basic layout component for the Asset Type Detail Page
- [x] Task: Update the `AssetSummaryTable` to link each type to its corresponding `/browse/$type` route

## Phase 2: Data Fetching & State [checkpoint: 3dc0d6e]

Implement the data fetching logic to retrieve individual asset records from the loader package.

- [x] Task: Define TanStack Query hooks for fetching all assets of a specific type
- [x] Task: Implement API endpoints (or internal loader calls) to support paginated/filtered asset retrieval
- [x] Task: Add loading and error states for the asset type detail page

## Phase 3: Dynamic Table Implementation [checkpoint: 3dc0d6e]

Build the core table UI that dynamically adapts to different asset properties.

- [x] Task: Create a generic `AssetDataTable` component using TanStack Table
- [x] Task: Implement column definition logic that extracts keys from the first few assets of a type
- [x] Task: Implement client-side searching by name and ID within the `AssetDataTable`
- [x] Task: Implement pagination or virtualization to handle large datasets (e.g., Items, Objects)

## Phase 4: Refinement & Verification [checkpoint: 551774f]

Final polish, performance optimization, and comprehensive testing.

- [x] Task: Optimize table rendering performance for large asset lists
- [x] Task: Ensure all supported asset types (Items, NPCs, Objects, etc.) render correctly
- [x] Task: Add unit tests for `AssetDataTable` and routing logic
- [x] Task: Conductor - User Manual Verification 'Phase 4: Refinement & Verification' (Protocol in workflow.md). **Note:** Run `docker compose up --build -d` to verify the UI at http://localhost:3000.

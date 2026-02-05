# Plan: Asset Type Table View

This plan outlines the steps to replace the current grid-based summary cards with a detailed, expandable table using TanStack Table.

## Phase 1: Foundation & Component Structure
- [x] Task: Create `AssetSummaryTable` component skeleton
    - [x] Create `apps/osrs-cache-viewer/src/components/AssetSummaryTable.tsx`
    - [x] Define column structures for: Asset Type (Icon/Name), Count, Percentage, and OpenRS2 Mapping
- [x] Task: Implement Type-Safe Table Definition
    - [x] Define `AssetSummaryRow` interface based on `CacheMetadata['counts']`
    - [x] Create helper to calculate percentages from total assets

## Phase 2: Core Table Implementation (TDD)
- [x] Task: Write tests for Table Data Transformation
    - [x] Create `apps/osrs-cache-viewer/src/components/AssetSummaryTable.test.tsx`
    - [x] Verify percentage calculations and mapping lookups
- [x] Task: Implement Table Rendering logic
    - [x] Integrate `@tanstack/react-table` hooks
    - [x] Map `CacheMetadata` to table rows
- [x] Task: Implement Sorting and Styling
    - [x] Add sort icons and header click handlers
    - [x] Style table, headers, and rows using PandaCSS recipes

## Phase 3: Integration & Expansion [checkpoint: 57244ac]
- [x] Task: Replace Grid with Table on Home Page
    - [x] Update `apps/osrs-cache-viewer/src/routes/index.tsx` to use `AssetSummaryTable`
    - [x] Remove legacy `CountCard` and grid layout
- [x] Task: Implement Row Expansion
    - [x] Add expansion state to the table
    - [x] Create expanded row sub-component showing Index/Archive technical details
- [x] Task: Verify Responsiveness and Polish
    - [x] Ensure horizontal scrolling for small screens
    - [x] Final visual check against "Modern OSRS Fusion" guidelines
- [x] Task: Conductor - User Manual Verification 'Integration & Expansion' (Protocol in workflow.md)
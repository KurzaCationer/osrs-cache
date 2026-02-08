# Implementation Plan: Frontend Table and Detail View Alignment

This plan outlines the steps to unify the table styling across the `osrs-cache-viewer` application, creating a reusable `StandardTable` component, and fixing specific UI inconsistencies in the Cache Insights and Detail views.

## Phase 1: Foundation & Component Creation [checkpoint: 63fc44e]
This phase focuses on extracting the existing "Asset Browser" table style and encapsulating it into a reusable `StandardTable` component using PandaCSS.

- [x] Task: Audit existing `AssetBrowser` table implementation for PandaCSS patterns
- [x] Task: Create a new `StandardTable` component in `apps/osrs-cache-viewer/src/components/`
    - [x] Implement consistent header styling
    - [x] Implement consistent row padding and height
    - [x] Ensure support for virtualized (TanStack Virtual) and non-virtualized modes
- [x] Task: Write unit tests for `StandardTable` to ensure it renders rows and headers correctly

## Phase 2: Refactor Asset Browser & Detail Views [checkpoint: 7ab41cc]
In this phase, we migrate the primary Asset Browser list to the new component and fix the property counter in the detail view.

- [x] Task: Replace the custom table logic in `AssetBrowser` with the `StandardTable` component
- [x] Task: Update the Asset Detail view (property list)
    - [x] Fix label from "Items" to "Properties"
    - [x] Increase text contrast for the property counter
    - [x] Ensure alignment with the project's typography standards
- [x] Task: Verify detail view changes with manual visual check

## Phase 3: Cache Insights Alignment [checkpoint: 2f606bf]
This phase addresses the row-based layout and color inconsistencies in the Cache Insights view.

- [x] Task: Refactor the technical summary in Cache Insights
    - [x] Implement a two-column row layout with clear separation
    - [x] Standardize text colors for labels and values
    - [x] Fix "Last Refreshed" date styling (font size, color, alignment)
- [x] Task: Implement a unified loading state for the technical summary
- [x] Task: Verify visual consistency between Cache Insights and the Asset Browser

## Phase 4: Final Verification & Cleanup [checkpoint: ed49fd8]
Final check of the entire application's table styling and documentation.

- [x] Task: Global CSS audit for any remaining hardcoded table colors/styles
- [x] Task: Run full build and linting checks (`pnpm run build && pnpm run lint`)
- [x] Task: Conductor - User Manual Verification 'Phase 4: Final Verification & Cleanup' (Protocol in workflow.md)

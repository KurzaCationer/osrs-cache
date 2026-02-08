# Specification: Frontend Table and Detail View Alignment

## Overview

This track aims to resolve styling inconsistencies across the `osrs-cache-viewer` application. Specifically, it focuses on aligning the visual style of all tables/lists to a new "Standard Table" component (modeled after the current Asset Browser), fixing layout and color issues in the Cache Insights view, and improving the usability of the Asset Detail view's property counter.

## Functional Requirements

### 1. Unified "Standard Table" Component

- Create a reusable table component using PandaCSS that mirrors the style of the current Asset Browser list.
- Implement consistent padding, row height, and typography across all application tables.
- Ensure support for both column-based (Asset Browser) and row-based (Cache Insights) data displays.

### 2. Cache Insights Refinement

- **Layout:** Align the technical summary rows to a clear two-column structure with distinct separation between labels and values.
- **Typography & Color:** Standardize text colors for labels and values to remove "different CSS color" inconsistencies.
- **Last Refreshed:** Standardize the font size, alignment, and color of the "Last Refreshed" date to match the rest of the technical summary.
- **States:** Implement a consistent loading state for the technical summary data.

### 3. Asset Detail View Enhancements

- **Label Correction:** Rename the "Items" counter to "Properties" (e.g., "5 Properties").
- **Contrast Improvement:** Increase the contrast of the property counter to ensure it is clearly visible against the background.
- **Visual Style:** Maintain the existing layout but ensure colors and typography align with the project's design standards.

## Non-Functional Requirements

- **Styling:** Use PandaCSS for all UI changes, following the existing patterns in the project.
- **Performance:** Ensure virtualized tables (where used) maintain high performance after restyling.

## Acceptance Criteria

- All tables in the application (Asset Browser, Cache Insights, etc.) share a unified visual identity.
- Cache Insights layout is clean, rows are separated, and the "Last Refreshed" date is styled consistently.
- Asset Detail view displays a high-contrast "X Properties" label.
- The `Standard Table` component is documented and used as the primary table implementation.

## Out of Scope

- Adding new functional asset types or data sources.
- Significant changes to the Map Explorer or Media Player core logic.

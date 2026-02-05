# Spec: Asset Type Table View

## Overview
This track replaces the current grid of "Count Cards" on the viewer's index page with a sophisticated, sortable table using TanStack Table. This move provides a more dense and professional interface for exploring the high-level contents of an OSRS cache.

## Functional Requirements
- **TanStack Table Integration:** Implement the summary list using `@tanstack/react-table`.
- **Asset Type Rows:** Each row represents one supported asset type (Items, NPCs, Objects, etc.).
- **Expandable Interface:** Rows should be expandable in-place (Sub-component) to reveal additional metadata or context about that specific archive (e.g., raw index/archive numbers).
- **Columns:**
    - **Asset Type:** Icon and Name (e.g., 📦 Items).
    - **Count:** Total number of assets found in the cache.
    - **Percentage:** The proportion of total cache files this type represents.
    - **OpenRS2 Mapping:** Technical details showing the Index and Archive source.
- **Sorting:** Users should be able to sort the table by Name, Count, or Percentage.

## Non-Functional Requirements
- **Design Consistency:** Maintain the "Modern OSRS Fusion" aesthetic using PandaCSS.
- **Type Safety:** Use TypeScript for all table definitions and data mapping.
- **Responsiveness:** Ensure the table scrolls horizontally or collapses gracefully on mobile devices.

## Acceptance Criteria
- [ ] The Home page replaces the grid of cards with a TanStack Table.
- [ ] Clicking a row expands it to show detailed mapping information.
- [ ] Sorting functionality is operational for at least 'Name' and 'Count' columns.
- [ ] Percentages are calculated correctly against the total sum of all asset counts.
- [ ] The UI remains responsive and follows existing PandaCSS styling patterns.

## Out of Scope
- Browsing individual assets (e.g., listing all 25k items) is not part of this track.
- Modifications to the `@kurza/osrs-cache-loader` package.

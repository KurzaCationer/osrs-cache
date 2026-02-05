# Specification: Asset Type Browsing (`browse_asset_types`)

## Overview
Implement the ability to browse individual assets for every supported asset type in the OSRS cache. This involves creating dynamic routes and searchable tables that display the underlying data for items, NPCs, objects, and other cached entities.

## User Stories
- As a user, I want to click on an asset type (like "Items") from the main summary table and see a list of all items in the cache.
- As a user, I want to search for specific assets within an asset type (e.g., searching for "Abyssal whip" in the Items table).
- As a researcher, I want to see the raw properties of each asset in a structured table format.

## Functional Requirements

### 1. Dynamic Asset Browsing
- Implement dynamic routing for asset types using the pattern `/browse/:type` (e.g., `/browse/items`, `/browse/npcs`).
- Fetch asset data from `@kurza/osrs-cache-loader` via TanStack Query.

### 2. Asset Type Detail Page
- Display a searchable table containing all individual assets of the selected type.
- Each row in the table represents one asset (e.g., Item ID 4151).
- Columns should dynamically reflect the properties available for that asset type.

### 3. Navigation
- Integrate navigation from the existing Asset Summary Table (Index) to the new `/browse/:type` pages.

## Technical Requirements
- **Frontend Framework:** TanStack Start / React.
- **Routing:** TanStack Router for type-safe dynamic routes.
- **Data Fetching:** TanStack Query.
- **Table Implementation:** TanStack Table (consistent with existing UI components).
- **Styling:** PandaCSS.

## Acceptance Criteria
- [ ] Users can navigate from the main index to a specific asset type page.
- [ ] The `/browse/:type` route correctly loads and displays data for all supported asset types.
- [ ] The asset tables are searchable by name or ID.
- [ ] The table columns accurately represent the properties of the asset type.
- [ ] The implementation handles large datasets (e.g., 25,000+ items) efficiently with pagination or virtualization.

## Out of Scope
- Detailed individual asset detail pages (beyond the row in the table).
- 3D model rendering within the table rows (to be handled in a future track).
- Complex relationships between different data types.

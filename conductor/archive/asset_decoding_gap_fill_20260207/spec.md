# Track Specification: Full Asset Decoding (Gap Fill)

## Overview
This track aims to achieve full decoding parity with `cache2` for several key asset types that are currently displayed as "Encoded" or "Archive" in the OSRS Cache Viewer. This includes Database Tables/Rows, Sprites, Health Bars, Hit Splats, and World Entities. The implementation involves integrating existing decoders into the `@kurza/osrs-cache-loader` library and creating specific frontend components for visualization, particularly for Sprites and Database navigation.

## Functional Requirements

### 1. Library Integration (`@kurza/osrs-cache-loader`)
- **Integration:** Update `Cache.getAssets` to utilize the decoders located in `src/cache/loaders/` (ported from `cache2`) for the following types:
    - **Sprites:** Index 8.
    - **Database Tables:** Index 2, Archive 39.
    - **Database Rows:** Index 2, Archive 38.
    - **Health Bars:** Index 2, Archive 33.
    - **Hit Splats:** Index 2, Archive 32.
    - **World Entities:** Index 2, Archive 72.
- **Sprite Efficiency:** The library must return raw palette and indexed pixel data to the frontend to minimize network payload.

### 2. Frontend Visualization (`osrs-cache-viewer`)
- **Sprite Component:**
    - Render raw sprite data using an HTML5 `<canvas>`.
    - Provide a "Download" button to export the sprite as a PNG.
- **Database Browser:**
    - Implement a "Table-First" navigation flow.
    - Users should first browse/search a list of `DBTables`.
    - Selecting a table should display a filtered view of its associated `DBRows`.
- **Property View:** Use the existing collapsible JSON tree view for Health Bars, Hit Splats, and World Entities, ensuring all decoded fields (matching `cache2` output) are visible.

## Non-Functional Requirements
- **Performance:** Ensure virtualized tables are used for large datasets like Database Rows.
- **Parity:** Asset counts and decoded field values must match the "Source of Truth" (`cache2`) exactly.

## Acceptance Criteria
- [ ] Sprites are rendered as images in the viewer and can be downloaded as PNGs.
- [ ] `DBTables` can be browsed, and their corresponding `DBRows` are accessible via a drill-down interface.
- [ ] Health Bars, Hit Splats, and World Entities display their full decoded property sets.
- [ ] No "Encoded" or "Archive" placeholders remain for these 5 asset types in the Asset Browser.
- [ ] Asset counts for these types align with `cache2` integration tests.

## Out of Scope
- Advanced 3D visualization for World Entities.
- Editing or modifying cache data.

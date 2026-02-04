# Track Specification: Fix and Expand Cache Data Loaders

**Overview**
The current cache summary in the viewer is limited to 5 hardcoded categories and reports zero for Items, NPCs, and Objects because it relies on non-existent metadata fields from the OpenRS2 API. This track will fix the data fetching logic to accurately count assets and expand the summary to include all available asset categories.

**Functional Requirements**
1. **Accurate Asset Counting:**
   - Update `@kurza/osrs-cache-loader` to fetch asset counts by querying the OpenRS2 API for specific archive/index metadata.
   - Specifically, use the count of files within Config archives (Index 2) and other relevant indices (Sprites, Maps, etc.).
2. **Expand Asset Categories:**
   - Include all categories supported by the underlying cache structure (Items, NPCs, Objects, Enums, Animations, Structs, Sprites, Maps, Underlays, etc.).
3. **Dynamic Frontend Rendering:**
   - Modify the `osrs-cache-viewer` to dynamically render `CountCard` components for every category returned by the loader, rather than using hardcoded cards.
   - Implement a flexible icon/color mapping for the new categories.

**Acceptance Criteria**
- The Home page displays more than 5 categories.
- Items, NPCs, and Objects show their actual counts (e.g., ~28,000 items) instead of 0.
- The UI remains responsive and visually consistent with the new cards.
- The loader correctly handles the latest OSRS cache from OpenRS2.

**Out of Scope**
- Detailed individual asset viewing (this track is for the summary only).
- Local cache loading (staying focused on OpenRS2 for now).

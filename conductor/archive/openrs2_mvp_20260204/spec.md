# Specification: OpenRS2 Cache Loading MVP

## Overview
Implement a Minimum Viable Product (MVP) that enables the `@kurza/osrs-cache-loader` package to fetch OSRS cache data from the OpenRS2 API. The `osrs-cache-viewer` application will be simplified to a single index page that displays a summary of the total counts for various asset categories. Additionally, initial documentation for the library and application will be established in the `osrs-cache-docs` project.

## Functional Requirements

### 1. OSRS Cache Loader (`@kurza/osrs-cache-loader`)
- Implement fetching logic to interact with the [OpenRS2 Archive API](https://archive.openrs2.org/api).
- Provide a high-level function to load the cache and return counts for the following categories:
    - Items
    - NPCs
    - Objects
    - Maps
    - Audio
- **Error Handling:** If the OpenRS2 API is unreachable or returns an error, the loading process must fail immediately with a descriptive error message.

### 2. OSRS Cache Viewer (`osrs-cache-viewer`)
- **Page Consolidation:** Remove all existing demo and placeholder pages.
- **Index Page:** Create a single, well-styled index page using PandaCSS.
- **Data Fetching:** Use TanStack Start server functions to trigger the cache loading and asset counting on the server-side.
- **Display:** Show a summary of the asset counts (Items, NPCs, Objects, Maps, Audio) in a clean, professional UI.

### 3. Documentation (`osrs-cache-docs`)
- Create an initial "Getting Started" or "Overview" page in the documentation site.
- Document the basic usage of the `@kurza/osrs-cache-loader` for fetching from OpenRS2.
- Provide a high-level overview of the OSRS Cache Viewer's purpose and current MVP state.

## Non-Functional Requirements
- **Styling:** Adhere to the project's use of PandaCSS for type-safe, build-time CSS.
- **Type Safety:** Ensure end-to-end type safety from the loader package through the server functions to the frontend.

## Acceptance Criteria
- [ ] `@kurza/osrs-cache-loader` successfully fetches data from OpenRS2.
- [ ] `osrs-cache-viewer` displays accurate counts for Items, NPCs, Objects, Maps, and Audio on the index page.
- [ ] The viewer app consists only of a single index page with no broken links to removed pages.
- [ ] Loading failures are handled gracefully with an error message displayed to the user.
- [ ] Initial documentation is present in `osrs-cache-docs` and reflects the MVP state.
- [ ] All code passes the project's linting and type-checking suites.

## Out of Scope
- Local cache file fallback (to be implemented in a future track).
- Detailed asset inspection or 3D previews.
- Map explorer or media player functionality.

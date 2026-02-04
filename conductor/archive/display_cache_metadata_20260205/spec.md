# Specification: Display Cache Metadata on Index Page

## Overview
This track aims to enhance the OSRS Cache Viewer's index page by displaying detailed metadata about the currently loaded cache, moving beyond simple asset counts. This will provide users with essential context such as the build version, source, and archival timestamp.

## Functional Requirements
- **Metadata Retrieval:** Implement a new `getMetadata` function in the `@kurza/osrs-cache-loader` package.
  - This function must return:
    - OpenRS2 Cache ID
    - OSRS Build Version (e.g., "Build #227")
    - Archive Timestamp
    - Source (e.g., "OpenRS2 Archive")
    - Asset Counts (by internally calling the existing counts logic)
- **Frontend Integration:**
  - Update the Viewer's index page to fetch data using this new `getMetadata` endpoint/function.
  - Display the retrieved metadata clearly on the index page.

## Non-Functional Requirements
- **Type Safety:** Ensure all new metadata structures are strictly typed in both the loader and viewer.
- **Data Consistency:** The `getMetadata` function should serve as a single source of truth for the current cache state on the index page.

## Acceptance Criteria
- [ ] The loader package has a `getMetadata` function that returns the required fields + counts.
- [ ] The Viewer index page displays the Cache ID, Build Version, Timestamp, and Source.
- [ ] Asset counts continue to be displayed correctly on the index page.
- [ ] The implementation follows existing TDD and project styling (PandaCSS) patterns.

## Out of Scope
- Displaying metadata for multiple caches simultaneously.
- Modifying the underlying OpenRS2 client fetching logic (unless required to extract metadata).

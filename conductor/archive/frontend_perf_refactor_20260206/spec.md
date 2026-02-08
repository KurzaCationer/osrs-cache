# Specification: Frontend Performance & Asset View Refactor

## Overview

This track aims to improve the performance and maintainability of the OSRS Cache Viewer by implementing server-side persistent caching, migrating to TanStack Start's `useLoaderData` for pre-rendered route data, and simplifying the asset browser to use a flexible JSON-based display.

## Functional Requirements

### 1. Server-Side Cache Persistence

- Implement a system-wide persistent storage mechanism for OSRS caches downloaded from OpenRS2.
- **Storage Location:** Use OS-standard data directories (e.g., `~/.local/share/osrs-cache` on Linux, `%AppData%/osrs-cache` on Windows).
- **Behavior:** The server should check this local directory before attempting to download a cache from OpenRS2. If the cache (by ID) already exists, it should be loaded from disk.

### 2. Route Data Loading (TanStack Start)

- Migrate asset and cache data fetching from client-side `useQuery` to server-side `useLoaderData` using TanStack Start's routing and loader system.
- **Performance:** Ensure routes load quickly by pre-fetching necessary data on the server.
- **Large Datasets:** Implement server-side pagination/streaming for asset lists (e.g., Items, NPCs) to ensure the UI remains responsive even with 20,000+ items.

### 3. JSON-Focused Asset Table

- Replace the existing highly-customized asset tables (which often have empty columns) with a simplified, flexible view.
- **Format:** Display assets in a table with minimal core columns (e.g., ID, Name) and a primary "Data" column containing the full asset properties as a formatted JSON object.
- **Interaction:** Support expandable rows or an interactive JSON tree view to explore complex asset properties.

## Non-Functional Requirements

- **Type Safety:** Maintain strict TypeScript typing for all loader data and JSON schemas.
- **Efficiency:** Minimize server-to-client payload size by only sending necessary data for the current view/page.

## Acceptance Criteria

- [ ] OSRS caches are stored in and retrieved from the OS-standard data directory.
- [ ] Navigating to an asset route (e.g., `/items`) uses `useLoaderData` to fetch data before rendering.
- [ ] Asset tables display a formatted JSON representation of the asset data.
- [ ] Large asset lists use server-side pagination/streaming to prevent browser lag.

## Out of Scope

- Migrating the Map Explorer or Media Player to this new JSON-only table format (unless it shares the same underlying asset list component).
- Implementing client-side IndexedDB caching.

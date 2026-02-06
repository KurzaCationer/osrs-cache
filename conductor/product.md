# Initial Concept
So I want to replace TailwindCSS with PandaCSS like it is in the docs project :). that should be the first task. But for the requirements part: A, and the library should have an option to find the local osrs files for the cache, but the main feature should be to take the caches from https://archive.openrs2.org/api

# Product Definition

## Vision
The goal is to create a comprehensive toolkit for exploring and interacting with Old School RuneScape (OSRS) cache data. This includes a high-performance library for parsing cache files (fetching primarily from the OpenRS2 API with local file fallback), a modern web-based viewer for visualizing game assets, and a documentation hub that serves as both a library reference and a repository of cache structure research.

## Target Audience
- **Developers:** Looking for a robust, abstract interface to programmatically access OSRS assets without dealing with low-level binary parsing.
- **Enthusiasts/Researchers:** Interested in exploring game data, maps, and audio, or understanding the underlying file structures.

## Core Features

### 1. OSRS Cache Loader Package (`@kurza/osrs-cache-loader`)
- **Abstracted Data Access:** Provide a high-level API to easily retrieve game assets like Items, NPCs, Objects, Maps, and Audio. Achieve full parity with `cache2` for asset counts and data models across all supported types (including DBTables, World Entities, and more). Features a modular binary cache parser aligned with industry standards for accurate asset extraction and raw data access from OpenRS2.
- **OpenRS2 Integration:** Native support for fetching cache data directly from the [OpenRS2 Archive API](https://archive.openrs2.org/api).
- **Local File Support:** Option to locate and read cache files from a local OSRS installation.
- **Asset Export:** Capabilities to export models, textures, and sounds (as mentioned for the loader layer).

### 2. OSRS Cache Viewer App (`osrs-cache-viewer`)
    - **Asset Browser:** User-friendly interface to browse and search for every supported asset type in the cache (Items, NPCs, Objects, etc.). Features high-performance virtualized tables for large datasets and client-side filtering.- **Cache Insights:** Provides detailed context for the currently loaded cache, including OpenRS2 ID, OSRS build version, archival source, and a sortable technical summary of all loaded asset types.
- **Map Explorer:** Interactive viewer for game maps and landscapes.
- **Media Player:** Interface for listening to game music and sound effects.
- **Styling:** Uses **PandaCSS** for type-safe styling (aligned with the documentation project).

### 3. Documentation Site (`osrs-cache-docs`)
- **Library API Reference:** Comprehensive documentation for `@kurza/osrs-cache-loader`.
- **Cache Research:** A central location for documenting findings on the OSRS cache structure and file formats.
- **Content Index:** An index of cache contents to aid in navigation and understanding.

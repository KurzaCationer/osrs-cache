# Getting Started

Welcome to the OSRS Cache project documentation. This toolkit is designed for exploring and interacting with Old School RuneScape (OSRS) cache data.

## Project Overview

The project consists of three main parts:

1. **`@kurza/osrs-cache-loader`**: A TypeScript library for fetching and parsing OSRS cache data.
2. **`osrs-cache-viewer`**: A web application for visualizing game assets.
3. **`osrs-cache-docs`**: This documentation site.

## Using the Loader

The `@kurza/osrs-cache-loader` package provides an easy way to fetch cache metadata and asset counts from the OpenRS2 Archive API.

### Installation

```bash
pnpm add @kurza/osrs-cache-loader
```

### Basic Usage

```typescript
import { loadCache } from '@kurza/osrs-cache-loader'

async function main() {
  const counts = await loadCache({ game: 'oldschool' })
  console.log('Asset Counts:', counts)
  // Output: { item: 32997, npc: 15575, obj: 60661, map: 17408, ... }
}

main()
```

## OSRS Cache Viewer

The viewer application provides a comprehensive dashboard showing the summary of assets loaded from the latest OSRS cache.

### Current Features

- Integration with OpenRS2 API.
- Full parity with `cache2` for asset counts (Items, NPCs, Objects, DBTables, etc.).
- Modern UI built with TanStack Start and PandaCSS.

## Next Steps

- Implement local cache file support.
- Add 3D asset previews for Items, NPCs, and Objects.
- Develop the Map Explorer and Media Player.

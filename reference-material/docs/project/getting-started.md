---
name: Getting Started
description: Overview of the OSRS Cache project, loader usage, and viewer status.
---
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
import { loadCache } from '@kurza/osrs-cache-loader';

async function main() {
  const counts = await loadCache({ game: 'osrs' });
  console.log('Asset Counts:', counts);
  // Output: { items: 25000, npcs: 10000, objects: 45000, maps: 500, audio: 1200 }
}

main();
```

## OSRS Cache Viewer (MVP)

The viewer application is currently in its MVP stage. It provides a single dashboard showing the summary of assets loaded from the latest OSRS cache.

### Current Features
- Integration with OpenRS2 API.
- Summary of total counts for Items, NPCs, Objects, Maps, and Audio.
- Modern UI built with TanStack Start and PandaCSS.

## Next Steps
- Implement local cache file support.
- Add 3D asset previews for Items, NPCs, and Objects.
- Develop the Map Explorer and Media Player.

# Cache Decoding Gap Analysis

This document outlines the discrepancies in asset decoding capabilities between `@kurza/osrs-cache-loader` and the `cache2` library, as well as general gaps in OSRS asset decoding.

## Decoding Parity with Cache2

The following table compares the asset loaders present in `cache2` (TypeScript version) and `@kurza/osrs-cache-loader`.

| Asset Type | Index | Archive | Status (cache2) | Status (osrs-cache-loader) | Implementation Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Item** | 2 | 10 | Decoded | Decoded | Both have full decoding logic (opcodes, params). |
| **NPC** | 2 | 9 | Decoded | Decoded | Both have full decoding logic (opcodes, transforms). |
| **Object** | 2 | 6 | Decoded | Decoded | Both have full decoding logic (opcodes, models). |
| **Enum** | 2 | 8 | Decoded | Decoded | Integrated into `getAssets`. |
| **Struct** | 2 | 34 | Decoded | Decoded | Integrated into `getAssets`. |
| **Param** | 2 | 11 | Decoded | Decoded | Integrated into `getAssets`. |
| **Underlay** | 2 | 1 | Decoded | Decoded | Integrated into `getAssets`. |
| **Animation** | 2 | 12 | Decoded | Decoded | Integrated into `getAssets`. |
| **Hitsplat** | 2 | 32 | Decoded | Encoded* | Logic exists in `cache/loaders/Hitsplat.ts` but not integrated into `getAssets`. |
| **HealthBar** | 2 | 33 | Decoded | Encoded* | Logic exists in `cache/loaders/HealthBar.ts` but not integrated into `getAssets`. |
| **DBRow** | 2 | 38 | Decoded | Encoded* | Logic exists in `cache/loaders/DBRow.ts` but not integrated into `getAssets`. |
| **DBTable** | 2 | 39 | Decoded | Encoded* | Logic exists in `cache/loaders/DBRow.ts` but not integrated into `getAssets`. |
| **WorldEntity** | 2 | 72 | Decoded | Encoded* | Logic exists in `cache/loaders/WorldEntity.ts` but not integrated into `getAssets`. |
| **Sprite** | 8 | - | Decoded | Encoded* | Logic exists in `cache/loaders/Sprite.ts` but not integrated into `getAssets`. |
| **GameVal** | 24 | - | Decoded | Encoded* | Logic exists in `cache/loaders/GameVal.ts` but not integrated into `getAssets`. |

*\*Encoded indicates the raw data is accessible, and the decoding logic is available in the codebase (aligned with cache2), but the main `getAssets` entry point is not yet utilizing these decoders.*

## Identified Gaps (Missing in Both)

The following asset types are commonly required but are currently **not implemented** in either library's TypeScript source:

| Asset Type | Index | Archive | Priority | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Varbit** | 2 | 69 | High | Essential for mapping variable bits to player variables. **Status: Pending Research.** |
| **SpotAnim** | 2 | 13 | Medium | Graphic effects (e.g., spell impact, level up). |
| **Overlay** | 2 | 4 | Medium | Map floor overlays (textures/colors over tiles). |
| **Identity Kit** | 2 | 3 | Low | Character appearance parts (heads, chests, etc.). |
| **Inventory** | 2 | 14 | Low | Container configurations. |
| **Font** | 13 | - | Low | Bitmap fonts. |

## Implementation Details for Gaps (Source: Cache2 Research)

For the types already in `cache/loaders/`, implementation logic (opcodes and structures) is available. Enum, Struct, Param, Underlay, and Animation are now fully integrated.

For types missing in both (like Varbit, SpotAnim), further research into Java-based cache libraries (e.g., RuneLite, OpenRS2) is required to extract opcodes.

## Prioritized Implementation Roadmap

1.  **[Completed]** Refactor `packages/osrs-cache-loader/src/index.ts` to use the existing `cache/loaders/` for Enum, Struct, Param, Underlay, and Animation.
2.  **High Priority (New Logic):** Research and implement `Varbit` decoding.
3.  **Medium Priority (Integration):** Integrate remaining loaders (Hitsplat, HealthBar, DBRow, etc.) into `getAssets`.
4.  **Medium Priority (New Logic):** Research and implement `SpotAnim` and `Overlay` decoding.
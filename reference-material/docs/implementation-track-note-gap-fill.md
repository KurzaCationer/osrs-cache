# Implementation Track Note: Filling the Decoding Gaps

## Summary

The gap analysis between `@kurza/osrs-cache-loader` and `cache2` revealed that while we have imported most of the decoding logic into `cache/loaders/`, many of these decoders are not yet integrated into the main `Cache.getAssets()` API. Additionally, certain essential types like `Varbit` are missing from both libraries.

## Next Track Objectives

The following objectives are recommended for the subsequent implementation track:

1.  **Refactor `getAssets` for Full Integration:**
    - Update `packages/osrs-cache-loader/src/index.ts` to use the specialized decoders in `src/cache/loaders/` for:
      - `Enum` (Archive 8)
      - `Struct` (Archive 34)
      - `Param` (Archive 11)
      - `Underlay` (Archive 1)
      - `Animation` (Archive 12)
    - Ensure these types are no longer marked as "Encoded" in the Asset Browser UI.

2.  **Implement Varbit Decoding:**
    - Since `Varbit` (Archive 69) is missing in `cache2`, research its structure (e.g., from RuneLite or OpenRS2 Java sources).
    - Implement `Varbit.ts` in `src/cache/loaders/`.
    - Integrate into `getAssets`.

3.  **UI Alignment:**
    - Ensure the `AssetBrowser` in the viewer application correctly displays the newly decoded fields (e.g., Enum maps, Struct params).

## Key Implementation References

- `reference-material/docs/cache-gap-analysis.md`: Detailed table of gaps and parity.
- `packages/osrs-cache-loader/src/cache/loaders/`: Existing (but underutilized) decoding logic.
- `packages/osrs-cache-loader/src/index.ts`: The `getAssets` method needs expansion.

## Recommended Scope

Start with objective #1 (Integration) as it provides the most immediate "wins" by exposing existing logic to the UI, then proceed to objective #2 (Varbits).

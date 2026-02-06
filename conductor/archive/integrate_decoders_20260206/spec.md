# Specification: Integrate Asset Decoders and Update Gap Analysis

## Overview
This track focuses on bridging the gap between available decoding logic and the public API/UI. We will integrate existing specialized loaders (Enum, Struct, Param, Underlay, Animation) into the `Cache.getAssets()` method, update the OSRS Cache Viewer to display this data, and refine the Gap Analysis documentation to reflect the current state of Varbit research.

## Functional Requirements
- **Integration of Existing Loaders:**
  - Update `packages/osrs-cache-loader/src/index.ts` to use specialized loaders for:
    - **Enum** (Archive 8)
    - **Struct** (Archive 34)
    - **Param** (Archive 11)
    - **Underlay** (Archive 1)
    - **Animation** (Archive 12)
  - Ensure `getAssets()` returns fully decoded objects for these types instead of the `{ status: 'Encoded' }` placeholder.
- **Documentation Update:**
  - Update `reference-material/docs/cache-gap-analysis.md` to mark integrated types as "Decoded".
  - Update the "Identified Gaps" section for **Varbits** to explicitly state that they are still pending research and implementation.
- **UI Alignment (Viewer):**
  - Update `AssetBrowser` and detail views in `apps/osrs-cache-viewer` to render decoded fields for the newly integrated types.
  - Remove "Encoded" labels from these asset types in the browser table.

## Non-Functional Requirements
- **Performance:** Ensure that bulk decoding in `getAssets()` remains performant for large archives like Enums.
- **Consistency:** Maintain existing data models and naming conventions from `cache/loaders/`.

## Acceptance Criteria
- [ ] `Cache.getAssets('enum')` returns an array of decoded Enum objects.
- [ ] `Cache.getAssets('struct')`, `getAssets('param')`, `getAssets('underlay')`, and `getAssets('animation')` return decoded objects.
- [ ] The OSRS Cache Viewer displays structured data for these types.
- [ ] `reference-material/docs/cache-gap-analysis.md` correctly reflects the new status of integrated loaders.
- [ ] Varbits are documented as "Pending Research" in the gap analysis.

## Out of Scope
- Implementation of Varbit decoding logic.
- Performance refactoring of existing decoders (unless required for basic integration).
- Adding support for other "Encoded" types (Hitsplat, HealthBar, etc.) in this specific track.

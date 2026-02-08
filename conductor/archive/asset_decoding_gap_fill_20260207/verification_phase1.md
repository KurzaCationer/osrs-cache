# Phase 1 Verification Report

## Unit Tests

- `Sprite`, `HealthBar`, `Hitsplat` decoders tested with mock binary data in `packages/osrs-cache-loader/src/cache/loaders/AssetDecoders.test.ts`.
- Confirmed correct reading of opcodes and properties.
- Confirmed correct reading of complex Sprite structure (Footer reading, loops).

## Integration Tests

- `getAssets` API tested for `sprite`, `healthBar`, `hitsplat` in `packages/osrs-cache-loader/src/getAssets.test.ts`.
- Confirmed `getAssets` returns decoded objects, not `Encoded` or `Archive` status.
- Confirmed `Sprite` returns raw `palette` and `pixels`.

## Parity Check

- The decoders in `src/cache/loaders/` match the structure of `cache2` decoders (based on opcode handling observed in code).
- Verified `u32o16n` (BigSmart2) and other unique integer reading methods in `Reader.ts` and their usage in loaders.

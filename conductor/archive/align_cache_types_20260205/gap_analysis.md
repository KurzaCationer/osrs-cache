# Cache Type Gap Analysis

## Type Mappings and Locations

| Type           | Index | Archive (if applicable) | Count Method | cache2 Loader | Status      |
| :------------- | :---- | :---------------------- | :----------- | :------------ | :---------- |
| Underlays      | 2     | 1                       | File         | Underlay      | Existing    |
| Identikits     | 2     | 3                       | File         | - (KitID)     | Existing    |
| Overlays       | 2     | 4                       | File         | -             | Existing    |
| Objects        | 2     | 6                       | File         | Obj           | Existing    |
| Enums          | 2     | 8                       | File         | Enum          | Existing    |
| NPCs           | 2     | 9                       | File         | NPC           | Existing    |
| Items          | 2     | 10                      | File         | Item          | Existing    |
| Params         | 2     | 11                      | File         | Param         | Existing    |
| Animations     | 2     | 12                      | File         | Animation     | Existing    |
| SpotAnims      | 2     | 13                      | File         | -             | **Missing** |
| Inventories    | 2     | 14                      | File         | -             | **Missing** |
| Hitsplats      | 2     | 32                      | File         | Hitsplat      | Existing    |
| Health Bars    | 2     | 33                      | File         | HealthBar     | Existing    |
| Structs        | 2     | 34                      | File         | Struct        | Existing    |
| DBRows         | 2     | 38                      | File         | DBRow         | Existing    |
| DBTables       | 2     | 39                      | File         | DBTable       | **Missing** |
| Varbits        | 2     | 69                      | File         | - (VarbitID)  | **Missing** |
| World Entities | 2     | 72                      | File         | WorldEntity   | **Missing** |
| Maps           | 5     | -                       | Archive      | -             | Existing    |
| Models         | 7     | -                       | Archive      | -             | Existing    |
| Sprites        | 8     | -                       | Archive      | Sprite        | Existing    |
| Textures       | 9     | -                       | Archive      | - (TextureID) | **Missing** |
| Fonts          | 13    | -                       | Archive      | - (FontID)    | **Missing** |
| DBTableIndex   | 21    | -                       | Archive      | -             | **Missing** |
| GameVal        | 24    | -                       | Archive      | GameVal       | **Missing** |

## Naming Alignment Proposal

Aligning `AssetCounts` keys with singular loader names where applicable:

- `items` -> `item`
- `npcs` -> `npc`
- `objects` -> `obj`
- `maps` -> `map`
- `animations` -> `animation`
- `enums` -> `enum`
- `sprites` -> `sprite`
- `models` -> `model`
- `structs` -> `struct`
- `underlays` -> `underlay`
- `overlays` -> `overlay`
- `identikits` -> `identikit`
- `params` -> `param`
- `hitsplats` -> `hitsplat`
- `healthBars` -> `healthBar`
- `dbRows` -> `dbRow`

New keys to add:

- `dbTable`
- `worldEntity`
- `spotAnim`
- `inventory`
- `varbit`
- `texture`
- `font`
- `dbTableIndex`
- `gameVal`

export type NewType<T, TName extends string> = T & {
  // @internal
  readonly [Tag in `~tag ${TName}`]: never
}
export type AliasType<T, TName extends string> = T | NewType<T, TName>

type TypedArray =
  | Uint8Array
  | Int8Array
  | Uint8ClampedArray
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | BigUint64Array
  | BigInt64Array
  | Float32Array
  | Float64Array
export type PrimitiveArray<T extends TArray[0], TArray extends TypedArray> =
  TArray & {
    [index: number]: T
  }

export enum CompressionType {
  NONE = 0,
  BZ2 = 1,
  GZIP = 2,
}

export type XTEAKey = [number, number, number, number]

export type WearPos = NewType<number, 'WearPos'>

export type ScriptVarChar = NewType<number, 'ScriptVarChar'>
export type ScriptVarID = NewType<number, 'ScriptVarID'>

export type AnimationID = NewType<number, 'AnimationID'>
export type CategoryID = NewType<number, 'CategoryID'>
export type DBRowID = NewType<number, 'DBRowID'>
export type DBTableID = NewType<number, 'DBTableID'>
export type DBColumnID = NewType<number, 'DBColumnID'>
export type EnumID = NewType<number, 'EnumID'>
export type FontID = NewType<number, 'FontID'>
export type GameValID = NewType<number, 'GameValID'>
export type HealthBarID = NewType<number, 'HealthBaID'>
export type HitsplatID = NewType<number, 'HitsplatID'>
export type ItemID = NewType<number, 'ItemID'>
export type KitID = NewType<number, 'KitID'>
export type MapElementID = NewType<number, 'MapElementID'>
export type MapSceneIconID = NewType<number, 'MapSceneIconID'>
export type MenuFilterMode = NewType<number, 'MenuFilterMode'>
export type ModelID = NewType<number, 'ModelID'>
export type NPCID = NewType<number, 'NPCID'>
export type ObjID = NewType<number, 'ObjID'>
export type ParamID = NewType<number, 'ParamID'>
export type PoseID = NewType<number, 'PoseID'>
export type SkeletonID = NewType<number, 'SkeletonID'>
export type SoundEffectID = NewType<number, 'SoundEffectID'>
export type SpriteID = NewType<number, 'SpriteID'>
export type StructID = NewType<number, 'StructID'>
export type TextureID = NewType<number, 'TextureID'>
export type UnderlayID = NewType<number, 'UnderlayID'>
export type VarbitID = NewType<number, 'VarbitID'>
export type VarPID = NewType<number, 'VarPID'>
export type WorldEntityID = NewType<number, 'WorldEntityID'>

export type HSL = AliasType<number, 'HSL'>
export type RGB = AliasType<number, 'RGB'>

export type WorldPoint = NewType<number, 'WorldPoint'>
export type ObjShape = NewType<number, 'ObjType'>

export type PreAnimMoveMode = NewType<number, 'PreAnimMoveMode'>
export type PostAnimMoveMode = NewType<number, 'PostAnimMoveMode'>
export type AnimRestartMode = NewType<number, 'AnimRestartMode'>
export type AmbientSoundCurve = NewType<number, 'AmbientSoundCurve'>
export type AmbientSoundVisibility = NewType<number, 'AmbientSoundVisibility'>
export type AnimMayaID = NewType<number, 'AnimMayaID'>

export class Params extends Map<ParamID, string | number> {}

export type KitOrItem = { kit: KitID } | { item: ItemID } | undefined

function makeByID<T extends number>(): (
  this: object,
  id: T,
) => string | undefined {
  let byID: Array<string> | undefined
  return function (this: object, id: T) {
    if (byID === undefined) {
      byID = []
      for (const [k, v] of Object.entries(this)) {
        if (typeof v === 'number') {
          byID[v] = k
        }
      }
    }
    return byID[id]
  }
}

export const WearPos = {
  Head: 0 as WearPos,
  Cape: 1 as WearPos,
  Amulet: 2 as WearPos,
  Weapon: 3 as WearPos,
  Torso: 4 as WearPos,
  Shield: 5 as WearPos,
  Arms: 6 as WearPos,
  Legs: 7 as WearPos,
  Hair: 8 as WearPos,
  Hands: 9 as WearPos,
  Boots: 10 as WearPos,
  Jaw: 11 as WearPos,
  Ring: 12 as WearPos,
  Ammo: 13 as WearPos,

  byID: makeByID<WearPos>(),
} as const

export const ObjShape = {
  WallStraight: 0 as ObjShape,
  WallDiagonalCorner: 1 as ObjShape,
  WallCorner: 2 as ObjShape,
  WallSquareCorner: 3 as ObjShape,
  WallDecorStraightNoOffset: 4 as ObjShape,
  WallDecorStraightOffset: 5 as ObjShape,
  WallDecorDiagonalOffset: 6 as ObjShape,
  WallDecorDiagonalNoOffset: 7 as ObjShape,
  WallDecorDiagonalBoth: 8 as ObjShape,
  WallDiagonal: 9 as ObjShape,
  CentrepieceStraight: 10 as ObjShape,
  CentrepieceDiagonal: 11 as ObjShape,
  RoofStraight: 12 as ObjShape,
  RoofDiagonalWithRoofEdge: 13 as ObjShape,
  RoofDiagonal: 14 as ObjShape,
  RoofCornerConcave: 15 as ObjShape,
  RoofCornerConvex: 16 as ObjShape,
  RoofFlat: 17 as ObjShape,
  RoofEdgeStraight: 18 as ObjShape,
  RoofEdgeDiagonalCorner: 19 as ObjShape,
  RoofEdgeCorner: 20 as ObjShape,
  RoofEdgeSquarecorner: 21 as ObjShape,
  GroundDecor: 22 as ObjShape,

  byID: makeByID<ObjShape>(),
} as const

export const PreAnimMoveMode = {
  DelayMove: 0 as PreAnimMoveMode,
  DelayAnim: 1 as PreAnimMoveMode,
  Merge: 2 as PreAnimMoveMode,

  byID: makeByID<PreAnimMoveMode>(),
} as const

export const PostAnimMoveMode = {
  DelayMove: 0 as PostAnimMoveMode,
  AbortAnim: 1 as PostAnimMoveMode,
  Merge: 2 as PostAnimMoveMode,

  byID: makeByID<PostAnimMoveMode>(),
} as const

export const AnimRestartMode = {
  Continue: 0 as AnimRestartMode,
  Restart: 1 as AnimRestartMode,
  ResetLoops: 2 as AnimRestartMode,

  byID: makeByID<AnimRestartMode>(),
} as const

export const AmbientSoundCurve = {
  Linear: 0 as AmbientSoundCurve,
  EaseInSine: 1 as AmbientSoundCurve,
  EaseOutSine: 2 as AmbientSoundCurve,
  EaseInOutSine: 3 as AmbientSoundCurve,
  EaseInQuad: 4 as AmbientSoundCurve,
  EaseOutQuad: 5 as AmbientSoundCurve,
  EaseInOutQuad: 6 as AmbientSoundCurve,
  EaseInCubic: 7 as AmbientSoundCurve,
  EaseOutCubic: 8 as AmbientSoundCurve,
  EaseInOutCubic: 9 as AmbientSoundCurve,
  EaseInQuart: 10 as AmbientSoundCurve,
  EaseOutQuart: 11 as AmbientSoundCurve,
  EaseInOutQuart: 12 as AmbientSoundCurve,
  EaseInQuint: 13 as AmbientSoundCurve,
  EaseOutQuint: 14 as AmbientSoundCurve,
  EaseInOutQuint: 15 as AmbientSoundCurve,
  EaseInExpo: 16 as AmbientSoundCurve,
  EaseOutExpo: 17 as AmbientSoundCurve,
  EaseInOutExpo: 18 as AmbientSoundCurve,
  EaseInCirc: 19 as AmbientSoundCurve,
  EaseOutCirc: 20 as AmbientSoundCurve,
  EaseInOutCirc: 21 as AmbientSoundCurve,
  EaseInBack: 22 as AmbientSoundCurve,
  EaseOutBack: 23 as AmbientSoundCurve,
  EaseInOutBack: 24 as AmbientSoundCurve,
  EaseInElastic: 25 as AmbientSoundCurve,
  EaseOutElastic: 26 as AmbientSoundCurve,
  EaseInOutElastic: 27 as AmbientSoundCurve,

  byID: makeByID<AmbientSoundCurve>(),
} as const

export const AmbientSoundVisibility = {
  Always: 0 as AmbientSoundVisibility,
  SameWorldEntity: 1 as AmbientSoundVisibility,
  SameOrMainWorldEntity: 2 as AmbientSoundVisibility,

  byID: makeByID<AmbientSoundVisibility>(),
} as const

export const MenuFilterMode = {
  None: 0 as MenuFilterMode,
  ExamineOnly: 1 as MenuFilterMode,
  Everything: 2 as MenuFilterMode,

  byID: makeByID<MenuFilterMode>(),
} as const

export const DBColumnID = {
  pack(table: DBTableID, column: number, tupleIndex: number = 0): DBColumnID {
    return ((table << 12) |
      ((column & 0xff) << 4) |
      (tupleIndex & 0xf)) as DBColumnID
  },
  unpack(c: DBColumnID): [table: DBTableID, column: number, tupleIndex: number] {
    return [(c >>> 12) as DBTableID, (c >>> 4) & 0xff, c & 0xf]
  },
} as const

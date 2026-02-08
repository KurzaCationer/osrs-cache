import { Reader } from './reader'
import type { CacheVersion } from './reader';

/**
 * Represents a decoded OSRS item definition.
 */
export interface ItemDefinition {
  id: number
  name: string
  examine?: string
  isMembers: boolean
  price: number
  isStackable: boolean
  inventoryModel: number
  groundActions: Array<string | null>
  inventoryActions: Array<string | null>
  recolorFrom?: Array<number>
  recolorTo?: Array<number>
  retextureFrom?: Array<number>
  retextureTo?: Array<number>
  zoom2d: number
  xan2d: number
  yan2d: number
  zan2d: number
  offsetX2d: number
  offsetY2d: number
  weight?: number
  wearpos1?: number
  wearpos2?: number
  wearpos3?: number
  category?: number
  team?: number
  params?: Record<number, string | number>
  shiftClickIndex?: number
  isGrandExchangable?: boolean
}

/**
 * Decodes a raw item definition buffer.
 */
export function decodeItem(
  id: number,
  data: Uint8Array,
  version?: CacheVersion,
): ItemDefinition {
  const reader = new Reader(data, version)
  const def: ItemDefinition = {
    id,
    name: 'null',
    isMembers: false,
    price: 1,
    isStackable: false,
    inventoryModel: 0,
    groundActions: [null, null, 'Take', null, null],
    inventoryActions: [null, null, null, null, 'Drop'],
    zoom2d: 2000,
    xan2d: 0,
    yan2d: 0,
    zan2d: 0,
    offsetX2d: 0,
    offsetY2d: 0,
  }

  while (reader.remaining() > 0) {
    const opcode = reader.u8()
    if (opcode === 0) break

    if (opcode === 1) {
      def.inventoryModel = reader.u16()
    } else if (opcode === 2) {
      def.name = reader.string()
    } else if (opcode === 3) {
      def.examine = reader.string()
    } else if (opcode === 4) {
      def.zoom2d = reader.u16()
    } else if (opcode === 5) {
      def.xan2d = reader.u16()
    } else if (opcode === 6) {
      def.yan2d = reader.u16()
    } else if (opcode === 7) {
      def.offsetX2d = reader.i16()
    } else if (opcode === 8) {
      def.offsetY2d = reader.i16()
    } else if (opcode === 11) {
      def.isStackable = true
    } else if (opcode === 12) {
      def.price = reader.i32()
    } else if (opcode === 13) {
      def.wearpos1 = reader.u8()
    } else if (opcode === 14) {
      def.wearpos2 = reader.u8()
    } else if (opcode === 16) {
      def.isMembers = true
    } else if (opcode === 23) {
      reader.u16() // maleModel0
      reader.u8() // maleOffset
    } else if (opcode === 24) {
      reader.u16() // maleModel1
    } else if (opcode === 25) {
      reader.u16() // femaleModel0
      reader.u8() // femaleOffset
    } else if (opcode === 26) {
      reader.u16() // femaleModel1
    } else if (opcode === 27) {
      def.wearpos3 = reader.u8()
    } else if (opcode >= 30 && opcode < 35) {
      def.groundActions[opcode - 30] = reader.stringNullHidden()
    } else if (opcode >= 35 && opcode < 40) {
      def.inventoryActions[opcode - 35] = reader.string()
    } else if (opcode === 40) {
      const count = reader.u8()
      def.recolorFrom = []
      def.recolorTo = []
      for (let i = 0; i < count; i++) {
        def.recolorFrom.push(reader.u16())
        def.recolorTo.push(reader.u16())
      }
    } else if (opcode === 41) {
      const count = reader.u8()
      def.retextureFrom = []
      def.retextureTo = []
      for (let i = 0; i < count; i++) {
        def.retextureFrom.push(reader.u16())
        def.retextureTo.push(reader.u16())
      }
    } else if (opcode === 42) {
      def.shiftClickIndex = reader.i8()
    } else if (opcode === 43) {
      reader.u8() // index
      for (;;) {
        const subindex = reader.u8() - 1
        if (subindex < 0) break
        reader.string()
      }
    } else if (opcode === 65) {
      def.isGrandExchangable = true
    } else if (opcode === 75) {
      def.weight = reader.i16()
    } else if (opcode === 78) {
      reader.u16() // maleModel2
    } else if (opcode === 79) {
      reader.u16() // femaleModel2
    } else if (opcode === 90) {
      reader.u16() // maleHeadModel
    } else if (opcode === 91) {
      reader.u16() // femaleHeadModel
    } else if (opcode === 92) {
      reader.u16() // maleHeadModel2
    } else if (opcode === 93) {
      reader.u16() // femaleHeadModel2
    } else if (opcode === 94) {
      def.category = reader.u16()
    } else if (opcode === 95) {
      def.zan2d = reader.u16()
    } else if (opcode === 97) {
      reader.u16() // unnotedId
    } else if (opcode === 98) {
      reader.u16() // notedTemplateId
    } else if (opcode >= 100 && opcode < 110) {
      reader.u16() // countObj
      reader.u16() // countCo
    } else if (opcode === 110) {
      reader.u16() // resizeX
    } else if (opcode === 111) {
      reader.u16() // resizeY
    } else if (opcode === 112) {
      reader.u16() // resizeZ
    } else if (opcode === 113) {
      reader.i8() // ambient
    } else if (opcode === 114) {
      reader.i8() // contrast
    } else if (opcode === 115) {
      def.team = reader.i8()
    } else if (opcode === 139) {
      reader.u16() // boughtId
    } else if (opcode === 140) {
      reader.u16() // boughtTemplateId
    } else if (opcode === 148) {
      reader.u16() // placeholderId
    } else if (opcode === 149) {
      reader.u16() // placeholderTemplateId
    } else if (opcode === 249) {
      def.params = decodeParams(reader)
    } else {
      console.warn(`Unknown Item opcode: ${opcode} at offset ${reader.offset}`)
      return def
    }
  }

  return def
}

/**
 * Represents a decoded OSRS NPC definition.
 */
export interface NPCDefinition {
  id: number
  name: string
  size: number
  standingAnimation: number
  walkingAnimation: number
  rotate180Animation: number
  rotate90LeftAnimation: number
  rotate90RightAnimation: number
  idleRotateLeftAnimation?: number
  idleRotateRightAnimation?: number
  runAnimation: number
  runRotate180Animation?: number
  runRotateLeftAnimation?: number
  runRotateRightAnimation?: number
  crawlAnimation?: number
  crawlRotate180Animation?: number
  crawlRotateLeftAnimation?: number
  crawlRotateRightAnimation?: number
  category: number
  combatLevel: number
  isMembers: boolean
  actions: Array<string | null>
  models: Array<number>
  chatheadModels: Array<number>
  isVisible: boolean
  isMinimapVisible?: boolean
  isInteractable?: boolean
  isClickable?: boolean
  isFollower?: boolean
  lowPriorityOps?: boolean
  ambient: number
  contrast: number
  widthScale: number
  heightScale: number
  rotationSpeed: number
  recolorFrom?: Array<number>
  recolorTo?: Array<number>
  retextureFrom?: Array<number>
  retextureTo?: Array<number>
  headIconArchive?: Array<number>
  headIconSpriteIndex?: Array<number>
  attack?: number
  defence?: number
  strength?: number
  hitpoints?: number
  ranged?: number
  magic?: number
  height?: number
  footprintSize?: number
  overlapTint?: number
  params?: Record<number, string | number>
  varbitId: number
  varpId: number
  transforms?: Array<number>
  defaultTransform: number
  oobChild?: number
  canHideForOverlap?: boolean
  unknown1?: boolean
}

/**
 * Decodes a raw NPC definition buffer.
 */
export function decodeNPC(
  id: number,
  data: Uint8Array,
  version?: CacheVersion,
): NPCDefinition {
  const reader = new Reader(data, version)
  const def: NPCDefinition = {
    id,
    name: 'null',
    size: 1,
    standingAnimation: -1,
    walkingAnimation: -1,
    rotate180Animation: -1,
    rotate90LeftAnimation: -1,
    rotate90RightAnimation: -1,
    runAnimation: -1,
    category: -1,
    combatLevel: -1,
    isMembers: false,
    actions: [null, null, null, null, null],
    models: [],
    chatheadModels: [],
    isVisible: false,
    ambient: 0,
    contrast: 0,
    widthScale: 128,
    heightScale: 128,
    rotationSpeed: 32,
    varbitId: -1,
    varpId: -1,
    defaultTransform: -1,
  }

  while (reader.remaining() > 0) {
    const opcode = reader.u8()
    if (opcode === 0) break

    if (opcode === 1) {
      const count = reader.u8()
      for (let i = 0; i < count; i++) def.models.push(reader.u16())
    } else if (opcode === 2) {
      def.name = reader.string()
    } else if (opcode === 12) {
      def.size = reader.u8()
    } else if (opcode === 13) {
      def.standingAnimation = reader.u16()
    } else if (opcode === 14) {
      def.walkingAnimation = reader.u16()
    } else if (opcode === 15) {
      def.idleRotateLeftAnimation = reader.u16()
    } else if (opcode === 16) {
      def.idleRotateRightAnimation = reader.u16()
    } else if (opcode === 17) {
      def.walkingAnimation = reader.u16()
      def.rotate180Animation = reader.u16()
      def.rotate90LeftAnimation = reader.u16()
      def.rotate90RightAnimation = reader.u16()
    } else if (opcode === 18) {
      def.category = reader.u16()
    } else if (opcode >= 30 && opcode < 35) {
      def.actions[opcode - 30] = reader.stringNullHidden()
    } else if (opcode === 40) {
      const count = reader.u8()
      def.recolorFrom = []
      def.recolorTo = []
      for (let i = 0; i < count; i++) {
        def.recolorFrom.push(reader.u16())
        def.recolorTo.push(reader.u16())
      }
    } else if (opcode === 41) {
      const count = reader.u8()
      def.retextureFrom = []
      def.retextureTo = []
      for (let i = 0; i < count; i++) {
        def.retextureFrom.push(reader.u16())
        def.retextureTo.push(reader.u16())
      }
    } else if (opcode === 60) {
      const count = reader.u8()
      for (let i = 0; i < count; i++) def.chatheadModels.push(reader.u16())
    } else if (opcode === 74) {
      def.attack = reader.u16()
    } else if (opcode === 75) {
      def.defence = reader.u16()
    } else if (opcode === 76) {
      def.strength = reader.u16()
    } else if (opcode === 77) {
      def.hitpoints = reader.u16()
    } else if (opcode === 78) {
      def.ranged = reader.u16()
    } else if (opcode === 79) {
      def.magic = reader.u16()
    } else if (opcode === 93) {
      def.isMinimapVisible = false
    } else if (opcode === 95) {
      def.combatLevel = reader.u16()
    } else if (opcode === 97) {
      def.widthScale = reader.u16()
    } else if (opcode === 98) {
      def.heightScale = reader.u16()
    } else if (opcode === 99) {
      def.isVisible = true
    } else if (opcode === 100) {
      def.ambient = reader.i8()
    } else if (opcode === 101) {
      def.contrast = reader.i8()
    } else if (opcode === 102) {
      // Logic for headIconArchive/headIconSpriteIndex
      // For simplicity and alignment with cache2, we skip or implement if needed
      // cache2: if (!r.isAfter(...)) { headIconArchive = [-1]; headIconSpriteIndex = [r.u16()]; }
      // else { bitfield = r.u8(); ... }
      // Since we don't have versioning yet, we'll try to follow cache2 logic if possible
      // But for now, let's just skip it like cache2 does if it can't determine version
      reader.u16()
    } else if (opcode === 103) {
      def.rotationSpeed = reader.u16()
    } else if (opcode === 106 || opcode === 118) {
      def.varbitId = reader.u16n()
      def.varpId = reader.u16n()
      if (opcode === 118) {
        def.oobChild = reader.u16n()
      }
      const count = reader.u8p1()
      def.transforms = []
      for (let i = 0; i < count; i++) {
        def.transforms.push(reader.u16n())
      }
    } else if (opcode === 107) {
      def.isInteractable = false
    } else if (opcode === 109) {
      def.isClickable = false
    } else if (opcode === 111) {
      def.isFollower = true
      def.lowPriorityOps = true
    } else if (opcode === 114) {
      def.runAnimation = reader.u16()
    } else if (opcode === 115) {
      def.runAnimation = reader.u16()
      def.runRotate180Animation = reader.u16()
      def.runRotateLeftAnimation = reader.u16()
      def.runRotateRightAnimation = reader.u16()
    } else if (opcode === 116) {
      def.crawlAnimation = reader.u16()
    } else if (opcode === 117) {
      def.crawlAnimation = reader.u16()
      def.crawlRotate180Animation = reader.u16()
      def.crawlRotateLeftAnimation = reader.u16()
      def.crawlRotateRightAnimation = reader.u16()
    } else if (opcode === 122) {
      def.isFollower = true
    } else if (opcode === 123) {
      def.lowPriorityOps = true
    } else if (opcode === 124) {
      def.height = reader.u16()
    } else if (opcode === 126) {
      def.footprintSize = reader.u16()
    } else if (opcode === 129) {
      def.unknown1 = true
    } else if (opcode === 145) {
      def.canHideForOverlap = true
    } else if (opcode === 146) {
      def.overlapTint = reader.u16()
    } else if (opcode === 249) {
      def.params = decodeParams(reader)
    } else {
      console.warn(`Unknown NPC opcode: ${opcode} at offset ${reader.offset}`)
      return def
    }
  }

  return def
}

/**
 * Represents a decoded OSRS object (scenery) definition.
 */
export interface ObjectDefinition {
  id: number
  name: string
  actions: Array<string | null>
  isSolid: boolean
  isInteractable: boolean
  models: Array<{ model: number; shape: number }>
  modelTypes?: Array<number>
  recolorFrom?: Array<number>
  recolorTo?: Array<number>
  retextureFrom?: Array<number>
  retextureTo?: Array<number>
  params?: Record<number, string | number>
  varbitId: number
  varpId: number
  transforms?: Array<number>
  defaultTransform: number
  oobChild?: number
  width: number
  length: number
  clipType: number
  blocksProjectile: boolean
  isDoor: number
  contouredGround: number
  flatShading: boolean
  modelClipped: boolean
  animationId: number
  decorDisplacement: number
  ambient: number
  contrast: number
  category: number
  mapIconId: number
  mapSceneId: number
  isRotated: boolean
  shadow: boolean
  modelSizeX: number
  modelSizeHeight: number
  modelSizeY: number
  offsetX: number
  offsetHeight: number
  offsetY: number
  obstructsGround: boolean
  isHollow: boolean
  supportItems: number
  ambientSoundID: number
  ambientSoundDistance: number
  ambientSoundRetain: number
  multiAmbientSoundIDs: Array<number>
  ambientSoundDistanceFadeCurve: number
  ambientSoundFadeInDuration: number
  ambientSoundFadeOutDuration: number
  randomizeAnimationStart: boolean
  deferAnimChange: boolean
  unknown1?: boolean
  ambientSoundChangeTicksMin?: number
  ambientSoundChangeTicksMax?: number
}

/**
 * Decodes a raw object definition buffer.
 */
export function decodeObject(
  id: number,
  data: Uint8Array,
  version?: CacheVersion,
): ObjectDefinition {
  const reader = new Reader(data, version)
  const def: ObjectDefinition = {
    id,
    name: 'null',
    actions: [null, null, null, null, null],
    isSolid: true,
    isInteractable: false,
    models: [],
    varbitId: -1,
    varpId: -1,
    defaultTransform: -1,
    width: 1,
    length: 1,
    clipType: 2,
    blocksProjectile: true,
    isDoor: -1,
    contouredGround: -1,
    flatShading: false,
    modelClipped: false,
    animationId: -1,
    decorDisplacement: 16,
    ambient: 0,
    contrast: 0,
    category: -1,
    mapIconId: -1,
    mapSceneId: -1,
    isRotated: false,
    shadow: true,
    modelSizeX: 128,
    modelSizeHeight: 128,
    modelSizeY: 128,
    offsetX: 0,
    offsetHeight: 0,
    offsetY: 0,
    obstructsGround: false,
    isHollow: false,
    supportItems: -1,
    ambientSoundID: -1,
    ambientSoundDistance: 0,
    ambientSoundRetain: 0,
    multiAmbientSoundIDs: [],
    ambientSoundDistanceFadeCurve: 0,
    ambientSoundFadeInDuration: 300,
    ambientSoundFadeOutDuration: 300,
    randomizeAnimationStart: true,
    deferAnimChange: false,
  }

  while (reader.remaining() > 0) {
    const opcode = reader.u8()
    if (opcode === 0) break

    if (opcode === 1 || opcode === 5) {
      const count = reader.u8()
      def.models = []
      for (let i = 0; i < count; i++) {
        def.models.push({
          model: reader.u16(),
          shape: opcode === 5 ? 10 : reader.u8(),
        })
      }
    } else if (opcode === 2) {
      def.name = reader.string()
    } else if (opcode === 14) {
      def.width = reader.u8()
    } else if (opcode === 15) {
      def.length = reader.u8()
    } else if (opcode === 17) {
      def.clipType = 0
      def.blocksProjectile = false
    } else if (opcode === 18) {
      def.blocksProjectile = false
    } else if (opcode === 19) {
      def.isDoor = reader.u8()
    } else if (opcode === 21) {
      def.contouredGround = 0
    } else if (opcode === 22) {
      def.flatShading = true
    } else if (opcode === 23) {
      def.modelClipped = true
    } else if (opcode === 24) {
      def.animationId = reader.u16n()
    } else if (opcode === 27) {
      def.clipType = 1
    } else if (opcode === 28) {
      def.decorDisplacement = reader.u8()
    } else if (opcode === 29) {
      def.ambient = reader.u8()
    } else if (opcode === 39) {
      def.contrast = reader.u8() * 25
    } else if (opcode >= 30 && opcode < 35) {
      def.actions[opcode - 30] = reader.stringNullHidden()
      def.isInteractable = true
    } else if (opcode === 40) {
      const count = reader.u8()
      def.recolorFrom = []
      def.recolorTo = []
      for (let i = 0; i < count; i++) {
        def.recolorFrom.push(reader.u16())
        def.recolorTo.push(reader.u16())
      }
    } else if (opcode === 41) {
      const count = reader.u8()
      def.retextureFrom = []
      def.retextureTo = []
      for (let i = 0; i < count; i++) {
        def.retextureFrom.push(reader.u16())
        def.retextureTo.push(reader.u16())
      }
    } else if (opcode === 61) {
      def.category = reader.u16()
    } else if (opcode === 62) {
      def.isRotated = true
    } else if (opcode === 64) {
      def.shadow = false
    } else if (opcode === 65) {
      def.modelSizeX = reader.u16()
    } else if (opcode === 66) {
      def.modelSizeHeight = reader.u16()
    } else if (opcode === 67) {
      def.modelSizeY = reader.u16()
    } else if (opcode === 68) {
      def.mapSceneId = reader.u16()
    } else if (opcode === 69) {
      reader.u8() // clipMask / blockingMask
    } else if (opcode === 70) {
      def.offsetX = reader.i16()
    } else if (opcode === 71) {
      def.offsetHeight = reader.i16()
    } else if (opcode === 72) {
      def.offsetY = reader.i16()
    } else if (opcode === 73) {
      def.obstructsGround = true
    } else if (opcode === 74) {
      def.isHollow = true
    } else if (opcode === 75) {
      def.supportItems = reader.u8()
    } else if (opcode === 77 || opcode === 92) {
      def.varbitId = reader.u16n()
      def.varpId = reader.u16n()
      if (opcode === 92) {
        def.oobChild = reader.u16n()
      }
      const count = reader.u8p1()
      def.transforms = []
      for (let i = 0; i < count; i++) {
        def.transforms.push(reader.u16n())
      }
    } else if (opcode === 78) {
      def.ambientSoundID = reader.u16()
      def.ambientSoundDistance = reader.u8()
      if (reader.isAfter({ era: 'osrs', indexRevision: 4106 })) {
        def.ambientSoundRetain = reader.u8()
      }
    } else if (opcode === 79) {
      def.ambientSoundChangeTicksMin = reader.u16()
      def.ambientSoundChangeTicksMax = reader.u16()
      def.ambientSoundDistance = reader.u8()
      if (reader.isAfter({ era: 'osrs', indexRevision: 4106 })) {
        def.ambientSoundRetain = reader.u8()
      }
      const count = reader.u8()
      def.multiAmbientSoundIDs = []
      for (let i = 0; i < count; i++)
        def.multiAmbientSoundIDs.push(reader.u16())
    } else if (opcode === 81) {
      def.contouredGround = reader.u8() * 256
    } else if (opcode === 82) {
      def.mapIconId = reader.u16()
    } else if (opcode === 89) {
      def.randomizeAnimationStart = false
    } else if (opcode === 90) {
      def.deferAnimChange = true
    } else if (opcode === 91) {
      def.ambientSoundDistanceFadeCurve = reader.u8()
    } else if (opcode === 93) {
      reader.u8() // ambientSoundFadeInCurve
      def.ambientSoundFadeInDuration = reader.u16()
      reader.u8() // ambientSoundFadeOutCurve
      def.ambientSoundFadeOutDuration = reader.u16()
    } else if (opcode === 94) {
      def.unknown1 = true
    } else if (opcode === 95) {
      reader.u8() // ambientSoundVisibility
    } else if (opcode === 249) {
      def.params = decodeParams(reader)
    } else {
      console.warn(
        `Unknown Object opcode: ${opcode} at offset ${reader.offset}`,
      )
      return def
    }
  }

  // Post-processing logic from cache2
  if (def.isDoor === -1) {
    def.isDoor = 0
    if (def.actions.some((a) => a !== null)) {
      def.isDoor = 1
    }
  }
  if (def.supportItems === -1) {
    def.supportItems = def.clipType !== 0 ? 1 : 0
  }

  return def
}

/**
 * Utility to decode a parameter map (opcode 249).
 * @internal
 */
function decodeParams(reader: Reader): Record<number, string | number> {
  const count = reader.u8()
  const params: Record<number, string | number> = {}
  for (let i = 0; i < count; i++) {
    const isString = reader.u8() === 1
    const key = reader.u24()
    if (isString) {
      params[key] = reader.string()
    } else {
      params[key] = reader.i32()
    }
  }
  return params
}

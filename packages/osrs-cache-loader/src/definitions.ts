import { Reader } from "./reader";

/**
 * Represents a decoded OSRS item definition.
 */
export interface ItemDefinition {
  id: number;
  name: string;
  isMembers: boolean;
  cost: number;
  isStackable: number;
  inventoryModel: number;
  notes?: string;
}

/**
 * Decodes a raw item definition buffer.
 * 
 * @param id The item ID.
 * @param data The raw buffer data.
 * @returns The decoded ItemDefinition.
 */
export function decodeItem(id: number, data: Uint8Array): ItemDefinition {
  const reader = new Reader(data);
  const def: ItemDefinition = {
    id,
    name: "null",
    isMembers: false,
    cost: 1,
    isStackable: 0,
    inventoryModel: 0,
  };

  while (reader.remaining() > 0) {
    const opcode = reader.u8();
    if (opcode === 0) break;

    if (opcode === 1) {
      def.inventoryModel = reader.u16();
    } else if (opcode === 2) {
      def.name = reader.string();
    } else if (opcode === 11) {
      def.isStackable = 1;
    } else if (opcode === 12) {
      def.cost = reader.i32();
    } else if (opcode === 16) {
      def.isMembers = true;
    } else if (opcode === 23) {
      reader.u16();
      reader.u8();
    } else if (opcode === 24) {
      reader.u16();
    } else if (opcode === 25) {
      reader.u16();
      reader.u8();
    } else if (opcode === 26) {
      reader.u16();
    } else if (opcode >= 30 && opcode < 35) {
      reader.string();
    } else if (opcode >= 35 && opcode < 40) {
      reader.string();
    } else if (opcode === 40) {
      const count = reader.u8();
      for (let i = 0; i < count; i++) {
        reader.u16();
        reader.u16();
      }
    } else if (opcode === 41) {
      const count = reader.u8();
      for (let i = 0; i < count; i++) {
        reader.u16();
        reader.u16();
      }
    } else if (opcode === 42) {
      reader.u8();
    } else if (opcode === 65) {
      // isTradeable
    } else if (opcode === 78) {
      reader.u16();
    } else if (opcode === 79) {
      reader.u16();
    } else if (opcode === 90) {
      reader.u16();
    } else if (opcode === 91) {
      reader.u16();
    } else if (opcode === 92) {
      reader.u16();
    } else if (opcode === 93) {
      reader.u16();
    } else if (opcode === 94) {
      // unknown
    } else if (opcode === 95) {
      reader.u16();
    } else if (opcode === 97) {
      reader.u16();
    } else if (opcode === 98) {
      reader.u16();
    } else if (opcode >= 100 && opcode < 110) {
      reader.u16();
      reader.u16();
    } else if (opcode === 110) {
      reader.u16();
    } else if (opcode === 111) {
      reader.u16();
    } else if (opcode === 112) {
      reader.u16();
    } else if (opcode === 113) {
      reader.u8();
    } else if (opcode === 114) {
      reader.u8();
    } else if (opcode === 115) {
      reader.u8();
    } else if (opcode === 139) {
      reader.u16();
    } else if (opcode === 140) {
      reader.u16();
    } else if (opcode === 148) {
      reader.u16();
    } else if (opcode === 149) {
      reader.u16();
    } else if (opcode === 249) {
      const count = reader.u8();
      for (let i = 0; i < count; i++) {
        const isString = reader.u8() === 1;
        reader.u24();
        if (isString) {
          reader.string();
        } else {
          reader.i32();
        }
      }
    }
  }

  return def;
}

/**
 * Represents a decoded OSRS NPC definition.
 */
export interface NPCDefinition {
  id: number;
  name: string;
  size: number;
  combatLevel: number;
  isMembers: boolean;
  actions: string[];
}

/**
 * Decodes a raw NPC definition buffer.
 */
export function decodeNPC(id: number, data: Uint8Array): NPCDefinition {
  const reader = new Reader(data);
  const def: NPCDefinition = {
    id,
    name: "null",
    size: 1,
    combatLevel: -1,
    isMembers: false,
    actions: [],
  };

  while (reader.remaining() > 0) {
    const opcode = reader.u8();
    if (opcode === 0) break;

    if (opcode === 1) {
      const count = reader.u8();
      for (let i = 0; i < count; i++) reader.u16();
    } else if (opcode === 2) {
      def.name = reader.string();
    } else if (opcode === 12) {
      def.size = reader.u8();
    } else if (opcode >= 30 && opcode < 35) {
      def.actions[opcode - 30] = reader.string();
    } else if (opcode === 40) {
      const count = reader.u8();
      for (let i = 0; i < count; i++) { reader.u16(); reader.u16(); }
    } else if (opcode === 41) {
      const count = reader.u8();
      for (let i = 0; i < count; i++) { reader.u16(); reader.u16(); }
    } else if (opcode === 60) {
      const count = reader.u8();
      for (let i = 0; i < count; i++) reader.u16();
    } else if (opcode === 93) {
      def.isMembers = false; // actually visible on minimap
    } else if (opcode === 95) {
      def.combatLevel = reader.u16();
    } else if (opcode === 97) {
      reader.u16();
    } else if (opcode === 98) {
      reader.u16();
    } else if (opcode === 99) {
      def.isMembers = true;
    } else if (opcode === 100) {
      reader.u8();
    } else if (opcode === 101) {
      reader.u8();
    } else if (opcode === 102) {
      reader.u16();
    } else if (opcode === 103) {
      reader.u16();
    } else if (opcode === 106 || opcode === 118) {
      reader.u16(); // varbit
      reader.u16(); // varp
      if (opcode === 118) reader.u16(); // default
      const count = reader.u8();
      for (let i = 0; i <= count; i++) reader.u16();
    } else if (opcode === 107) {
      // isInteractable = false
    } else if (opcode === 109) {
      // isClickable = false
    } else if (opcode === 111) {
      // isFollower = true
    } else if (opcode === 114) {
      reader.u16();
    } else if (opcode === 115) {
      reader.u16();
      reader.u16();
      reader.u16();
      reader.u16();
    }
  }

  return def;
}

/**
 * Represents a decoded OSRS object (scenery) definition.
 */
export interface ObjectDefinition {
  id: number;
  name: string;
  actions: string[];
  isSolid: boolean;
  isInteractable: boolean;
}

/**
 * Decodes a raw object definition buffer.
 */
export function decodeObject(id: number, data: Uint8Array): ObjectDefinition {
  const reader = new Reader(data);
  const def: ObjectDefinition = {
    id,
    name: "null",
    actions: [],
    isSolid: true,
    isInteractable: true,
  };

  while (reader.remaining() > 0) {
    const opcode = reader.u8();
    if (opcode === 0) break;

    if (opcode === 1) {
      const count = reader.u8();
      for (let i = 0; i < count; i++) { reader.u16(); reader.u8(); }
    } else if (opcode === 2) {
      def.name = reader.string();
    } else if (opcode === 5) {
      const count = reader.u8();
      for (let i = 0; i < count; i++) reader.u16();
    } else if (opcode === 14) {
      reader.u8();
    } else if (opcode === 15) {
      reader.u8();
    } else if (opcode === 17) {
      def.isSolid = false;
    } else if (opcode === 18) {
      // isInteractable = false
    } else if (opcode === 19) {
      def.isInteractable = reader.u8() === 1;
    } else if (opcode >= 30 && opcode < 35) {
      def.actions[opcode - 30] = reader.string();
    } else if (opcode === 40) {
      const count = reader.u8();
      for (let i = 0; i < count; i++) { reader.u16(); reader.u16(); }
    } else if (opcode === 41) {
      const count = reader.u8();
      for (let i = 0; i < count; i++) { reader.u16(); reader.u16(); }
    } else if (opcode === 62) {
      // isRotated = true
    } else if (opcode === 64) {
      // isShadowed = false
    } else if (opcode === 65) {
      reader.u16();
    } else if (opcode === 66) {
      reader.u16();
    } else if (opcode === 67) {
      reader.u16();
    } else if (opcode === 68) {
      reader.u16();
    } else if (opcode === 69) {
      reader.u8();
    } else if (opcode === 70) {
      reader.u16();
    } else if (opcode === 71) {
      reader.u16();
    } else if (opcode === 72) {
      reader.u16();
    } else if (opcode === 73) {
      // isObstacle = true
    } else if (opcode === 74) {
      // isHollow = true
    } else if (opcode === 75) {
      reader.u8();
    } else if (opcode === 77 || opcode === 92) {
      reader.u16(); // varbit
      reader.u16(); // varp
      if (opcode === 92) reader.u16(); // default
      const count = reader.u8();
      for (let i = 0; i <= count; i++) reader.u16();
    } else if (opcode === 78) {
      reader.u16();
      reader.u8();
    } else if (opcode === 79) {
      reader.u16();
      reader.u16();
      reader.u8();
      const count = reader.u8();
      for (let i = 0; i < count; i++) reader.u16();
    } else if (opcode === 81) {
      reader.u8();
    } else if (opcode === 82) {
      reader.u16();
    }
  }

  return def;
}

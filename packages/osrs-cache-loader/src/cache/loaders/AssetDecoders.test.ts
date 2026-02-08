import { describe, expect, it } from 'vitest'
import { Reader } from '../Reader'
import { HealthBar } from './HealthBar'
import { Hitsplat } from './Hitsplat'
import { Sprites } from './Sprite'
import { DBRow, DBTable } from './DBRow'
import { WorldEntity } from './WorldEntity'
import type {
  DBRowID,
  DBTableID,
  HealthBarID,
  HitsplatID,
  SpriteID,
  WorldEntityID,
} from '../types'

describe('Asset Decoders', () => {
  describe('WorldEntity', () => {
    it('should decode WorldEntity correctly', () => {
      // Opcode 12 (Name) = "Entity".
      // Opcode 4 (OffsetX) = 100.
      // Opcode 0.
      const name = new TextEncoder().encode('Entity')
      const data = new Uint8Array([12, ...name, 0, 4, 0, 100, 0])

      const reader = new Reader(data)
      const we = WorldEntity.decode(reader, 1 as WorldEntityID)

      expect(we.id).toBe(1)
      expect(we.name).toBe('Entity')
      expect(we.offsetX).toBe(100)
    })
  })

  describe('DBRow', () => {
    it('should decode DBRow correctly', () => {
      // Opcode 3 (Values)
      // Len (u8) = 1. (Allocates array size 1).
      // Column loop:
      //   Column (u8) = 0.
      //   readTypes:
      //     Size (u8) = 1.
      //     Type (u8o16) = 0 (Int). (ScriptVarType.int.id = 0)
      //   readValues:
      //     Strides (u8o16) = 1.
      //     Value (int) -> i32 = 42.
      //   Column (u8) = 255 (End).
      // Opcode 0 (End).

      const data = new Uint8Array([
        3, // Opcode 3
        1, // Len of values/types arrays
        0, // Column 0
        1, // readTypes: Size 1
        0, // readTypes: Type 0 (Int)
        1, // readValues: Strides 1
        0,
        0,
        0,
        42, // readValues: Value 42 (i32)
        255, // Column End
        0, // Opcode 0
      ])

      const reader = new Reader(data)
      const row = DBRow.decode(reader, 1 as DBRowID)

      expect(row.id).toBe(1)
      expect(row.types[0][0]).toBe(0)
      expect(row.values[0][0]).toBe(42)
    })
  })

  describe('DBTable', () => {
    it('should decode DBTable correctly', () => {
      // Opcode 1 (Default Values)
      // Len (u8) = 1.
      // Bits (u8) = 0x80 | 0 = 128. (Has values, Column 0).
      // readTypes:
      //   Size 1
      //   Type 36 (String). (ScriptVarType.string.id = 36)
      // readValues:
      //   Strides 1
      //   Value "Hi"
      // Bits 255 (End).
      // Opcode 0.

      const str = new TextEncoder().encode('Hi')
      const data = new Uint8Array([
        1, // Opcode 1
        1, // Len
        128, // Bits (Has Values, Col 0)
        1, // readTypes Size
        36, // readTypes Type 36 (String)
        1, // readValues Strides
        ...str,
        0, // readValues String "Hi"
        255, // Bits End
        0, // Opcode 0
      ])

      const reader = new Reader(data)
      const table = DBTable.decode(reader, 10 as DBTableID)

      expect(table.id).toBe(10)
      expect(table.types[0][0]).toBe(36)
      expect(table.defaultValues[0][0]).toBe('Hi')
    })
  })

  describe('HealthBar', () => {
    it('should decode health bar data correctly', () => {
      // Mock data for a health bar with some properties set
      // Opcode 1 (unused1) = 1234
      // Opcode 5 (duration) = 50
      // Opcode 0 (End)
      const data = new Uint8Array([
        1,
        0x04,
        0xd2, // Opcode 1, value 1234 (0x04D2)
        5,
        0x00,
        0x32, // Opcode 5, value 50 (0x0032)
        0, // End
      ])
      const reader = new Reader(data)
      const healthBar = HealthBar.decode(reader, 10 as HealthBarID)

      expect(healthBar.id).toBe(10)
      expect(healthBar.unused1).toBe(1234)
      expect(healthBar.duration).toBe(50)
    })
  })

  describe('Hitsplat', () => {
    it('should decode hitsplat data correctly', () => {
      // Mock data
      // Opcode 2 (fontColor) = 0xFF0000 (Red)
      // Opcode 8 (formatString) = "Test"
      // Opcode 0 (End)
      const stringBytes = new TextEncoder().encode('Test')
      const data = new Uint8Array([
        2,
        0xff,
        0x00,
        0x00, // Opcode 2, value 0xFF0000
        8,
        0x00,
        ...stringBytes,
        0, // Opcode 8, vString checks for 0, then reads string until 0. Wait...
        0, // End
      ])
      // vString: if (this.u8() != 0) throw error; return string();
      // So Opcode 8 -> vString -> reads 0 -> reads "Test" -> reads 0 (null terminator)

      const reader = new Reader(data)
      const hitsplat = Hitsplat.decode(reader, 5 as HitsplatID)

      expect(hitsplat.id).toBe(5)
      expect(hitsplat.fontColor).toBe(0xff0000)
      expect(hitsplat.formatString).toBe('Test')
    })
  })

  describe('Sprites', () => {
    it('should decode sprite data correctly', () => {
      // Structure based on decoding logic:
      // [Pixels...] (Variable)
      // [Palette...] (Variable, 3 bytes per entry)
      // [Canvas Width] (2 bytes)
      // [Canvas Height] (2 bytes)
      // [Palette Length] (1 byte)
      // [Offset X] (2 bytes per sprite)
      // [Offset Y] (2 bytes per sprite)
      // [Width] (2 bytes per sprite)
      // [Height] (2 bytes per sprite)
      // [Count] (2 bytes)

      const paletteLen = 1
      const palette = [0xff, 0xff, 0xff]

      // Per sprite info (8 bytes)
      // offX(2), offY(2), width(2), height(2)
      const spriteInfo = [0, 0, 0, 0, 0, 1, 0, 1]

      // Footer info
      const canvasInfo = [0, 10, 0, 10, paletteLen] // W, H, Len

      // Pixels. 1x1. Encoding flags = 1.
      const pixelData = [1, 0]

      // Construct buffer
      const buffer = [
        ...pixelData,
        ...palette,
        ...canvasInfo,
        ...spriteInfo,
        0,
        1, // Count (1)
      ]

      const data = new Uint8Array(buffer)
      const reader = new Reader(data)
      const sprites = Sprites.decode(reader, 100 as SpriteID)

      expect(sprites.id).toBe(100)
      expect(sprites.width).toBe(10)
      expect(sprites.height).toBe(10)
      expect(sprites.sprites.length).toBe(1)
      expect(sprites.sprites[0].pixelsWidth).toBe(1)
      expect(sprites.sprites[0].pixelsHeight).toBe(1)
    })
  })
})

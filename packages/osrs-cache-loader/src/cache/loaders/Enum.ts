import { PerFileLoadable } from '../Loadable'
import type { Reader } from '../Reader'
import type { EnumID, ScriptVarChar } from '../types'

export class EnumValueMap<
  TKey extends number = number,
  TValue extends string | number = string | number,
> extends Map<TKey, TValue> {
  constructor(readonly parent: Enum<TKey, TValue>) {
    super()
  }
}

export class Enum<
  TKey extends number = number,
  TValue extends string | number = string | number,
> extends PerFileLoadable {
  constructor(public id: EnumID) {
    super()
  }

  public static readonly index = 2
  public static readonly archive = 8

  public keyTypeChar!: ScriptVarChar
  public valueTypeChar!: ScriptVarChar

  public defaultValue: TValue = undefined!
  public map: Map<TKey, TValue> = new EnumValueMap<TKey, TValue>(this)

  public get(k: TKey): TValue {
    return this.map.get(k) ?? this.defaultValue
  }

  public override toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      keyTypeChar: this.keyTypeChar,
      valueTypeChar: this.valueTypeChar,
      defaultValue: this.defaultValue,
      map: Object.fromEntries(this.map),
    }
  }

  public static decode(
    reader: Reader,
    id: EnumID,
  ): Enum<number, string | number> {
    const v = new Enum<number, string | number>(id)
    for (let opcode: number; (opcode = reader.u8()) != 0; ) {
      switch (opcode) {
        case 1:
          v.keyTypeChar = reader.u8() as ScriptVarChar
          break
        case 2:
          v.valueTypeChar = reader.u8() as ScriptVarChar
          break
        case 3:
          v.defaultValue = reader.string()
          break
        case 4:
          v.defaultValue = reader.i32()
          break
        case 5:
        case 6: {
          const coder = opcode === 5 ? ('string' as const) : ('i32' as const)
          const size = reader.u16()
          for (let i = 0; i < size; i++) {
            v.map.set(reader.i32(), reader[coder]() as string & number)
          }
          break
        }
        default:
          throw new Error(`unknown enum opcode ${opcode}`)
      }
    }
    return v
  }
}

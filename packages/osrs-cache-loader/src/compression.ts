import { gunzipSync } from 'fflate'
import bzip2 from 'seek-bzip'
import { Reader } from './reader'
import { CompressionType } from './types'

/**
 * Decompresses an OSRS cache container.
 *
 * The container format is:
 * - 1 byte: Compression type
 * - 4 bytes: Compressed size
 * - [Optional] 4 bytes: Decompressed size (if compressed)
 * - N bytes: Compressed payload
 *
 * @param data The raw container data.
 * @returns The decompressed payload.
 * @throws Error if the compression type is unknown or decompression fails.
 */
export const decompress = (data: Uint8Array): Uint8Array => {
  const reader = new Reader(data)
  const type = reader.u8() as CompressionType
  const compressedSize = reader.u32()

  if (type === CompressionType.NONE) {
    return data.subarray(5, 5 + compressedSize)
  }

  const decompressedSize = reader.u32()
  const payload = data.subarray(9, 9 + compressedSize)

  if (type === CompressionType.GZIP) {
    return gunzipSync(payload)
  }

  if ((type as number) === CompressionType.BZ2) {
    // Construct a valid BZIP2 file for seek-bzip
    const bzip2File = new Uint8Array(payload.length + 4 + 10)
    // Header
    bzip2File[0] = 0x42 // B
    bzip2File[1] = 0x5a // Z
    bzip2File[2] = 0x68 // h
    bzip2File[3] = 0x39 // 9
    // Payload (contains the block magic 31 41 59 26 53 59)
    bzip2File.set(payload, 4)
    // Footer (Stream End Magic: 0x177245385090)
    const footerOffset = payload.length + 4
    bzip2File[footerOffset + 0] = 0x17
    bzip2File[footerOffset + 1] = 0x72
    bzip2File[footerOffset + 2] = 0x45
    bzip2File[footerOffset + 3] = 0x38
    bzip2File[footerOffset + 4] = 0x50
    bzip2File[footerOffset + 5] = 0x90

    return bzip2.decode(Buffer.from(bzip2File), decompressedSize)
  }

  throw new Error(`Unknown compression type: ${type}`)
}

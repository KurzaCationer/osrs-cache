import { gunzipSync } from "fflate";
import bzip2 from "seek-bzip";

export enum CompressionType {
  NONE = 0,
  BZ2 = 1,
  GZIP = 2,
}

export const decompress = async (data: Uint8Array): Promise<Uint8Array> => {
  const type = data[0] as CompressionType;
  const compressedSize = (data[1] << 24) | (data[2] << 16) | (data[3] << 8) | data[4];

  if (type === CompressionType.NONE) {
    return data.subarray(5, 5 + compressedSize);
  }

  const decompressedSize = (data[5] << 24) | (data[6] << 16) | (data[7] << 8) | data[8];
  const payload = data.subarray(9, 9 + compressedSize);

  if (type === CompressionType.GZIP) {
    return gunzipSync(payload);
  } else if (type === CompressionType.BZ2) {
    // Construct a valid BZIP2 file for seek-bzip
    const bzip2File = new Uint8Array(payload.length + 4 + 10);
    // Header
    bzip2File[0] = 0x42; // B
    bzip2File[1] = 0x5a; // Z
    bzip2File[2] = 0x68; // h
    bzip2File[3] = 0x39; // 9
    // Payload (contains the block magic 31 41 59 26 53 59)
    bzip2File.set(payload, 4);
    // Footer (Stream End Magic: 0x177245385090)
    const footerOffset = payload.length + 4;
    bzip2File[footerOffset + 0] = 0x17;
    bzip2File[footerOffset + 1] = 0x72;
    bzip2File[footerOffset + 2] = 0x45;
    bzip2File[footerOffset + 3] = 0x38;
    bzip2File[footerOffset + 4] = 0x50;
    bzip2File[footerOffset + 5] = 0x90;
    // CRC placeholder
    
    return bzip2.decode(Buffer.from(bzip2File), decompressedSize);
  }

  throw new Error(`Unsupported compression type: ${type}`);
};

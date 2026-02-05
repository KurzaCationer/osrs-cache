/**
 * Extracts multiple files from a decompressed OSRS archive using the footer information.
 * 
 * @param data The decompressed archive data.
 * @param fileCount The number of files expected in the archive.
 * @returns An array of Uint8Arrays, each representing a file.
 */
export function extractFiles(data: Uint8Array, fileCount: number): Array<Uint8Array> {
  if (fileCount <= 1) {
    return [data];
  }

  const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const numChunks = dv.getUint8(dv.byteLength - 1);
  let off = dv.byteLength - 1 - numChunks * fileCount * 4;
  let doff = 0;
  const files: Array<Uint8Array> = new Array(fileCount);

  if (numChunks === 1) {
    let size = 0;
    for (let i = 0; i < fileCount; i++) {
      size += dv.getInt32(off);
      off += 4;
      files[i] = data.subarray(doff, doff + size);
      doff += size;
    }
  } else {
    const sizeStride = numChunks + 1;
    const sizes = new Uint32Array(sizeStride * fileCount);
    for (let ch = 0; ch < numChunks; ch++) {
      let size = 0;
      for (let id = 0; id < fileCount; id++) {
        size += dv.getInt32(off);
        off += 4;
        const soff = id * sizeStride;
        sizes[soff] += size;
        sizes[soff + 1 + ch] = size;
      }
    }

    for (let id = 0; id < fileCount; id++) {
      const soff = id * sizeStride;
      files[id] = new Uint8Array(sizes[soff]);
      sizes[soff] = 0; // reset to use as write pointer
    }

    for (let ch = 0; ch < numChunks; ch++) {
      for (let id = 0; id < fileCount; id++) {
        const soff = id * sizeStride;
        const cSize = sizes[soff + 1 + ch];
        const start = sizes[soff];
        files[id].set(data.subarray(doff, doff + cSize), start);
        sizes[soff] = start + cSize;
        doff += cSize;
      }
    }
  }

  return files;
}

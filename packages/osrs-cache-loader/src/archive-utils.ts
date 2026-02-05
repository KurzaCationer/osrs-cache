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
  const numChunks = data[data.length - 1];
  
  const files: Array<Uint8Array> = new Array(fileCount);
  const fileSizes = new Int32Array(fileCount);
  
  let off = data.length - 1 - (numChunks * fileCount * 4);
  for (let ch = 0; ch < numChunks; ch++) {
    let delta = 0;
    for (let id = 0; id < fileCount; id++) {
      delta += dv.getInt32(off);
      off += 4;
      fileSizes[id] += delta;
    }
  }

  for (let id = 0; id < fileCount; id++) {
    files[id] = new Uint8Array(fileSizes[id]);
  }

  let doff = 0;
  const writePos = new Int32Array(fileCount);
  off = data.length - 1 - (numChunks * fileCount * 4);
  for (let ch = 0; ch < numChunks; ch++) {
    let delta = 0;
    for (let id = 0; id < fileCount; id++) {
      delta += dv.getInt32(off);
      off += 4;
      files[id].set(data.subarray(doff, doff + delta), writePos[id]);
      writePos[id] += delta;
      doff += delta;
    }
  }

  return files;
}

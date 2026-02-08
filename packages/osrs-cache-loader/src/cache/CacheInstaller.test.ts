import { beforeEach, describe, expect, it, vi } from "vitest";
import { CacheInstaller } from "./CacheInstaller";
import fs from "fs/promises";
import * as fflate from "fflate";
import * as tar from "tar-stream";
import { EventEmitter } from "events";

describe("CacheInstaller", () => {
  let installer: CacheInstaller;
  let mockClient: any;
  let mockMetadata: any;

  beforeEach(() => {
    mockMetadata = { id: 123, scope: "runescape" };
    mockClient = {
      downloadFlatExport: vi.fn(),
      getXTEAKeys: vi.fn(),
    };
    installer = new CacheInstaller(mockMetadata, mockClient);
    vi.mock("fs/promises");
    vi.mock("fflate");
    vi.mock("tar-stream");
  });

  it("should download and extract tarball cache", async () => {
    const mockGzBuffer = new ArrayBuffer(1024);
    mockClient.downloadFlatExport.mockResolvedValue(mockGzBuffer);
    mockClient.getXTEAKeys.mockResolvedValue([{ mapsquare: 1, key: [1,2,3,4] }]);
    
    (fflate.gunzipSync as any).mockReturnValue(new Uint8Array([1, 2, 3]));

    const mockExtract = new EventEmitter() as any;
    mockExtract.writable = true;
    mockExtract.write = vi.fn().mockReturnValue(true);
    mockExtract.end = vi.fn();
    mockExtract.destroy = vi.fn();
    (tar.extract as any).mockReturnValue(mockExtract);

    const installPromise = installer.install();

    // Simulate tar entries
    const entries = [
      { name: "cache/255/1.dat", data: new Uint8Array([1, 2, 3]) },
      { name: "cache/0/1.dat", data: new Uint8Array([4, 5, 6]) },
    ];

    // Wait for the installer to start listening to 'entry'
    await new Promise(r => setTimeout(r, 10));

    for (const entry of entries) {
      const mockStream = new EventEmitter() as any;
      mockStream[Symbol.asyncIterator] = async function* () {
        yield entry.data;
      };
      mockStream.resume = vi.fn();
      mockExtract.emit("entry", { name: entry.name }, mockStream, vi.fn());
      // Give each entry a tick to process
      await new Promise(r => setTimeout(r, 10));
    }

    mockExtract.emit("finish");
    await installPromise;

    expect(mockClient.downloadFlatExport).toHaveBeenCalledWith(123, "runescape");
    expect(fs.writeFile).toHaveBeenCalledWith(expect.stringContaining("index_255_1.dat"), expect.any(Uint8Array));
    expect(fs.writeFile).toHaveBeenCalledWith(expect.stringContaining("index_0_1.dat"), expect.any(Uint8Array));
    expect(fs.writeFile).toHaveBeenCalledWith(expect.stringContaining("keys.json"), expect.any(String));
  });

  it("should cleanup old cache directories", async () => {
    const cacheDir = "/data/caches";
    vi.mocked(fs.readdir).mockResolvedValue([
      "123", // current
      "122", // old
      "metadata.json", // not a cache dir
      "logs" // not a cache dir
    ] as any);
    
    // We need to mock path and other things to make it work, 
    // or just trust the logic if we mock correctly.
    
    await installer.cleanupOldCaches();

    expect(fs.rm).toHaveBeenCalledWith(expect.stringContaining("122"), expect.objectContaining({ recursive: true }));
    expect(fs.rm).not.toHaveBeenCalledWith(expect.stringContaining("123"), expect.any(Object));
  });
});
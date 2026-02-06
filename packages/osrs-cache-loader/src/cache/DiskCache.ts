import fs from 'fs/promises';
import path from 'path';
import { ArchiveData, CacheProvider, CacheVersion, IndexData, hash } from "./Cache";
import { OpenRS2IndexData } from "./OpenRS2Cache";
import { XTEAKeyManager } from "./xtea";
import { getCacheDir } from "../paths";

export class DiskCacheProvider implements CacheProvider {
	private indexData: Map<number, Promise<OpenRS2IndexData | undefined>> = new Map();
	private keysPromise?: Promise<XTEAKeyManager>;
    private cacheDir: string;

	public constructor(
		public readonly cacheId: number
	) {
        this.cacheDir = getCacheDir(cacheId);
    }

    public async saveGroup(index: number, group: number, data: Uint8Array): Promise<void> {

	        await fs.mkdir(this.cacheDir, { recursive: true });

	        const fileName = index === 255 ? `index_255_${group}.dat` : `index_${index}_${group}.dat`;

	        const filePath = path.join(this.cacheDir, fileName);

	        await fs.writeFile(filePath, data);

	    }

	

	    public async saveKeys(keys: any[]): Promise<void> {

	        await fs.mkdir(this.cacheDir, { recursive: true });

	        const filePath = path.join(this.cacheDir, `keys.json`);

	        await fs.writeFile(filePath, JSON.stringify(keys, null, 2));

	    }

	

		public async getIndex(index: number): Promise<OpenRS2IndexData | undefined> {

	
		let id = this.indexData.get(index);
		if (!id) {
			this.indexData.set(
				index,
				id = (async () => {
					try {
                        const filePath = path.join(this.cacheDir, `index_255_${index}.dat`);
						const buffer = await fs.readFile(filePath);
						const cdata = new Uint8Array(buffer);
                        return OpenRS2IndexData.decode(cdata, index);
					} catch (e) {
						return undefined;
					}
				})(),
			);
		}
		return id;
	}

	public async getArchives(index: number): Promise<number[] | undefined> {
		if (index === 255) return undefined;
		let idx = await this.getIndex(index);
		if (!idx) {
			return;
		}

		return Array.from(idx.archives.keys());
	}

	public async getArchive(index: number, archive: number): Promise<ArchiveData | undefined> {
		if (index === 255) {
			let am = new ArchiveData(255, archive);
			try {
                const filePath = path.join(this.cacheDir, `index_255_${archive}.dat`);
				const buffer = await fs.readFile(filePath);
				am.compressedData = new Uint8Array(buffer);
				return am;
			} catch (e) {
				return undefined;
			}
		}
		let idx = await this.getIndex(index);
		if (!idx) {
			return;
		}
		let am = idx.archives.get(archive);
		if (!am) {
			return;
		}
		if (!am.compressedData) {
			try {
                const filePath = path.join(this.cacheDir, `index_${index}_${archive}.dat`);
				const buffer = await fs.readFile(filePath);
				am.compressedData = new Uint8Array(buffer);
			} catch (e) {
				return undefined;
			}
		}
		return am;
	}

	public async getArchiveByName(index: number, name: string | number): Promise<ArchiveData | undefined> {
		let namehash = hash(name);

		let idx = await this.getIndex(index);
		if (!idx) {
			return;
		}

		for (let ar of idx.archives.values()) {
			if (ar.namehash === namehash) {
				if (!ar.compressedData) {
					try {
                        const filePath = path.join(this.cacheDir, `index_${index}_${ar.archive}.dat`);
						const buffer = await fs.readFile(filePath);
						ar.compressedData = new Uint8Array(buffer);
					} catch (e) {
						return undefined;
					}
				}
				return ar;
			}
		}
	}

	public async getVersion(index: number): Promise<CacheVersion> {
		return {
			era: "osrs",
			indexRevision: (await this.getIndex(index))?.revision ?? 0,
		};
	}

	public async getKeys(): Promise<XTEAKeyManager> {
		if (this.keysPromise) {
			return this.keysPromise;
		}
		return this.keysPromise = (async () => {
			const keys = new XTEAKeyManager();
			try {
                const filePath = path.join(this.cacheDir, `keys.json`);
				const content = await fs.readFile(filePath, 'utf-8');
                const fetchedKeys = JSON.parse(content);
				keys.loadKeys(fetchedKeys);
			} catch (e) {
				// console.warn("Failed to load XTEA keys from disk:", e);
			}
			return keys;
		})();
	}
}

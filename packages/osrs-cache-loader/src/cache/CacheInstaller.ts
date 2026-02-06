import { OpenRS2Client } from "../openrs2-client";
import { OpenRS2Cache as OpenRS2CacheMetadata } from "../types";
import { DiskCacheProvider } from "./DiskCache";
import { OpenRS2CacheProvider } from "./OpenRS2Cache";

export class CacheInstaller {
    private disk: DiskCacheProvider;
    private web: OpenRS2CacheProvider;

    constructor(
        public readonly metadata: OpenRS2CacheMetadata,
        private readonly client: OpenRS2Client
    ) {
        this.disk = new DiskCacheProvider(metadata.id);
        this.web = new OpenRS2CacheProvider(metadata, client);
    }

    /**
     * Downloads and saves the entire cache to disk.
     * WARNING: This can be very slow and use significant bandwidth/disk space.
     */
    async install(indicesToInstall?: number[]): Promise<void> {
        console.log(`Installing cache ${this.metadata.id}...`);

        // 1. Install XTEA keys
        console.log("Downloading XTEA keys...");
        const keys = await this.client.getXTEAKeys(this.metadata.scope, this.metadata.id);
        await this.disk.saveKeys(keys);

        // 2. Identify indices to download
        let indices = indicesToInstall;
        if (!indices) {
            // Download index 255 to find all indices
            console.log("Downloading index 255...");
            const buffer255 = await this.client.getGroup(this.metadata.scope, this.metadata.id, 255, 255);
            await this.disk.saveGroup(255, 255, new Uint8Array(buffer255));
            
            // Wait, index 255 doesn't have a 255 group usually? 
            // Actually OpenRS2CacheProvider uses 255 as the archive ID for reference tables.
            // In OSRS, index 255 contains the reference tables for all other indices.
            // The group ID in index 255 is the index ID.
            
            // We need to know which indices exist.
            // We can try to download all from 0 to 255, or use a list.
            indices = [];
            for (let i = 0; i < 255; i++) {
                try {
                    const buffer = await this.client.getGroup(this.metadata.scope, this.metadata.id, 255, i);
                    await this.disk.saveGroup(255, i, new Uint8Array(buffer));
                    indices.push(i);
                } catch (e) {
                    // Index doesn't exist
                }
            }
        } else {
            for (const i of indices) {
                const buffer = await this.client.getGroup(this.metadata.scope, this.metadata.id, 255, i);
                await this.disk.saveGroup(255, i, new Uint8Array(buffer));
            }
        }

        // 3. Download all groups for each index
        for (const index of indices) {
            console.log(`Downloading groups for index ${index}...`);
            const idxData = await this.disk.getIndex(index);
            if (!idxData) continue;

            const archiveIds = Array.from(idxData.archives.keys());
            await Promise.all(archiveIds.map(async (archiveId) => {
                try {
                    const buffer = await this.client.getGroup(this.metadata.scope, this.metadata.id, index, archiveId);
                    await this.disk.saveGroup(index, archiveId, new Uint8Array(buffer));
                } catch (e) {
                    console.warn(`Failed to download archive ${index}:${archiveId}`);
                }
            }));
        }

        console.log(`Cache ${this.metadata.id} installed successfully.`);
    }
}

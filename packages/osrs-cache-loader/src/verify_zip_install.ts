import { OpenRS2Client } from "./openrs2-client";
import { CacheInstaller } from "./cache/CacheInstaller";
import { MetadataStore } from "./metadata-store";
import { getCacheDir } from "./paths";
import fs from "fs/promises";

async function main() {
    const store = new MetadataStore();
    const client = new OpenRS2Client("https://archive.openrs2.org", store);
    
    console.log("Fetching latest cache metadata...");
    const latest = await client.getLatestCache("oldschool", true);
    console.log(`Latest cache ID: ${latest.id}`);

    const installer = new CacheInstaller(latest, client);
    await installer.install();

    const cacheDir = getCacheDir(latest.id);
    console.log(`Verifying contents of ${cacheDir}...`);
    
    const files = await fs.readdir(cacheDir);
    console.log(`Files in cache directory: ${files.length}`);
    console.log(`Sample files: ${files.slice(0, 10).join(", ")}`);

    if (files.includes("index_255_255.dat") || files.some(f => f.startsWith("index_"))) {
        console.log("Verification SUCCESS: Cache files found.");
    } else {
        console.log("Verification FAILURE: No cache files found.");
        process.exit(1);
    }
}

main().catch(console.error);

# Specification: OpenRS2 Client Persistence & ZIP Fetching

## Overview
The goal of this track is to optimize the `OpenRS2Client` and `HybridCacheProvider` to ensure that cache data is fetched as a single "flat" ZIP archive from OpenRS2, unzipped locally, and then referenced from disk for all subsequent requests. This avoids the inefficiency of fetching hundreds of individual groups via HTTP and ensures that for every cache update, only one major fetch occurs.

## Functional Requirements

### 1. ZIP-Based Cache Installation
- The `CacheInstaller` will be refactored to download the "flat" ZIP export from OpenRS2 (e.g., `https://archive.openrs2.org/caches/runescape/<id>/export.zip?format=flat`).
- The ZIP must be unzipped into the local cache directory defined by `getCacheDir(cacheId)`.
- The installation process is "proactive": the loader ensures a full local copy exists before proceeding with standard operations.

### 2. Update Management & Rate Limiting
- **Metadata Caching:** To minimize API calls, the "latest cache" check from OpenRS2 will be cached.
    - **Default Background Check:** Max once per hour.
    - **Manual/UI Forced Refresh:** Max once every 5 minutes.
- **Update Logic:** 
    - On startup, if the local cache is older than the rate-limit threshold, check for a new ID.
    - If a new cache is available, the new ZIP is downloaded and unzipped.
    - **Cleanup:** The previous local cache directory MUST be deleted only after the new cache is successfully loaded and verified.

### 3. User Feedback & Manual Control
- The system will provide a way to manually trigger an update or re-download of the cache.
- The UI (Viewer) should indicate if the currently loaded data is out of sync with the latest available version on OpenRS2 while allowing the user to continue using the "old" data until the sync is complete.

## Non-Functional Requirements
- **Performance:** Single ZIP download and local decompression is significantly faster than sequential group fetching.
- **Reliability:** The system handles download failures by restarting the fetch.
- **Efficiency:** Disk space management is critical; only the current active cache version should be stored.

## Acceptance Criteria
- [ ] `CacheInstaller` successfully downloads and unzips a "flat" ZIP from OpenRS2.
- [ ] `HybridCacheProvider` serves data from the unzipped disk location.
- [ ] Rate-limiting for OpenRS2 metadata fetching (1h background, 5m manual) is enforced.
- [ ] Old cache directories are deleted automatically after a new version is successfully initialized.
- [ ] Application correctly identifies and notifies when a local cache is "stale".

## Out of Scope
- Support for "disk" format ZIP exports (preserving `.dat2`/`.idx` structures).
- Resuming partial downloads via Range requests.

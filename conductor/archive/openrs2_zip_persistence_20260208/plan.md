# Implementation Plan: OpenRS2 ZIP Persistence & Metadata Rate Limiting

This plan outlines the steps to refactor the `OpenRS2Client` and `CacheInstaller` to use ZIP-based downloads and implement rate-limited metadata fetching.

## Phase 1: Metadata Rate Limiting [checkpoint: e19e856]
Goal: Reduce API calls to OpenRS2 for metadata by implementing a local cache with a 1h/5m rate limit.

- [x] Task: Define Metadata Persistence Structure
    - [x] Create a `MetadataStore` to persist the latest cache IDs and timestamps to disk.
    - [x] Update `paths.ts` to include a path for the metadata store.
- [x] Task: Implement Rate-Limited Metadata Fetching in `OpenRS2Client`
    - [x] **Red Phase:** Write tests in `openrs2-client.test.ts` for 1h background limit and 5m forced limit.
    - [x] **Green Phase:** Implement the caching and comparison logic in `getLatestCache`.
    - [x] **Refactor:** Clean up the fetching logic to handle errors gracefully.
- [x] Task: Verify Metadata Cache Logic
    - [x] Run `pnpm test` for the loader package.

## Phase 2: ZIP Download & Extraction [checkpoint: a282101]
Goal: Fetch the entire cache as a ZIP and extract it locally.

- [x] Task: Implement ZIP Download in `OpenRS2Client`
    - [x] **Red Phase:** Write tests for downloading the flat ZIP export.
    - [x] **Green Phase:** Add `downloadExport(cacheId, format='flat')` to `OpenRS2Client`.
- [x] Task: Implement ZIP Extraction in `CacheInstaller`
    - [x] **Red Phase:** Write tests for extracting a ZIP to the cache directory.
    - [x] **Green Phase:** Refactor `CacheInstaller.install()` to use `fflate` (or similar) to extract the downloaded ZIP.
- [x] Task: Verify ZIP Installation Flow (Refactored to Tarball)
    - [x] Perform a manual test download and extraction to ensure all files are placed correctly in `caches/<id>/`. (Verified via `verify_zip_install.ts`)

## Phase 3: Cache Lifecycle & Cleanup [checkpoint: 5b1a6c5]
Goal: Automate the transition between cache versions and clean up old data.

- [x] Task: Implement Proactive Load Logic in `Cache.load()`
    - [x] Update `Cache.load` to check for a local cache and trigger `CacheInstaller` if missing or stale.
- [x] Task: Implement Automated Cleanup
    - [x] **Red Phase:** Write tests that verify old cache directories are removed after a new one is successfully initialized.
    - [x] **Green Phase:** Implement the `cleanupOldCaches()` logic in `CacheInstaller`.
- [x] Task: Verify Cache Transition and Cleanup
    - [x] Run full integration tests to ensure no data loss during transition.

## Phase 4: Frontend Integration & Manual Controls [checkpoint: 174c299]
Goal: Expose the sync status and manual refresh to the user in the Viewer application.

- [x] Task: Implement Sync Status Indicator in Viewer
    - [x] Add a UI component to show if the current cache is out of sync with OpenRS2.
    - [x] Update TanStack Query hooks to include metadata sync status.
- [x] Task: Implement Manual Refresh Trigger
    - [x] Add a "Check for Updates" button that bypasses the 1h rate limit (subject to the 5m limit).
- [x] Task: Conductor - User Manual Verification 'OpenRS2 ZIP Persistence' (Protocol in workflow.md)

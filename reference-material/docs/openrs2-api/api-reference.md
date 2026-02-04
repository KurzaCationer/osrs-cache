---
source_url: https://archive.openrs2.org
archived_at: 2026-02-04
summary: Technical reference for the OpenRS2 Archive API, covering cache downloads, XTEA keys, and map images.
version: latest
---
# OpenRS2 Archive API Reference

The OpenRS2 Archive API provides endpoints for accessing game cache data, XTEA keys, and map images.

## General Information

- **Base URL:** `https://archive.openrs2.org`
- **CORS:** All endpoints accept requests from any origin.
- **Range Requests:** Not supported.
- **Authentication:** No explicit authentication requirements mentioned.

## Endpoints

### Caches

#### List All Caches
- **Endpoint:** `/caches.json`
- **Method:** GET
- **Format:** JSON array
- **Description:** Returns a list of all available caches with metadata (scope, game, environment, language, build, timestamps, sources, statistics).

#### Download Cache (Disk Format)
- **Endpoint:** `/caches/<scope>/<id>/disk.zip`
- **Method:** GET
- **Format:** ZIP archive
- **Description:** Downloads cache as `.dat/.idx` or `.dat2/.idx` files.

#### Download Cache (Flat-File Format)
- **Endpoint:** `/caches/<scope>/<id>/flat-file.tar.gz`
- **Method:** GET
- **Format:** Gzipped tarball
- **Description:** Downloads cache where each file represents a single cache file or group.

#### Get Cache XTEA Keys (JSON)
- **Endpoint:** `/caches/<scope>/<id>/keys.json`
- **Method:** GET
- **Format:** JSON array
- **Description:** Returns valid XTEA keys for a specific cache (archive, group, name hash, name, mapsquare, key).

#### Get Cache XTEA Keys (ZIP)
- **Endpoint:** `/caches/<scope>/<id>/keys.zip`
- **Method:** GET
- **Format:** ZIP archive
- **Description:** Downloads a ZIP of valid XTEA keys for loc groups as separate text files.

#### Get Cache Map Image
- **Endpoint:** `/caches/<scope>/<id>/map.png`
- **Method:** GET
- **Format:** PNG image
- **Description:** Renders a map image with colored outlines indicating key validity.

### Files and Groups

#### Get Single File/Group
- **Endpoint:** `/caches/<scope>/<id>/archives/<archive>/groups/<group>.dat`
- **Method:** GET
- **Format:** Binary
- **Description:** Returns a single file or group from a cache.

#### Get Single File/Group (Versioned/Checksummed)
- **Endpoint:** `/caches/<scope>/archives/<archive>/groups/<group>/versions/<version>/checksums/<checksum>.dat`
- **Method:** GET
- **Format:** Binary
- **Description:** Faster alternative for downloading single files/groups using version and checksum.

### XTEA Keys

#### All Keys
- **Endpoint:** `/keys/all.json`
- **Method:** GET
- **Format:** JSON array
- **Description:** Returns all XTEA keys in the database (including unvalidated candidate keys).

#### Valid Keys
- **Endpoint:** `/keys/valid.json`
- **Method:** GET
- **Format:** JSON array
- **Description:** Returns XTEA keys validated against at least one cache.

## Resources & Links

- [OpenRS2 Archive Website](https://archive.openrs2.org/)
- [API Documentation](https://archive.openrs2.org/api)
- [Cache2 (Library for using these caches)](../cache2/api-reference.md)

---
Source: [OpenRS2 Archive API](https://archive.openrs2.org/api)

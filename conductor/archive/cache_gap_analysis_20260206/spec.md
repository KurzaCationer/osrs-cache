# Specification: Gap Analysis - Asset Decoding Parity with Cache2

## Overview

This track focuses on identifying and documenting the discrepancies between `@kurza/osrs-cache-loader` and the `cache2` library. The primary goal is to perform a comprehensive audit of all asset types supported by `cache2` that are currently either missing or marked as "encoded" (not fully decoded) in our implementation. This research will serve as the foundation for future implementation tracks.

## Functional Requirements

- **`cache2` Audit:** Clone and analyze the `cache2` repository to identify all supported asset types and their decoding status.
- **Gap Identification:** Compare the findings against the current state of `@kurza/osrs-cache-loader`.
- **Comprehensive Documentation:** Create a detailed research document in `reference-material/docs/cache-gap-analysis.md`.
- **Implementation Details:** For each identified "encoded" type, document key implementation details from `cache2` (e.g., opcode logic, field structures, dependencies) to accelerate future development.
- **Prioritization:** Categorize the identified gaps and create a prioritized list of asset types for future implementation.
- **Handover Preparation:** Create a concise "Implementation Track Note" that summarizes the research findings and provides a clear starting point for the track that will actually implement the decoding logic.

## Non-Functional Requirements

- **Documentation Standards:** The research document must follow the project's documentation style, using clear tables and references to source code.
- **Accuracy:** Ensure asset names and internal IDs match the conventions used in `cache2` for consistency.

## Acceptance Criteria

- [ ] Successful cloning and analysis of the `cache2` repository.
- [ ] A new file `reference-material/docs/cache-gap-analysis.md` exists.
- [ ] The document includes a table listing all asset types supported by `cache2` that are not yet fully decoded in `@kurza/osrs-cache-loader`.
- [ ] Each entry in the table includes the asset type name, a link/reference to the `cache2` implementation, and captured implementation details (opcodes, structures).
- [ ] A prioritized list of next steps for implementation is provided in the documentation.
- [ ] A dedicated section or file contains the "Implementation Track Note" for the next phase of development.

## Out of Scope

- Implementation of any new loaders or decoding logic in `@kurza/osrs-cache-loader`.
- Creation of placeholder classes or boilerplate code.
- Changes to the OSRS Cache Viewer or Documentation Site (except for the research document itself).

# Implementation Plan: library-archivist Skill Enhancement

This plan outlines the steps to upgrade the `library-archivist` skill to be more proactive, traceable, and reliable, adhering to the approved specification.

## Phase 1: Ingestion & Metadata Standards [checkpoint: 44928ac]
Focus on defining the new frontmatter structure and updating the ingestion/sorting logic.

- [x] Task: Define the YAML Frontmatter schema and update `SKILL.md` instructions for the Ingestion/Sorting workflows.
- [x] Task: Update the "Sorting" workflow in `SKILL.md` to include mandatory Markdown format and Link validation steps.
- [x] Task: Update the "URL Ingestion" workflow in `SKILL.md` to require automated summarization and version comparison logic.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Ingestion & Metadata' (Protocol in workflow.md)

## Phase 2: Proactive Behavior & Fallback Logic [checkpoint: 64839f9]
Focus on the skill's trigger logic and the search-search-verify-archive flow.

- [x] Task: Update the `Core Mandate` and `Retrieval` sections of `SKILL.md` to enforce proactive checking on all technical queries.
- [x] Task: Implement the "Search Fallback" logic in `SKILL.md`, including user verification and the prompt to archive.
- [x] Task: Broaden the trigger phrases in `SKILL.md` to capture more natural language documentation requests.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Proactive Behavior' (Protocol in workflow.md)

## Phase 3: Migration & Final Verification [checkpoint: 5f50959]
Update existing documents and perform a full end-to-end test.

- [x] Task: Update all existing files in `reference-material/docs/` to follow the new YAML frontmatter format.
- [x] Task: Perform an end-to-end verification by archiving a new library (e.g., `zod` or `tailwind-merge`) and verifying proactive retrieval.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Migration and Verification' (Protocol in workflow.md)

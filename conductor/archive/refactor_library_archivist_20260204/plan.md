# Implementation Plan: Refactor Library Archivist into Specialized Skill Set

This plan outlines the steps to decompose the monolithic `library-archivist` skill into four specialized skills: Retriever, Researcher, Librarian, and Cleaner.

## Phase 1: Preparation & Scaffolding [checkpoint: 8501cf8]
- [x] Task: Create directory structure for new skills in `.gemini/skills/`
- [x] Task: Initialize `metadata.json` for the track
- [x] Task: Conductor - User Manual Verification 'Phase 1: Preparation & Scaffolding' (Protocol in workflow.md)

## Phase 2: Skill Development - Retriever & Researcher [checkpoint: 488ecc7]
- [x] Task: Implement `archivist-retriever` skill with explicit "Library First" mandates and activation triggers
- [x] Task: Implement `archivist-researcher` skill focusing on external search and user-approved ingestion
- [x] Task: Write tests to verify triggers for Retriever and Researcher (mocking search failure for Researcher)
- [x] Task: Conductor - User Manual Verification 'Phase 2: Skill Development - Retriever & Researcher' (Protocol in workflow.md)

## Phase 3: Skill Development - Librarian & Cleaner [checkpoint: 814f190]
- [x] Task: Implement `archivist-librarian` skill for organization and standardization (kebab-case, frontmatter)
- [x] Task: Implement `archivist-cleaner` skill with logic for deduplication (content/frontmatter), link normalization, and dead link detection
- [x] Task: Write tests for `archivist-cleaner` using sample "dirty" documentation files
- [x] Task: Conductor - User Manual Verification 'Phase 3: Skill Development - Librarian & Cleaner' (Protocol in workflow.md)

## Phase 4: Integration & Cleanup [checkpoint: 1f2af7f]
- [x] Task: Remove the legacy `.gemini/skills/library-archivist/` directory
- [x] Task: Verify all four new skills are correctly recognized by the environment
- [x] Task: Run full project verification (`pnpm run check`)
- [x] Task: Conductor - User Manual Verification 'Phase 4: Integration & Cleanup' (Protocol in workflow.md)

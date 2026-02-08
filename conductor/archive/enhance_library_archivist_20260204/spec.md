# Specification: library-archivist Skill Enhancement

## Overview

Improve the `library-archivist` skill to be more proactive, traceable, and reliable. The skill should move from a purely manual tool to a seamless part of the development workflow, ensuring that reference materials are well-maintained and automatically leveraged.

## Functional Requirements

### 1. Seamless Integration & Proactive Retrieval

- The skill must automatically check the `reference-material/` directory for any technical queries involving libraries, frameworks, or concepts mentioned in the project.
- If relevant documentation is found, it should be integrated into the response without requiring an explicit "look up" command.
- **Fallback Mechanism:** If information is missing from the archive:
  - The AI should search for the information online.
  - The AI must present the found information to the user for verification.
  - Once verified, the AI should prompt the user to add the source/document to the `ingestion/` folder for permanent archiving.

### 2. Traceability & Metadata (YAML Frontmatter)

- All archived documents in `reference-material/docs/` must include a YAML frontmatter header.
- Required fields: `source_url`, `archived_at`, `summary`, and `version`.
- The skill must be able to update these fields when documentation is refreshed.

### 3. Enhanced Ingestion Pipeline

When a file is moved from `ingestion/` to `docs/`, the skill must perform the following:

- **Format Validation:** Ensure the file is valid Markdown.
- **Link Validation:** Verify that internal and external links are active.
- **Automatic Summarization:** Generate a concise summary for the frontmatter.
- **Version Management:** If the document already exists, perform a comparison and highlight significant changes/updates to the user.

### 4. Broadened Trigger Logic

- Update the skill's instructions to trigger on a wider range of natural language queries related to "how-to," "API reference," or "documentation" for specific technologies used in the project.

## Non-Functional Requirements

- **Efficiency:** Document lookups should be indexed or cached to prevent slow response times during "seamless" checks.
- **Consistency:** All archived files must adhere to the same frontmatter structure.

## Acceptance Criteria

- [ ] Queries about "PandaCSS" or "TanStack" (already in the archive) automatically pull from local docs.
- [ ] New files added to `ingestion/` are automatically processed with frontmatter and validation.
- [ ] Searching for a new library (not in archive) triggers an online search and a prompt to archive the result.
- [ ] All existing files in `reference-material/docs/` are updated to include the new frontmatter structure.

## Out of Scope

- Building a web-based UI for the library (it remains a CLI/skill-based tool).
- Migrating non-technical project documents (like `product.md`) into the archive.

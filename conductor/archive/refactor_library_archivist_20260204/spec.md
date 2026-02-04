# Specification: Refactor Library Archivist into Specialized Skill Set

## Overview
This track involves decomposing the existing monolithic `library-archivist` skill into a suite of specialized, granular skills. This modular approach aims to improve the AI's precision, reliability, and adherence to the "Library First" mandate by providing specific instructions and triggers for each phase of documentation management.

## Functional Requirements

### 1. Skill Decomposition
Replace the existing `.gemini/skills/library-archivist/SKILL.md` with four distinct skills located directly under `.gemini/skills/`:

- **`archivist-retriever`**:
    - **Trigger**: Any task involving libraries, tools, or concepts (e.g., "How do I use [X]?", "Implement [X]").
    - **Focus**: Proactively searching `./reference-material/docs` and applying found knowledge. Explicitly instructs the AI to prioritize local documentation over internal knowledge.
- **`archivist-researcher`**:
    - **Trigger**: Activated when the `archivist-retriever` fails to find sufficient information.
    - **Focus**: Fetching new documentation via `web_fetch`/`google_web_search`, summarizing for user approval, and preparing it for ingestion.
- **`archivist-librarian`**:
    - **Trigger**: Triggered after successful research or when files exist in `./reference-material/ingestion`.
    - **Focus**: Categorizing (kebab-case), standardizing (Markdown + YAML frontmatter), and moving files to their permanent locations.
- **`archivist-cleaner`**:
    - **Trigger**: Explicit user request for library maintenance/cleanup.
    - **Focus**: 
        - **Deduplication**: Removing identical content and redundant frontmatter within the document body.
        - **Normalization**: Standardizing links and removing redundant links.
        - **Validation**: Detecting dead links and auditing cross-references between docs.

### 2. Standardization
Each skill must follow the Gemini CLI skill format, including:
- YAML frontmatter (name, description).
- Clear "Core Mandates".
- Detailed "Workflow" steps.
- Specific "Triggers".

## Non-Functional Requirements
- **Consistency**: All skills must adhere to the project's existing Markdown and directory structure conventions.
- **Redundancy Avoidance**: The refactor must ensure no overlap in triggers that could cause conflicting skill activations.

## Acceptance Criteria
- [ ] Existing `library-archivist` skill directory is removed.
- [ ] Four new skills (`archivist-retriever`, `archivist-researcher`, `archivist-librarian`, `archivist-cleaner`) are created in `.gemini/skills/`.
- [ ] Each skill correctly defines its triggers as specified.
- [ ] `archivist-cleaner` correctly identifies and handles duplicate frontmatter and dead links in a test scenario.
- [ ] All skills are registered/available to the Gemini CLI.

## Out of Scope
- Modifying the actual content of the documentation files (except for the cleanup skill's automated actions).
- Implementing automated periodic cleanup (cleanup is manual/on-request only).

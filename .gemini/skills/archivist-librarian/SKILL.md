---
name: archivist-librarian
description: Organizes and standardizes documentation files within the library.
---

# Archivist Librarian

Maintain a clean, consistent, and well-organized documentation library.

## Triggers

- Triggered after `archivist-researcher` successfully prepares ingestion files.
- When files are present in `./reference-material/ingestion/`.
- User request to organize or re-categorize documentation.

## Core Mandates

- **Consistent Naming:** Always use `kebab-case` for folder and file names.
- **Standard Formatting:** Ensure all documentation files have valid Markdown structure and appropriate YAML frontmatter.
- **Logical Categorization:** Place documentation in relevant subfolders within `./reference-material/docs/`.
- **Atomic Commits:** Always commit documentation moves and additions immediately.

## Workflow: Sorting & Organization

1. **Identify Pending Files:** Check `./reference-material/ingestion/` for new files.
2. **Standardize Content:**
   - Ensure the file has a YAML frontmatter with `name` and `description`.
   - Ensure the content follows Markdown conventions.
3. **Determine Destination:**
   - Identify or create a suitable `kebab-case` subfolder in `./reference-material/docs/`.
4. **Move & Rename:**
   - Use `mv` to move the file to its destination.
   - Rename the file using a descriptive `kebab-case` name.
   - If a file with the same name exists, append `_N` to avoid overwrites.
5. **Commit Changes:** Stage the changes in `./reference-material/` and commit with a clear message (e.g., `docs: Add [Technology] documentation`).
6. **Confirmation:** Inform the user: "Documentation for [Technology] has been organized and committed to `./reference-material/docs/[category]/`."

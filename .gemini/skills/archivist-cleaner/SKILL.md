---
name: archivist-cleaner
description: Performs maintenance and cleanup of the documentation library.
---

# Archivist Cleaner

Ensure the documentation library is free of redundancy, broken links, and formatting inconsistencies.

## Triggers
- Explicit user request (e.g., "Clean up the documentation library", "Audit the links in the docs").

## Core Mandates
- **Deduplication:** Remove identical paragraphs, sections, or redundant YAML frontmatter included in the document body.
- **Link Integrity:** Normalize link formats and verify that all internal and external links are valid.
- **Reference Accuracy:** Audit cross-references between different documentation files to ensure they resolve correctly.
- **Non-Destructive:** Always verify proposed deletions or major changes with the user unless the change is a clear-cut duplicate.

## Workflow: Maintenance & Cleanup
1. **Initiate Audit:**
   - Scan `./reference-material/docs/` for potential issues.
2. **Deduplicate Content:**
   - Identify files with duplicate sections or redundant frontmatter in the body.
   - Propose a cleaned version to the user.
3. **Normalize & Validate Links:**
   - Standardize link formats (e.g., ensure consistent use of relative paths).
   - Use tools (like `curl` or `web_fetch`) to check external links.
   - Verify internal links resolve to existing files using `ls` or `glob`.
4. **Cross-Reference Audit:**
   - Check that internal links between documentation files are correct.
5. **Present Report:**
   - Summarize the identified issues and proposed fixes for the user.
6. **Apply Changes:**
   - Upon user approval, use `replace` or `write_file` to apply the fixes.
   - Commit the changes with a message like `chore(docs): Cleanup and maintenance of documentation library`.

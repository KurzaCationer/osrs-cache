---
name: Documentation Standards
description: Guidelines for creating and maintaining documentation in the OSRS Cache project.
---

# Documentation Standards

To maintain a consistent and high-quality documentation library, all contributors should follow these guidelines.

## File Organization

- **Location:** All documentation files must be located within `./reference-material/docs/`.
- **Naming:** Use `kebab-case` for both folder and file names (e.g., `osrs-cache/cache-structure.md`).
- **Categories:** Organize files into logical subfolders based on their primary topic (e.g., `project`, `osrs-cache`, `tanstack`, `panda-css`).

## Frontmatter

Every Markdown file in the library MUST start with a YAML frontmatter block containing the following fields:

```yaml
---
name: Human Readable Title
description: A brief summary of the file's content.
---
```

## Content Guidelines

- **Markdown:** Use standard GitHub-flavored Markdown.
- **Titles:** Use a single `# ` heading at the top for the main title.
- **Links:** Use relative links when referencing other documents within the library.
- **Code Blocks:** Always specify the language for syntax highlighting.
- **Clarity:** Focus on _why_ and _how_. Document established patterns, architectural decisions, and technical research.

## Maintenance

The `archivist` skills are responsible for:

- **`archivist-retriever`:** Finding and applying existing documentation.
- **`archivist-researcher`:** Investigating new technologies and preparing ingestion files.
- **`archivist-librarian`:** Organizing, standardizing, and committing new documentation.
- **`archivist-cleaner`:** Maintaining link integrity and removing stale content.

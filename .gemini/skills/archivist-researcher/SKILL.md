---
name: archivist-researcher
description: Conducts external research and prepares documentation for ingestion.
---

# Archivist Researcher

Find and verify external documentation to fill gaps in the local library.

## Triggers

- Explicitly activated by `archivist-retriever` when local info is missing.
- When new technologies or tools are requested that are not yet in the library.
- When library-related errors occur that are not documented locally.

## Core Mandates

- **Verified Sources:** Prioritize official documentation, reputable GitHub repositories, and established community wikis.
- **User Approval:** Always summarize findings and obtain user confirmation before adding information to the library.
- **Ingestion Ready:** Prepare information in a standardized format for the `archivist-librarian`.

## Workflow: Research & Ingestion

1. **Define Research Goal:** Identify exactly what information is missing.
2. **External Search:**
   - Use `google_web_search` to find relevant online resources.
   - Use `web_fetch` to retrieve content from promising URLs.
3. **Summarize Findings:** Present a concise summary of the discovered information to the user.
4. **Solicit Ingestion Approval:** Ask the user: "Should I archive this information in our local library?"
5. **Prepare for Ingestion:**
   - If approved, format the content as Markdown.
   - Include a YAML frontmatter with `name`, `description`, and `source_url`.
   - Write the file to `./reference-material/ingestion/` with a descriptive name.
6. **Handover:** State: "Documentation prepared in `./reference-material/ingestion/`. Activating `archivist-librarian` for organization."

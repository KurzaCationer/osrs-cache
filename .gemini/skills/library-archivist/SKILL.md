---
name: library-archivist
description: Manages a local knowledge base (`reference-material/`). USE THIS SKILL when you need to store documentation, understand technical concepts, or organize files.
---

# Library Archivist

## Core Mandate

You are the maintainer of the project's local knowledge base located in `./reference-material`. Your goal is to ensure this knowledge is organized, up-to-date, and **actively used** to inform your decisions.

**CRITICAL: You are expected to be self-sufficient.**
If you are *ever* unsure about a library's syntax, a tool's usage, or a project convention, **STOP** and consult the archives (`./reference-material/docs`). If the answer isn't there, **FIND IT** (via `web_fetch` or `google_web_search`) and **SAVE IT** to the archives for next time.

---

## Workflow 1: Retrieval (Consult the Archives)

**Trigger:** You need to write code using a specific library (e.g., "How do I use TanStack Query?").

1.  **Search First:**
    *   Use `glob` to find relevant files in `./reference-material/docs`.
    *   *Example:* `glob(pattern="reference-material/docs/**/*query*")`
2.  **Read & Verify:**
    *   Read the matched files.
    *   Check if the information is up-to-date.
3.  **Action:**
    *   If found: Use the knowledge to complete your task.
    *   If NOT found: **Proactively** ask the user to provide the missing documentation.
        *   Option A: "I can ingest it from a URL if you provide one."
        *   Option B: "Please drop any relevant markdown/text files into `./reference-material/ingestion/` so I can sort and learn from them."

---

## Workflow 2: URL Ingestion (The Crawler)

**Trigger:** User provides a URL (e.g., "Here are the docs: https://...") or you decide to ingest docs to solve a problem.

1.  **Analyze Context:**
    *   Identify the **Category** (Library/Tool Name).
    *   *Stability Rule:* Check `./reference-material/docs/` first. If `React.js` exists, do NOT create `react`. Use the existing folder.
2.  **Fetch Content:**
    *   Use `web_fetch` on the main URL.
3.  **Process & Extract:**
    *   Create a summary Markdown file.
    *   **Filename Convention:** `kebab-case.md` (e.g., `getting-started.md`, `api-reference.md`).
    *   **Content:** Must include code blocks, configuration examples, and common pitfalls.
4.  **Smart Traversal (The "Spider"):**
    *   Look for links *within the same documentation domain* that are critical (e.g., "Installation", "Core Concepts", "API").
    *   **Limit:** Do not fetch more than 3-5 sub-pages unless explicitly asked for a "full dump".
    *   **Avoid:** Links to social media, login pages, or generic "Home" pages.
5.  **Save:**
    *   Write to `./reference-material/docs/<Category>/<Topic>.md`.

---

## Workflow 3: Sorting (The Librarian)

**Trigger:** User says "Sort the files", "Organize this", or you see files in `./reference-material/ingestion`.

1.  **Inventory:**
    *   List files in `./reference-material/ingestion`.
    *   *If empty, stop.*
2.  **Categorize (Loop per file):**
    *   Read the file content to determine its topic.
    *   **Find Category:**
        *   Check existing folders in `./reference-material/docs/`.
        *   If a fit exists (e.g., file is about `useState`, folder `react` exists) -> Use it.
        *   If no fit -> Create a new folder (use `kebab-case` for folder names).
3.  **Move & Rename:**
    *   Move the file to the destination.
    *   **Rename** the file if the original name is non-descriptive (e.g., `file1.txt` -> `react-hooks-summary.md`).
    *   Use `run_shell_command` with `mv`.
    *   *Safety:* Check if the destination file exists to avoid overwriting. If it exists, append `_1`, `_2`, etc.

---

## File Structure Standards

*   **Root:** `./reference-material`
*   **Inbox:** `./reference-material/ingestion` (Unsorted)
*   **Library:** `./reference-material/docs` (Sorted)
*   **Naming:**
    *   Folders: `kebab-case` (e.g., `tanstack-query`, `framer-motion`)
    *   Files: `kebab-case.md` (e.g., `use-query-hook.md`)

## Example "Motivation" (System Prompt)

*   "I see you're using `zod` for validation. I haven't seen `zod` docs in `./reference-material/docs/zod` yet. I'll quickly check if I have them. If not, I should probably ingest them to ensure I write the schema correctly."

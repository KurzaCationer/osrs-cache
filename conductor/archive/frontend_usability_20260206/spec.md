# Specification: Frontend Usability Improvements

## Overview

This track focuses on improving the user interface and stability of the `osrs-cache-viewer` application. It addresses layout issues in the Asset Browser tables, fixes a hydration mismatch on the index page, and enhances the presentation of JSON asset data using `@uiw/react-json-view`.

## Functional Requirements

- **Asset Browser Table Fixes:**
  - Correct the alignment issue where table rows do not match the width of table headers.
  - Optimize the "ID" and "Name" column widths to reduce excessive spacing.
  - Ensure header and cell content are consistently aligned.
- **JSON Data Presentation:**
  - Replace raw JSON display with a collapsible tree view using `@uiw/react-json-view` (v1).
  - Implement a "Copy to Clipboard" feature for the JSON data.
  - Constrain the JSON container with a maximum height and internal scrolling to prevent page-level layout breakage.
- **Hydration Fix:**
  - Resolve the date/time hydration mismatch on the index page by ensuring the timestamp is rendered consistently, primarily using a client-side-only rendering approach.

## Non-Functional Requirements

- **Research & Documentation:** Research `@uiw/react-json-view` v1 using [this documentation](https://raw.githack.com/uiwjs/react-json-view/v1-docs/index.html) and store relevant findings in the project's reference library.
- **Performance:** Ensure the JSON tree view performs well even with larger asset data objects.
- **Maintainability:** Use PandaCSS for all layout and styling adjustments.

## Acceptance Criteria

- [ ] Asset Browser table rows are perfectly aligned with their headers across different screen sizes.
- [ ] Asset Browser "ID" and "Name" columns have appropriate, non-excessive widths.
- [ ] Expanding an asset's JSON data displays a collapsible tree view using `@uiw/react-json-view` v1.
- [ ] The expanded JSON container does not overflow its parent or cause the table to expand horizontally beyond the viewport.
- [ ] A "Copy to Clipboard" button is functional for JSON data.
- [ ] The index page no longer produces a hydration warning in the console related to the timestamp.

## Out of Scope

- Redesigning the index page table layout.
- Adding new asset types or data sources.

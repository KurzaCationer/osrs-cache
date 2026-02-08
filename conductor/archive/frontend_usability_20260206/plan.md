# Implementation Plan: Frontend Usability Improvements

## Phase 1: Research and Dependency Setup [checkpoint: 4309288]

- [x] Task: Research `@uiw/react-json-view` v1
  - [ ] Use `archivist-researcher` to ingest documentation from `https://raw.githack.com/uiwjs/react-json-view/v1-docs/index.html`.
  - [ ] Use `archivist-librarian` to organize the research in `reference-material/docs/react-json-view/`.
- [x] Task: Install `@uiw/react-json-view`
  - [ ] Add `@uiw/react-json-view` to `apps/osrs-cache-viewer/package.json`.
  - [ ] Verify the installation and version (v1.x).

## Phase 2: Resolve Index Page Hydration Mismatch [checkpoint: a4a0d99]

- [x] Task: Fix Timestamp Hydration
  - [ ] Locate the timestamp rendering logic in `apps/osrs-cache-viewer/src/routes/index.tsx`.
  - [ ] Implement a client-side-only wrapper or `useEffect` strategy to ensure the timestamp only renders on the client.
  - [ ] Verify the fix by running the development server and checking for console hydration warnings.

## Phase 3: Fix Asset Browser Table Layout and Alignment [checkpoint: 56de4e1]

- [x] Task: Investigate Table Row Alignment
- [x] Task: Implement Layout Fixes
  - [ ] Adjust the PandaCSS styles to ensure table rows expand to the full width of the container/header.
  - [ ] Optimize "ID" and "Name" column widths to be tighter and more efficient.
  - [ ] Ensure consistent alignment between header text and cell content.
  - [ ] Verify the layout across different viewport sizes.

## Phase 4: Implement JSON Tree View and Copy Feature [checkpoint: 3816cbe]

- [x] Task: Create `JsonViewer` Component
- [x] Task: Integrate `JsonViewer` into Asset Table
- [~] Task: Verification and Testing
  - [ ] Write unit tests for the `JsonViewer` component.
  - [ ] Verify the "Copy to Clipboard" functionality works as expected.

## Phase 5: Final Review and Project Standards

- [x] Task: Verify Project Standards
  - [ ] Run `pnpm run build` in the root to ensure no regression or build errors.
  - [ ] Run `pnpm run lint` to verify code quality.
- [x] Task: Conductor - User Manual Verification 'Final Review and Project Standards' (Protocol in workflow.md)

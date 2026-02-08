# Implementation Plan: Migrate Viewer Styling to PandaCSS

## Phase 1: Setup & Configuration

- [x] Task: Install PandaCSS dependencies in `apps/osrs-cache-viewer` 089755f
  - [x] Run `pnpm add -D @pandacss/dev` and `pnpm add @kurza/ui-preset`
- [x] Task: Initialize PandaCSS configuration a6b39f1
  - [x] Create `apps/osrs-cache-viewer/panda.config.ts` referencing `internal/ui-preset`
  - [x] Update `tsconfig.json` to include the generated `styled-system`
- [x] Task: Integrate PandaCSS with Vite
  - [x] Update `vite.config.ts` if necessary for PandaCSS integration
  - [x] Update `package.json` scripts to include `panda codegen`
- [x] Task: Conductor - User Manual Verification 'Phase 1: Setup & Configuration' (Protocol in workflow.md) [checkpoint: ]

## Phase 2: Component Migration

- [x] Task: Migrate Global Styles
  - [x] Convert `src/styles.css` from Tailwind directives to PandaCSS `@layer` or equivalent
- [x] Task: Migrate Core Components
  - [x] Write tests for `Header.tsx` to verify existing visual/functional state
  - [x] Convert `src/components/Header.tsx` from Tailwind to PandaCSS
- [x] Task: Migrate Route Components
  - [x] Convert `src/routes/__root.tsx`
  - [x] Convert `src/routes/index.tsx`
  - [x] Convert `src/routes/demo/table.tsx` and other demo routes
- [x] Task: Conductor - User Manual Verification 'Phase 2: Component Migration' (Protocol in workflow.md) [checkpoint: ]

## Phase 3: Cleanup & Validation

- [x] Task: Remove TailwindCSS
  - [x] Uninstall Tailwind-related packages from `apps/osrs-cache-viewer`
  - [x] Delete `tailwind.config.js` or equivalent if it exists
- [x] Task: Final Build & E2E Verification
  - [x] Run `pnpm build` in the viewer app
  - [x] Execute E2E tests to ensure no styling regressions
- [x] Task: Conductor - User Manual Verification 'Phase 3: Cleanup & Validation' (Protocol in workflow.md) [checkpoint: ]

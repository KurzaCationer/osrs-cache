# Implementation Plan: Migrate Viewer Styling to PandaCSS

## Phase 1: Setup & Configuration
- [x] Task: Install PandaCSS dependencies in `apps/osrs-cache-viewer` 089755f
    - [x] Run `pnpm add -D @pandacss/dev` and `pnpm add @kurza/ui-preset`
- [x] Task: Initialize PandaCSS configuration a6b39f1
    - [x] Create `apps/osrs-cache-viewer/panda.config.ts` referencing `internal/ui-preset`
    - [x] Update `tsconfig.json` to include the generated `styled-system`
- [ ] Task: Integrate PandaCSS with Vite
    - [ ] Update `vite.config.ts` if necessary for PandaCSS integration
    - [ ] Update `package.json` scripts to include `panda codegen`
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Setup & Configuration' (Protocol in workflow.md) [checkpoint: ]

## Phase 2: Component Migration
- [ ] Task: Migrate Global Styles
    - [ ] Convert `src/styles.css` from Tailwind directives to PandaCSS `@layer` or equivalent
- [ ] Task: Migrate Core Components
    - [ ] Write tests for `Header.tsx` to verify existing visual/functional state
    - [ ] Convert `src/components/Header.tsx` from Tailwind to PandaCSS
- [ ] Task: Migrate Route Components
    - [ ] Convert `src/routes/__root.tsx`
    - [ ] Convert `src/routes/index.tsx`
    - [ ] Convert `src/routes/demo/table.tsx` and other demo routes
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Component Migration' (Protocol in workflow.md) [checkpoint: ]

## Phase 3: Cleanup & Validation
- [ ] Task: Remove TailwindCSS
    - [ ] Uninstall Tailwind-related packages from `apps/osrs-cache-viewer`
    - [ ] Delete `tailwind.config.js` or equivalent if it exists
- [ ] Task: Final Build & E2E Verification
    - [ ] Run `pnpm build` in the viewer app
    - [ ] Execute E2E tests to ensure no styling regressions
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Cleanup & Validation' (Protocol in workflow.md) [checkpoint: ]

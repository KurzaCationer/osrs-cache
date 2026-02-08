# Specification: Migrate Viewer Styling to PandaCSS

## Goal

Replace TailwindCSS with PandaCSS in the `apps/osrs-cache-viewer` project. This will align the viewer's styling engine with `apps/osrs-cache-docs` and provide type-safe, build-time CSS.

## Scope

- **Configuration:** Install PandaCSS dependencies and set up `panda.config.ts`.
- **Infrastructure:** Update `package.json` scripts and Vite configuration.
- **Migration:** Convert all Tailwind utility classes in React components to PandaCSS (using the `css` function or patterns).
- **Cleanup:** Remove TailwindCSS dependencies and configuration files.

## Technical Details

- **Base Project:** `apps/osrs-cache-viewer`
- **Target Engine:** PandaCSS
- **Reference:** Use `apps/osrs-cache-docs/panda.config.mjs` and `internal/ui-preset` for configuration consistency.

## Verification Criteria

- All components render correctly with the new PandaCSS styles.
- Build process completes without errors.
- No TailwindCSS dependencies remain in `apps/osrs-cache-viewer`.

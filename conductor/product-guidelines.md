# Product Guidelines

## Documentation & Research Strategy
- **Hybrid Approach:** Documentation should be both highly technical and practically useful.
    - **Technical Depth:** accurately document file formats, hex offsets, and binary structures for researchers.
    - **Practical Application:** Provide clear code examples and "how-to" guides for developers using the loader to extract assets.
- **Visuals:** Use diagrams and previews where helpful to explain complex cache structures.

## Visual Identity (Viewer App)
- **Modern OSRS Fusion:** The UI should feel modern and clean (PandaCSS, minimalist layout) while paying homage to Old School RuneScape.
    - **Palette:** Incorporate OSRS-inspired colors (runes, inventory backgrounds, gold text) as accent colors or subtle themes, avoiding a full retro/skeuomorphic overhaul.
    - **Typography:** Use readable, modern fonts for UI elements, potentially using OSRS fonts for headers or specific game-related data displays.

## Engineering Standards & Workflow
- **Linting & Formatting:**
    - Enforce code quality using **ESLint** with sensible defaults across the entire monorepo.
    - **Prettier** must be run to format code before any commit.
- **Testing:**
    - **Mandatory Testing:** All new logic, especially within the loader's parsing algorithms, must be covered by tests.
    - **Refactor Cycle:** Adopt a "Red-Green-Refactor" mindset. Ensure code is clean and optimized before finalizing tasks.
- **Version Control & Deployment:**
    - **Commit & Push:** Changes should be committed and pushed frequently to ensure code availability on the development machine.
    - **CI/CD:** (Implicit) Ensure the build pipeline (Turbo) remains green.

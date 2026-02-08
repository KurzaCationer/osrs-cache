# Specification: Project-Wide Quality & Style Audit

## Overview

This track aims to perform a rigorous quality check of the entire codebase, focusing on standardizing linting rules, enforcing consistent formatting, and optimizing PandaCSS usage. The goal is to move beyond basic configurations to a highly robust and idiomatic setup that ensures long-term maintainability.

## Functional Requirements

### 1. ESLint Standardization & Expansion

- **Monorepo Harmony:** Standardize ESLint configurations across all packages (`osrs-cache-loader`, `ui-components`, `ui-preset`) and apps (`osrs-cache-viewer`, `osrs-cache-docs`).
- **Comprehensive Rule Coverage:**
  - Integrate and configure `@tanstack/eslint-plugin-query`.
  - Integrate and configure `@tanstack/eslint-plugin-router`.
  - Audit for and include any other relevant plugins for the tech stack (e.g., React, TypeScript, Astro).
- **Prettier Integration:** Integrate `eslint-config-prettier` to disable ESLint rules that might conflict with Prettier, ensuring a smooth coexistence.
- **No-Disable Policy:** Fix existing violations manually. `eslint-disable` or `eslint-ignore` are only permitted if strictly necessary (e.g., external library conflicts).

### 2. Prettier Enforcement

- **Centralized Config:** Ensure a single source of truth for Prettier configuration at the root.
- **Batch Formatting:** Implement a `pnpm run format` command in the root `package.json` to format the entire monorepo.
- **Project-Wide Compliance:** Run the formatter against all supported file types in the repository.

### 3. PandaCSS Optimization (Librarian Guidance)

- **Idiomatic Styling:** Audit PandaCSS usage to ensure it follows best practices as defined in the [PandaCSS Documentation](https://panda-css.com/llms-full.txt).
- **Eliminate Variable Styling:** Replace instances of variable/dynamic values inside `css()` method calls with idiomatic PandaCSS alternatives.
- **Enforce Structure:**
  - Use **Recipes** or **Slot Recipes (sva)** for complex, state-driven, or dynamic styles.
  - Use **CVA (Control Variance Authority)** for component variants.

### 4. Codebase Cleanup

- Fix all linting and formatting errors discovered during the audit.
- Perform logic refactoring where necessary to comply with the new, stricter rules.

## Non-Functional Requirements

- **Performance:** Ensure the linting and formatting tasks are efficient within the Turborepo pipeline.
- **Maintainability:** Configurations should be easy to understand and extend.

## Acceptance Criteria

- [ ] `pnpm run lint` passes across the entire monorepo without errors.
- [ ] `pnpm run format` runs successfully and results in no changes (idempotency).
- [ ] All PandaCSS usage avoids dynamic interpolation in `css()` calls, using recipes/cva instead.
- [ ] `pnpm run build` passes for all apps and packages.

## Out of Scope

- Major architectural refactoring unrelated to linting/styling compliance.
- Adding new functional features to the apps.

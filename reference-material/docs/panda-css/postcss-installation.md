---
source_url: https://panda-css.com/docs/installation/postcss
archived_at: 2026-02-04
summary: Guide for installing and configuring Panda CSS with PostCSS.
version: latest
---
# Panda CSS PostCSS Installation

Panda CSS integrates with PostCSS as a plugin, which is the recommended installation method.

## Installation

```bash
pnpm add -D @pandacss/dev postcss
```

## Configuration

### PostCSS Configuration (`postcss.config.cjs`)

```javascript
module.exports = {
  plugins: {
    '@pandacss/dev/postcss': {},
  },
}
```

### Panda Configuration (`panda.config.ts` or `panda.config.js`)

Define the files you want Panda to scan for tokens/utilities:

```typescript
import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // The output directory for your css system
  outdir: "styled-system",
});
```

### Package JSON Scripts

Add a `prepare` script to ensure Panda's generated code is up-to-date after installations:

```json
{
  "scripts": {
    "prepare": "panda codegen"
  }
}
```

## CSS Setup

In your main CSS entry point (e.g., `index.css`):

```css
@layer reset, base, tokens, recipes, utilities;
```

## Usage

You can now use Panda's utility functions or the generated `styled-system` in your components.

### Example

```tsx
import { css } from '../styled-system/css'

function App() {
  return (
    <div className={css({ fontSize: "2xl", fontWeight: 'bold' })}>
      Hello 🐼!
    </div>
  )
}
```

## Resources & Links

- [Official PostCSS Installation Guide](https://panda-css.com/docs/installation/postcss)
- [Full Documentation](./full-documentation.md)
- [Panda CSS Config Reference](https://panda-css.com/docs/references/config)


## IDE Setup (TSConfig)

To get autocomplete for the generated `styled-system`, add it to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/styled-system/*": ["./styled-system/*"]
    }
  }
}
```

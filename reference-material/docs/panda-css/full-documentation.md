# Panda CSS Documentation

(Source: https://panda-css.com/llms.txt)

# Intro

Panda CSS is a build-time CSS-in-JS library that generates static CSS files.
It combines the developer experience of CSS-in-JS with the performance of static CSS.

## Key Features

- **Build-time extraction**: Generates static CSS at build time
- **Type-safe**: Fully typed CSS based on your config
- **Zero runtime**: No JavaScript runtime overhead for styles
- **Modern CSS**: Uses standard CSS features (Cascade Layers, CSS Variables)
- **Framework agnostic**: Works with React, Vue, Svelte, Solid, Qwik, etc.
- **Recipe system**: Robust variant API for building component libraries
- **Style props**: styling directly in your JSX

## Installation

### CLI (Recommended)

```bash
npm install -D @pandacss/dev
npx panda init
```

### PostCSS

```bash
npm install -D @pandacss/dev postcss
```

Add to `postcss.config.js`:

```js
module.exports = {
  plugins: {
    '@pandacss/dev/postcss': {},
  },
}
```

## Configuration

Panda is configured via `panda.config.ts`.

```ts
import { defineConfig } from "@pandacss/dev"

export default defineConfig({
  // Whether to use css reset
  preflight: true,
  
  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  
  // Files to exclude
  exclude: [],
  
  // The output directory for your css system
  outdir: "styled-system",
})
```

## Core Concepts

### The `css` function

The `css` function is the primary way to author styles. It's type-safe and generates atomic CSS classes.

```ts
import { css } from '../styled-system/css'

const className = css({
  fontSize: '2xl',
  fontWeight: 'bold',
  color: 'red.500'
})
```

### Conditional Styles

Panda supports pseudo-classes and media queries via nested objects or the `_` prefix syntax.

```ts
import { css } from '../styled-system/css'

const className = css({
  bg: 'red.200',
  _hover: { bg: 'red.300' },
  _dark: { bg: 'red.800' },
  md: { fontSize: 'lg' } // media query
})
```

### Patterns

Patterns are helper functions for common layout needs.

```ts
import { stack, hstack, vstack, circle, square } from '../styled-system/patterns'

// Vertical stack with spacing
<div className={stack({ gap: '4', align: 'center' })}>
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Recipes

Recipes are used to create multi-variant styles (perfect for component libraries).

```ts
import { cva } from '../styled-system/css'

const button = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  variants: {
    visual: {
      solid: { bg: 'blue.500', color: 'white' },
      outline: { borderWidth: '1px', borderColor: 'blue.500' }
    },
    size: {
      sm: { padding: '2', fontSize: 'sm' },
      lg: { padding: '4', fontSize: 'lg' }
    }
  },
  defaultVariants: {
    visual: 'solid',
    size: 'sm'
  }
})

// Usage
const className = button({ visual: 'outline', size: 'lg' })
```

### Slot Recipes

For complex components with multiple parts.

```ts
import { sva } from '../styled-system/css'

const card = sva({
  slots: ['root', 'title', 'content'],
  base: {
    root: { p: '6', bg: 'white', rounded: 'lg' },
    title: { fontSize: 'xl', fontWeight: 'bold' },
    content: { mt: '2', color: 'gray.600' }
  },
  variants: {
    // ... variants
  }
})

// Usage
const classes = card()
// classes.root, classes.title, classes.content
```

## JSX Style Props

If enabled in config (`jsxFramework: 'react'`), you can use style props directly on components.

```tsx
import { Box, Flex, Text } from '../styled-system/jsx'

function App() {
  return (
    <Box p="4" bg="gray.100">
      <Flex align="center">
        <Text fontSize="xl" fontWeight="bold">Hello</Text>
      </Flex>
    </Box>
  )
}
```

## Theming

Customize tokens, semantic tokens, breakpoints, and more in `panda.config.ts`.

```ts
export default defineConfig({
  theme: {
    extend: {
      tokens: {
        colors: {
          primary: { value: '#0FEE0F' },
          secondary: { value: '#EE0F0F' }
        }
      },
      semanticTokens: {
        colors: {
          danger: { value: '{colors.red.500}' },
          success: { value: '{colors.green.500}' }
        }
      }
    }
  }
})
```

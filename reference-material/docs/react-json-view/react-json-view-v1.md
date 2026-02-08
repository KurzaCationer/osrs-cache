---
name: @uiw/react-json-view v1
description: Documentation and usage guidelines for the @uiw/react-json-view (v1) component.
source_url: https://raw.githack.com/uiwjs/react-json-view/v1-docs/index.html
---

# @uiw/react-json-view v1

A React component for displaying and editing JSON objects/arrays. Note: v2 is a complete redesign; this documentation covers v1.

## Installation

```bash
pnpm add @uiw/react-json-view@1
```

## Basic Usage

```jsx
import JsonView from '@uiw/react-json-view'

const data = {
  /* your JSON */
}

;<JsonView value={data} />
```

## Key Props

- `value` (Object|Array): The JSON data to display.
- `keyName` (string|false): Name of the root node (default: "root").
- `theme` (string): Theme for the view (e.g., "light", "dark").
- `collapsed` (boolean|number): Whether to collapse by default. Number indicates depth (default: false).
- `displayDataTypes` (boolean): Show data types (default: true).
- `displayObjectSize` (boolean): Show object/array size (default: true).
- `enableClipboard` (boolean): Show copy button (default: true).
- `indentWidth` (number): Indentation width (default: 4).
- `onCopied` (function): Callback when data is copied.

## Performance & Styling

- Wrap in a container with `max-height` and `overflow-y: auto` for large objects.
- Use `style` or `className` for additional PandaCSS styling.

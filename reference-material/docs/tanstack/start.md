---
title: TanStack Start
description: Core concepts and basic usage for TanStack Start.
source: https://tanstack.com/start/latest/docs/framework/react/overview
---

# TanStack Start

A full-stack React framework built on TanStack Router.

## Core Concepts

- **Full-Stack:** SSR, streaming, and server functions out of the box.
- **Vite-Powered:** Leverages Vite for bundling and development.
- **Router-First:** Built directly on top of TanStack Router for type-safe routing.
- **Server Functions:** Type-safe RPCs for client-to-server communication.

## Basic Usage

TanStack Start extends TanStack Router. A typical entry point involves setting up the `StartServer` and `StartClient`.

```tsx
// main.tsx
import { StartClient } from '@tanstack/react-start'
import { createRouter } from './router'

const router = createRouter()

export default function App() {
  return <StartClient router={router} />
}
```

## Resources & Links

- [Official Documentation](https://tanstack.com/start/latest/docs/framework/react/overview)
- [GitHub Repository](https://github.com/tanstack/router)
- [Installation Guide](https://tanstack.com/start/latest/docs/framework/react/build-from-scratch)
- [TanStack Index](./index.md)

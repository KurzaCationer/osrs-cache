---
title: TanStack Router (React)
description: Core concepts and basic usage for TanStack Router in React.
source: https://tanstack.com/router/latest/docs/framework/react/overview
---

# TanStack Router (React)

A fully type-safe React router with built-in data fetching, nested routing, and more.

## Core Concepts

- **100% Type-Safe:** Inferred types for routes, params, and search queries.
- **Nested Routing:** First-class support for complex layouts and nested routes.
- **Data Loading:** Built-in loaders with SWR caching.
- **Search Param APIs:** Type-safe JSON-first state management in the URL.

## Basic Usage

### 1. Define Routes

```tsx
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'

const rootRoute = createRootRoute()

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
})

const routeTree = rootRoute.addChildren([indexRoute])
const router = createRouter({ routeTree })
```

### 2. Navigation

```tsx
import { Link } from '@tanstack/react-router'

function Navigation() {
  return (
    <Link to="/" activeProps={{ style: { fontWeight: 'bold' } }}>
      Home
    </Link>
  )
}
```

## Resources & Links

- [Official Documentation](https://tanstack.com/router/latest/docs/framework/react/overview)
- [GitHub Repository](https://github.com/tanstack/router)
- [Installation Guide](https://tanstack.com/router/latest/docs/framework/react/quick-start)
- [TanStack Index](./index.md)

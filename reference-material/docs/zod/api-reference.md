---
source_url: https://raw.githubusercontent.com/colinhacks/zod/master/README.md
archived_at: 2026-02-04
summary: TypeScript-first schema declaration and validation library. Covers installation and basic usage for strings and objects.
version: latest
---
# Zod

TypeScript-first schema declaration and validation library with static type inference.

## Installation

```bash
pnpm add zod
```

## Basic Usage

```ts
import { z } from "zod";

// Creating a schema for a string
const myString = z.string();

// Validating a string
myString.parse("hello"); // => "hello"
myString.parse(123); // => throws ZodError

// Creating a schema for an object
const User = z.object({
  username: z.string(),
  age: z.number(),
});

// Validating an object
User.parse({ username: "Tom", age: 42 }); // => { username: "Tom", age: 42 }
```

## Type Inference

You can extract the TypeScript type of any schema with `z.infer<typeof schema>`.

```ts
type User = z.infer<typeof User>;
// { username: string; age: number; }
```

## Resources & Links

- [Official Website](https://zod.dev/)
- [GitHub Repository](https://github.com/colinhacks/zod)
- [NPM Package](https://www.npmjs.com/package/zod)


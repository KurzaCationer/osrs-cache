//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  {
    ignores: [
      '.output/**',
      'src/styled-system/**',
      'eslint.config.js',
      'prettier.config.js',
      'postcss.config.cjs',
    ],
  },
  ...tanstackConfig,
]
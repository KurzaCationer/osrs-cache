import { tanstackConfig } from '@tanstack/eslint-config'
import eslintPluginAstro from 'eslint-plugin-astro'
import pandaPlugin from '@pandacss/eslint-plugin'
import reactPlugin from 'eslint-plugin-react'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    ignores: [
      'dist/**',
      '.astro/**',
      '.turbo/**',
      'src/styled-system/**',
      'eslint.config.js',
      'panda.config.mjs',
      'postcss.config.cjs',
      'astro.config.mjs',
    ],
  },
  ...tanstackConfig,
  ...eslintPluginAstro.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@pandacss': pandaPlugin,
      react: reactPlugin,
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...pandaPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.astro'],
    plugins: {
      '@pandacss': pandaPlugin,
    },
    rules: {
      ...pandaPlugin.configs.recommended.rules,
    },
  },
]

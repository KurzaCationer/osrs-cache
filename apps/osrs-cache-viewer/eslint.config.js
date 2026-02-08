//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import pandaPlugin from '@pandacss/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import pluginQuery from '@tanstack/eslint-plugin-query'
import pluginRouter from '@tanstack/eslint-plugin-router'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  {
    ignores: [
      '.output/**',
      '.tanstack/**',
      '.turbo/**',
      'src/styled-system/**',
      'eslint.config.js',
      'prettier.config.js',
      'postcss.config.cjs',
    ],
  },
  ...tanstackConfig,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@typescript-eslint': tsPlugin,
      '@pandacss': pandaPlugin,
      '@tanstack/query': pluginQuery,
      '@tanstack/router': pluginRouter,
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
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...pandaPlugin.configs.recommended.rules,
      ...pluginQuery.configs.recommended.rules,
      ...pluginRouter.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // React 17+
      '@pandacss/no-dynamic-styling': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  eslintConfigPrettier,
]

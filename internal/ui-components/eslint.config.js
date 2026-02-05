import { tanstackConfig } from '@tanstack/eslint-config'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    ignores: ['dist/**', '.turbo/**', 'eslint.config.js'],
  },
  ...tanstackConfig,
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },
]

import { definePreset } from '@pandacss/dev';

export const uiPreset = definePreset({
  theme: {
    extend: {
      tokens: {
        colors: {
          brand: { value: '#0070f3' },
          secondary: { value: '#ff0080' }
        },
        fonts: {
          body: { value: 'system-ui, sans-serif' },
          mono: { value: 'Menlo, monospace' }
        }
      }
    }
  }
});

import { definePreset } from '@pandacss/dev';
import presetBase from "@pandacss/preset-base"
import presetPanda from "@pandacss/preset-panda"

export const uiPreset = definePreset({
  presets: [presetBase, presetPanda],
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

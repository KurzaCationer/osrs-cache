import { definePreset } from '@pandacss/dev';
import presetBase from "@pandacss/preset-base"
import presetPanda from "@pandacss/preset-panda"

export const uiPreset = definePreset({
  presets: [presetBase, presetPanda],
  theme: {
    extend: {
      tokens: {
        colors: {
          osrsGold: { value: '#ff9800' },
          osrsGoldMuted: { value: '#e68a00' },
          osrsBlue: { value: '#2196f3' },
          osrsBlueMuted: { value: '#1e88e5' },
          neutral: {
            950: { value: '#0a0a0a' },
            900: { value: '#141414' },
            850: { value: '#1f1f1f' },
            800: { value: '#262626' },
            750: { value: '#1a1a1a' }
          }
        },
        fonts: {
          body: { value: 'Inter, system-ui, sans-serif' },
          mono: { value: 'JetBrains Mono, Menlo, monospace' }
        }
      },
      semanticTokens: {
        colors: {
          primary: { 
            default: { value: '{colors.osrsGold}' },
            muted: { value: '{colors.osrsGoldMuted}' }
          },
          secondary: { 
            default: { value: '{colors.osrsBlue}' },
            muted: { value: '{colors.osrsBlueMuted}' }
          },
          bg: {
            default: { value: '{colors.neutral.950}' },
            surface: { value: '{colors.neutral.900}' },
            muted: { value: '{colors.neutral.850}' },
            active: { value: '{colors.gray.800}' }
          },
          text: {
            main: { value: '#ffffff' },
            muted: { value: '{colors.gray.400}' },
            dim: { value: '{colors.gray.500}' }
          },
          error: {
            default: { value: '{colors.red.500}' },
            muted: { value: '{colors.red.700}' }
          },
          border: {
            default: { value: '{colors.neutral.800}' },
            subtle: { value: '{colors.neutral.750}' }
          }
        }
      }
    }
  }
});

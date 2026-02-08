import { defineConfig } from '@pandacss/dev'
import { uiPreset } from '@kurza/ui-preset'

export default defineConfig({
  presets: [uiPreset],
  preflight: false,
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  theme: {
    extend: {},
  },
  jsxFramework: 'react',
  outdir: 'src/styled-system',
})

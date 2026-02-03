import { defineConfig } from "@pandacss/dev";
import { uiPreset } from "@kurza/ui-preset";

export default defineConfig({
  presets: [uiPreset],
  preflight: true,
  include: ["./src/**/*.{js,jsx,ts,tsx,astro}"],
  exclude: [],
  theme: {
    extend: {},
  },
  outdir: "src/styled-system",
});

import { defineConfig } from "@pandacss/dev";
import { uiPreset } from "@kurza/ui-preset";

export default defineConfig({
  presets: [uiPreset],
  preflight: true,
  include: ["./app/**/*.{js,jsx,ts,tsx}"],
  exclude: [],
  theme: {
    extend: {},
  },
  outdir: "styled-system",
});

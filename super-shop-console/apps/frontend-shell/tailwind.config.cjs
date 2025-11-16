const themePreset = require("../../packages/theme/tailwind.preset.cjs");

module.exports = {
  presets: [themePreset],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
};



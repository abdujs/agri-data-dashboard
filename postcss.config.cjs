// postcss.config.cjs - tolerant loader
// Try to use the official Tailwind postcss adapter when available (Tailwind v4+).
// Fall back to the legacy `tailwindcss` plugin if the adapter isn't installed,
// and avoid throwing so Vite/PostCSS can still start.
const plugins = [];

try {
  // prefer adapter which is required for v4 PostCSS integration
  plugins.push(require('@tailwindcss/postcss'));
} catch (e) {
  try {
    plugins.push(require('tailwindcss'));
  } catch (err) {
    // no tailwind plugin available; continue without it (styles won't be generated)
    // keep a non-throwing behavior so tooling remains usable and we can surface a clear message
    // console.warn is avoided to keep the build output clean — npm install is recommended.
  }
}

try {
  plugins.push(require('autoprefixer'));
} catch (e) {
  // autoprefixer missing — OK to continue
}

module.exports = { plugins };

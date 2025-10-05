/**
 * PostCSS Configuration
 * 
 * PostCSS is a tool for transforming CSS with JavaScript plugins.
 * This configuration is required for Tailwind CSS to work properly.
 * 
 * Plugins:
 * - tailwindcss: Processes Tailwind utility classes
 * - autoprefixer: Adds vendor prefixes to CSS for browser compatibility
 */

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
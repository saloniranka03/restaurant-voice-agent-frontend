/**
 * Tailwind CSS Configuration
 *
 * This configuration file tells Tailwind which files to scan for class names
 * and allows customization of the default theme.
 *
 * Content Array:
 * - Specifies all template files where Tailwind classes are used
 * - Supports JS, JSX, TS, and TSX files in the src directory
 *
 * Theme:
 * - Extend the default theme with custom values
 * - Add custom colors, spacing, fonts, etc.
 *
 * Plugins:
 * - Add official or third-party Tailwind plugins
 * - Examples: @tailwindcss/forms, @tailwindcss/typography
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify files to scan for Tailwind classes
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      // Custom theme extensions go here
      // Example:
      // colors: {
      //   'custom-blue': '#1fb6ff',
      // },
      // spacing: {
      //   '128': '32rem',
      // },
    },
  },

  plugins: [
    // Add Tailwind plugins here
    // Example:
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};

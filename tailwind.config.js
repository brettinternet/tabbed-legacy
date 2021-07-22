/**
 * https://github.com/tailwindlabs/tailwindcss/discussions/1077#discussioncomment-528222
 *
 * @type {import("@types/tailwindcss/tailwind-config").TailwindConfig }
 */
module.exports = {
  purge: ['./src/popup/**/*.{svelte,html}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xxs: '320px',
        xs: '481px',
      },
      zIndex: {
        header: 100,
        'menu-accordion': 80,
        modal: 150,
        overlay: 140,
      },
      fontSize: {
        xxs: '.6rem',
      },
      maxHeight: {
        modal: 'calc(100vh - 10rem)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

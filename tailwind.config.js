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
        'context-menu': 200,
      },
      fontSize: {
        xxs: '.6rem',
      },
      height: {
        header: '60px',
        main: 'calc(100vh - 60px)',
      },
      maxHeight: {
        modal: 'calc(100vh - 10rem)',
      },
      minWidth: {
        5: '1.25rem', // `window-list.svelte` image container
      },
      margin: {
        outline: '2px', // to allow space for focus ring outline
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

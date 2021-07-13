module.exports = {
  purge: ['./src/popup/**/*.{svelte,html}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      zIndex: {
        header: 100,
        'menu-accordion': 80,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

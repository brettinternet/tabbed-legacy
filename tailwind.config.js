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
      },
      height: {
        modal: '30rem',
      },
      fontSize: {
        xxs: '.6rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

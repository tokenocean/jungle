const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.{js,svelte}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF8B00',
        secondary: '#CEDC21',
        gray: colors.trueGray,
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgb (255, 139, 0)',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class', // Enable auto dark mode
};
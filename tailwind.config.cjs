module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.{js,svelte}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    },
    extend: {
      colors: {
        primary: "#FF8B00",
        secondary: "#CEDC21",
      } 
    },
    // Add light and dark mode variants for background-color, text-color, etc.
    // (Note: This requires TailwindCSS v2.2 or later)
    backgroundColor: theme => ({
      ...theme('colors'),
      'primary-dark': '#151719',
      'secondary-dark': '#4B5563'
    }),
    textColor: theme => ({
      ...theme('colors'),
      'primary-dark': '#151719',
      'secondary-dark': '#D1D5DB'
    })
  }, 
  // Set darkMode to 'media' to enable automatic switching based on the user's system preferences
  darkMode: 'media', 
  plugins: [],

  variants: {
    borderWidth: ["responsive", "hover", "focus"],
  }
};

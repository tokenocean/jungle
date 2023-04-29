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
    } 
  },
  darkMode: 'class',

  plugins: [],

  variants: {
    borderWidth: ["responsive", "hover", "focus"],
  },
};

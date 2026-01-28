/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts}", "./index.html"],
  theme: {
    extend: {
      colors: {
        primary: '#2c5aa0',
        secondary: '#1e3d72',
        accent: '#ff6b35',
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
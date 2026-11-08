/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rapido: {
          yellow: '#F9C80E',
          dark: '#121417',
          surface: '#1E2228',
          card: '#16191E',
          border: '#2A303C'
        }
      }
    },
  },
  plugins: [],
};

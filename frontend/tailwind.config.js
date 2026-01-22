/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#6B0F1A',
          main: '#8C1D18',
          light: '#A62E25',
        },
        dark: {
          bg: '#1A1A1A',
          border: '#2A2A2A',
          hover: '#333333',
        },
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.15)',
        'premium': '0 8px 32px rgba(139, 29, 24, 0.2)',
      },
    },
  },
  plugins: [],
};

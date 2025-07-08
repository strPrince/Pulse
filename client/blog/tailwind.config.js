/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#181a20',
        surface: '#23272f',
        primary: '#4a90e2',
        secondary: '#e25555',
        accent: '#ffd700',
        muted: '#b0b3b8',
        border: '#333',
        card: '#23272f',
        text: '#e6e6ff',
        link: '#4a90e2',
        error: '#e25555',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}


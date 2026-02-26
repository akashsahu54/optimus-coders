/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Orbitron", "sans-serif"],
        mono: ["Share Tech Mono", "monospace"],
      },
      colors: {
        'cyber-dark': '#0a0a0f',
        'neon-cyan': '#00f5ff',
        'neon-magenta': '#ff00c8',
        'neon-green': '#00ff88',
        'error-red': '#ff0044',
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00f5ff, 0 0 10px #00f5ff, 0 0 20px #00f5ff',
        'neon-magenta': '0 0 5px #ff00c8, 0 0 10px #ff00c8, 0 0 20px #ff00c8',
        'neon-green': '0 0 5px #00ff88, 0 0 10px #00ff88, 0 0 20px #00ff88',
      },
    },
  },
  plugins: [],
};

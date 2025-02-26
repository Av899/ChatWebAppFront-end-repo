/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      animation: {
        shake: 'shake 0.5s ease-in-out infinite'
      },
      keyframes: {
        shake: {
          '0%, 100%': { 
            transform: 'translate(0, 0) rotate(0deg)' 
          },
          '10%, 30%, 50%, 70%, 90%': { 
            transform: 'translate(-1px, -1px) rotate(-1deg)' 
          },
          '20%, 40%, 60%, 80%': { 
            transform: 'translate(1px, 1px) rotate(1deg)' 
          }
        },
      }
    },
  },
  plugins: [],
  darkMode: "class",
}



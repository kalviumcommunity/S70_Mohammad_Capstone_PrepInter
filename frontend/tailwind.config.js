/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        caveat: ['Caveat', 'cursive'],
        epilogue: ['Epilogue', 'sans-serif'],
        inclusive: ['"Inclusive Sans"', 'sans-serif'],
      },
      
      colors: {
        highlight: '#DCFF50',
        grayText: '#8D8A8A',
      },
      backgroundImage: {
        'diamond-gradient': 'radial-gradient(circle, #000000, #4E4E4E)',
      },
    },
  },
  plugins: [],
}

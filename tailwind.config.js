/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightRed: '#F6A6A6',      
        lightGreen: '#A4E8A4',    
        yellowCustom: '#D9D970',  
        violetCustom: '#B5A3E3',  
      },
    },
  },
  plugins: [],
}
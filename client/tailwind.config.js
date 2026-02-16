/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: '#09090b',     
        card: '#18181b',       
        accent: '#FACC15',     
        border: '#27272a',     
        textMain: '#fafafa',    
        textMuted: '#a1a1aa',   
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
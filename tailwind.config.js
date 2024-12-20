/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        dela: ['Dela Gothic One', 'sans-serif'], // Adding the custom font
        poppins: ['Poppins', 'sans-serif'], // Add Poppins as a custom font
        orbitron: ['Orbitron', 'sans-serif'], // Custom font for Orbitron
      },
      colors: {
        customBlue: '#96CDE8',
        customgreen: "#79CC9E",
        custombackgr: "#103362",
      },
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        // Add more fine-grained spacing if needed
      }
    },
  },
  plugins: [],
}
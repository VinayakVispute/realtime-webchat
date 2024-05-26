/** @type {import('tailwindcss').Config} */
module.exports = {
  backgroundImage: {
    "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
    "gradient-conic":
      "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
  },
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
    "./assets/svg/**/*.{svg}",
  ],

  theme: {},
  extend: {},
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        headerBackground: "#3D3A40",
        headerText: "#9B9BA1",
      },
      screens: {
        'xs': '320px',
        'beforelg': '781px',
      },
    },
  },
  plugins: [],
};

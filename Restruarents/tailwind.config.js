/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF5216",
          50: "#FFF4EF",
          100: "#FFE8DE",
          200: "#FFD0BD",
          300: "#FFAF8E",
          400: "#FF7B47",
          500: "#FF5216",
          600: "#E63A00",
          700: "#B82E00",
          800: "#942704",
          900: "#792308",
        },
        fastor: {
          orange: "#FA5A2A",
          orangeDark: "#E84E20",
          orangeLight: "#FFF2EC",
          border: "#EAEAEA",
          grayText: "#8E8E93",
          lightBg: "#F7F8FA",
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        'mobile': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'key': '0 2px 4px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
};


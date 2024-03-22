/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Lexend"', "sans-serif"],
      },
      colors: {
        primary: {
          bg: "#EDB046",
          gray: "#B5B5B5",
          DEFAULT: "#BA5112",
        },
        backgroundImage: {
          "bg-mobile": "url('/src/assets/auth-bg-mobile.png')",
          "footer-texture": "url('/img/footer-texture.png')",
        },
        secondary: "#251814",
      },
      content: {
        "add-icon": "url('/src/assets/add-icon.png')",
        "logout-icon": "url('/src/assets/logout-icon.svg')",
      },
    },
    screens: {
      md: "950px",
      tablet: "650px",
      sm: "500px",
      mobile: "375px",
    },
  },
  plugins: [],
};

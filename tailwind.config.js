module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateColumns: {
        // Complex site-specific column configuration
        board: "1fr auto 19vw",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

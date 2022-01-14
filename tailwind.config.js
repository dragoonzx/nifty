module.exports = {
  mode: "jit",
  purge: {
    enabled: process.env.NODE_ENV === "production",
    safeList: [],
    content: ["./src/**/*.tsx", "./src/**/*.ts", "./src/**/*.js"],
  },
  theme: {
    minWidth: {
      20: "2.5rem",
      30: "5rem",
      40: "10rem",
      60: "15rem",
      80: "20rem",
      100: "25rem",
    },
    maxWidth: {
      120: "30rem",
      160: "40rem",
      200: "50rem",
    },
  },
  variants: {},
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["forest", "dark", "light"],
  },
};

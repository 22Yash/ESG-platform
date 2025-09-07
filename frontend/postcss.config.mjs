const config = {
  plugins: {
    "@tailwindcss/postcss": {
      experimental: {
        disableColorFunctions: true, // 🔑 disables oklch()/lab()
      },
    },
    autoprefixer: {},
  },
};
export default config;
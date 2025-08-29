// This config file is incomplete and will cause bugs at build, read on for more
import react from "@vitejs/plugin-react";
import * as path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: __dirname,
    }),
  ],
  build: {
    lib: {
      entry: {
        "@org/common": path.resolve(__dirname, "index.tsx"),
      },
      name: "CommonElements",
      fileName: (format, entryName) => `${entryName}-${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "react-dom",
        "react-native",
        "react/jsx-runtime",
      ],
      output: {
        globals: {
          react: "React",
          "react/jsx-runtime": "jsxRuntime",
          "react-native": "ReactNative",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

// import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "watch-content-folder",
      configureServer(server) {
        fs.watch("./content", { recursive: true }, () => {
          server.ws.send({
            type: "full-reload",
          });
        });
      },
    },
    // viteStaticCopy({
    //   targets: [
    //     { src: "content", dest: "" }, // Copies content folder to build
    //   ],
    // }),
  ],
  dev: {
    outDir: "docs", // Output the build to the docs folder
    rollupOptions: {
      input: "/index.html", // Main HTML entry point
    },
  },
  build: {
    ssr: true,
    rollupOptions: {
      input: "./render.jsx", // Updated input file
      output: {
        format: "cjs",
        entryFileNames: "render.cjs",
      },
    },
    outDir: "build",
  },
});

import { sveltekit } from "@sveltejs/kit/vite";
import shim from "@asoltys/vite-plugin-stream-shim";
import path from "path";
import aspectRatio from "@tailwindcss/aspect-ratio";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit(), shim(), aspectRatio()],
  resolve: {
    alias: {
      $comp: path.resolve("src/components/index.js"),
      $components: path.resolve("src/components"),
      $queries: path.resolve("src/queries"),
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8091",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  ssr: {
    noExternal: [
      "@fortawesome/free-brands-svg-icons",
      "@fortawesome/free-regular-svg-icons",
      "@fortawesome/free-solid-svg-icons",
    ],
  },
};

export default config;

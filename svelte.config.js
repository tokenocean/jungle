import preprocess from "svelte-preprocess";
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcss from "postcss-preset-env";
import nesting from "postcss-nesting";
import node from "@sveltejs/adapter-node";

export default {
  kit: {
    adapter: node(),
  },
  preprocess: preprocess({
    postcss: {
      plugins: [tailwind(), autoprefixer(), nesting()],
    },
  }),
};

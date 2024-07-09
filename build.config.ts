import { defineBuildConfig } from "unbuild";

export default defineBuildConfig([
  // esm
  {
    entries: ["./src/index"],
    outDir: "dist",
    declaration: true,
    clean: true,
    rollup: {
      output: {
        format: "esm",
        entryFileNames: "[name].esm.js",
        chunkFileNames: "[name].esm.js",
      },
    },
  },
  //cjs
  {
    entries: ["./src/index.ts"],
    outDir: "dist",
    rollup: {
      output: {
        format: "cjs",
        entryFileNames: "[name].cjs.js",
        chunkFileNames: "[name].cjs.js",
      },
    },
  },
  // umd
  {
    entries: ["./src/index.ts"],
    outDir: "dist",
    rollup: {
      output: {
        name: "easyWebStore",
        format: "umd",
        entryFileNames: "[name].umd.js",
        chunkFileNames: "[name].umd.js",
      },
      esbuild: {
        minify: true,
      },
    },
  },
]);

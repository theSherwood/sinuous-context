import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "./src/context.js",
    output: [
      {
        file: "dist/context.min.js",
        format: "iife",
        compact: true,
        plugins: [terser()]
      }
    ]
  },
  {
    input: "./src/index.js",
    output: [
      {
        file: "dist/context.module.js",
        format: "esm",
        compact: true,
        plugins: [terser()]
      }
    ]
  }
];

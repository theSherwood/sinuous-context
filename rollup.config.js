import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "./src/context.js",
    output: [
      {
        file: "dist/min.js",
        name: "sinuousContext",
        format: "iife",
        compact: true,
        plugins: [terser()]
      },
      {
        file: "dist/module.js",
        format: "esm",
        compact: true,
        plugins: [terser()]
      }
    ]
  }
];

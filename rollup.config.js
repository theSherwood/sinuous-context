import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "./src/index.js",
    output: [
      {
        file: "dist/min.js",
        name: "sinuousContext",
        format: "iife",
        globals: {
          sinuous: "S",
        },
        compact: true,
        plugins: [terser()],
      },
    ],
  },
];

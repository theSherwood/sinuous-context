import { terser } from 'rollup-plugin-terser';
import bundleSize from 'rollup-plugin-size';
import gzip from 'rollup-plugin-gzip';
import sourcemaps from 'rollup-plugin-sourcemaps';
import nodeResolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: "src/context.js",
    output: [
      {
        file: "dist/min.js",
        name: "sinuousContext",
        format: "iife",
        globals: {
          sinuous: "S",
        },
        compact: true,
        plugins: [
          bundleSize({
            columnWidth: 25,
          }),
          sourcemaps(),
          nodeResolve(),
          terser({
            compress: {
              passes: 2,
            },
            mangle: {
              properties: {
                regex: /^_/,
              },
            },
          }),
          gzip(),
        ],
      },
    ],
  },
];

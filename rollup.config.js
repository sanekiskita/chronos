import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

import { defineConfig } from 'rollup';

const INPUT = 'src/index.ts';
const PLUGINS = [
  nodeResolve({
    extensions: ['.ts', '.tsx', '.js'],
  }),
  commonjs(),
]

export default defineConfig([
  {
    input: INPUT,
    output: {
      dir: './dist/cjs',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      ...PLUGINS,
      typescript({
        tsconfig: 'tsconfig.json',
        compilerOptions: {
          outDir: "./dist/cjs",
          declaration: false,
          declarationDir: "./dist/cjs/types",
        },
      }),
    ],
  },
  {
    input: INPUT,
    output: {
      dir: 'dist/min',
      format: 'cjs',
      sourcemap: true,
      plugins: [
        terser({
          format: {
            comments: false
          }
        }),
      ],
    },
    plugins: [
      ...PLUGINS,
      typescript({
        tsconfig: 'tsconfig.json',
        compilerOptions: {
          outDir: "./dist/min",
          declaration: false,
          declarationDir: "./dist/min/types",
        },
      }),
    ],
  },
  {
    input: INPUT,
    output: {
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      ...PLUGINS,
      typescript({
        tsconfig: 'tsconfig.json',
        compilerOptions: {
          outDir: "./dist/esm",
        },
      }),
    ],
  },
]);
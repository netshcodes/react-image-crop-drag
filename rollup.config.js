import { copyFileSync, mkdirSync } from 'fs';

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const copyTypes = {
  name: 'copy-types',
  writeBundle() {
    mkdirSync('dist', { recursive: true });
    copyFileSync('src/index.d.ts', 'dist/index.d.ts');
  }
};

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'auto'
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      exports: 'auto'
    }
  ],
  external: ['react', 'react-dom'],
  plugins: [
    resolve({
      extensions: ['.js', '.jsx']
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react'],
      extensions: ['.js', '.jsx']
    }),
    commonjs(),
    copyTypes
  ]
}

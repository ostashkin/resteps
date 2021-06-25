import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default {
  input: './src/index.ts',
  output: [
    {
      name: 'resteps',
      file: pkg.browser,
      format: 'umd',
      globals: { react: 'React' },
    },
    {
      file: pkg.main,
      format: 'cjs',
      globals: { react: 'React' },
    },
    {
      file: pkg.module,
      format: 'es',
      globals: { react: 'React' },
    },
  ],
  plugins: [typescript(), terser()],
  external: ['react'],
};

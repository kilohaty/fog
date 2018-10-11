import typescript from 'rollup-plugin-typescript';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: './src/index.ts',
  output: {
    file: 'dist/bundle/fog.js',
    format: 'umd',
    name: 'fog',
    exports: 'default',
    sourcemap: true
  },
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
    nodeResolve({jsnext: true, main: true}),
  ],
}